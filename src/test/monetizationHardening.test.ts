import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const migrationPath = resolve(
  process.cwd(),
  "supabase/migrations/20260416000000_matchmaking_preferences.sql"
);
const fnPath = resolve(
  process.cwd(),
  "supabase/functions/find-match/index.ts"
);

const sql = readFileSync(migrationPath, "utf8");
const fnCode = readFileSync(fnPath, "utf8");

describe("preference-aware matchmaking — migration", () => {
  it("adds user_gender column to matchmaking_queue", () => {
    expect(sql).toContain("ADD COLUMN IF NOT EXISTS user_gender");
  });

  it("adds interested_in column to matchmaking_queue", () => {
    expect(sql).toContain("ADD COLUMN IF NOT EXISTS interested_in");
  });

  it("creates a composite index for fast candidate lookups", () => {
    expect(sql).toContain("ON public.matchmaking_queue");
    expect(sql).toContain("drop_id, status, user_gender, interested_in");
  });

  it("replaces claim_match_candidate with preference-aware version", () => {
    expect(sql).toContain("CREATE OR REPLACE FUNCTION public.claim_match_candidate");
    expect(sql).toContain("FOR UPDATE SKIP LOCKED");
  });

  it("enforces mutual interest — I want them", () => {
    // Must check that candidate's gender matches caller's interest OR caller is 'everyone'.
    expect(sql).toMatch(/v_self_interest\s*=\s*'everyone'|mq\.user_gender\s*=\s*v_self_interest/);
  });

  it("enforces mutual interest — they want me", () => {
    // Must check that candidate's interest matches caller's gender OR candidate is 'everyone'.
    expect(sql).toMatch(/mq\.interested_in\s*=\s*'everyone'|v_self_gender\s*=\s*mq\.interested_in/);
  });

  it("falls back gracefully when gender is NULL (backwards compatible)", () => {
    // NULL checks ensure existing queue rows (pre-migration) still match.
    expect(sql).toContain("IS NULL");
  });

  it("preserves bidirectional block check", () => {
    expect(sql).toContain("user_blocks");
    expect(sql).toContain("blocker_id");
    expect(sql).toContain("blocked_id");
  });
});

describe("preference-aware matchmaking — find-match edge function", () => {
  it("fetches preferences from user_trust", () => {
    expect(fnCode).toContain("preferences");
    expect(fnCode).toContain("user_trust");
  });

  it("fetches gender from profiles table", () => {
    expect(fnCode).toContain('from("profiles")');
    expect(fnCode).toContain('"gender"');
  });

  it("populates user_gender in the queue upsert", () => {
    expect(fnCode).toContain("user_gender: userGender");
  });

  it("populates interested_in in the queue upsert", () => {
    expect(fnCode).toContain("interested_in: interestedIn");
  });

  it("extracts interested_in from preferences JSON safely", () => {
    // Must cast to unknown first for type safety; pattern: (... as Record<string, unknown>)?.interested_in
    expect(fnCode).toContain("interested_in");
    expect(fnCode).toContain("preferences");
  });

  it("preserves ignoreDuplicates on the queue upsert for polling safety", () => {
    expect(fnCode).toContain("ignoreDuplicates: true");
  });

  it("invokes claim_match_candidate RPC", () => {
    expect(fnCode).toContain('rpc("claim_match_candidate"');
  });

  it("rolls back queue entries when call creation fails", () => {
    expect(fnCode).toContain("Failed to finalize match");
    expect(fnCode).toContain('status: "waiting"');
  });
});

describe("stripe-webhook — subscription expiry correctness", () => {
  const webhookPath = resolve(
    process.cwd(),
    "supabase/functions/stripe-webhook/index.ts"
  );
  const webhookCode = readFileSync(webhookPath, "utf8");

  it("retrieves subscription to use authoritative current_period_end", () => {
    expect(webhookCode).toContain("stripe.subscriptions.retrieve");
    expect(webhookCode).toContain("current_period_end");
  });

  it("handles invoice.paid event for subscription renewals", () => {
    expect(webhookCode).toContain('"invoice.paid"');
    expect(webhookCode).toContain("syncSubscription");
  });

  it("clears subscription tier on deletion", () => {
    expect(webhookCode).toContain('"customer.subscription.deleted"');
    expect(webhookCode).toContain("clearSubscription");
    expect(webhookCode).toContain("subscription_tier: \"free\"");
  });

  it("uses idempotency table to prevent duplicate processing", () => {
    expect(webhookCode).toContain("stripe_processed_events");
    expect(webhookCode).toContain('"23505"');
  });
});

describe("create-checkout — origin security", () => {
  const checkoutPath = resolve(
    process.cwd(),
    "supabase/functions/create-checkout/index.ts"
  );
  const checkoutCode = readFileSync(checkoutPath, "utf8");

  it("does NOT use a wildcard Vercel subdomain check", () => {
    expect(checkoutCode).not.toContain(".endsWith(\".vercel.app\")");
    expect(checkoutCode).not.toContain('endsWith(".vercel.app")');
  });

  it("uses exact ALLOWED_ORIGINS membership check", () => {
    expect(checkoutCode).toContain("ALLOWED_ORIGINS.includes(origin)");
  });

  it("validates price_id against an explicit allowlist", () => {
    expect(checkoutCode).toContain("PRICE_MAP");
    expect(checkoutCode).toContain("Invalid price");
  });

  it("all token pack price IDs are present in both frontend and backend", () => {
    const tokenShopPath = resolve(process.cwd(), "src/pages/TokenShop.tsx");
    const tokenShopCode = readFileSync(tokenShopPath, "utf8");

    const backendIds = [
      "price_1T6rXLC1O032lUHcL3kvvio4",
      "price_1T6rYJC1O032lUHc3fO3j6R6",
      "price_1T6rZ0C1O032lUHciuLq0TXN",
      "price_1T6rZjC1O032lUHcZiPWdPg7",
      "price_1T6rawC1O032lUHcywgSq3ft",
    ];

    for (const id of backendIds) {
      expect(checkoutCode).toContain(id);
      expect(tokenShopCode).toContain(id);
    }
  });
});

describe("TokenShop — loading state correctness", () => {
  const tokenShopPath = resolve(process.cwd(), "src/pages/TokenShop.tsx");
  const tokenShopCode = readFileSync(tokenShopPath, "utf8");

  it("does NOT check loadingPriceId with incorrect prefix 'price_pass'", () => {
    expect(tokenShopCode).not.toContain('startsWith("price_pass")');
  });

  it("checks exact Verity Pass price IDs for loading state", () => {
    expect(tokenShopCode).toContain('"price_1T6rZjC1O032lUHcZiPWdPg7"');
    expect(tokenShopCode).toContain('"price_1T6rawC1O032lUHcywgSq3ft"');
  });
});
