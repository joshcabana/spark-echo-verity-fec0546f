import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";

const ALLOWED_EVENTS = new Set([
  // Onboarding
  "onboarding_started",
  "onboarding_step_completed",
  "onboarding_completed",
  "age_gate_passed",
  "safety_pledge_accepted",
  "selfie_verified",
  "phone_verified",
  // Auth
  "signup_started",
  "signup_completed",
  "login_completed",
  "logout",
  // Drops & Lobby
  "drop_viewed",
  "drop_rsvp",
  "drop_rsvp_created",
  "drop_rsvp_cancelled",
  "drop_checked_in",
  "lobby_entered",
  "matchmaking_started",
  "matchmaking_cancelled",
  "match_found",
  // Calls
  "call_started",
  "call_ended",
  "call_duration",
  "guardian_alert_sent",
  "safe_exit_used",
  // Spark decisions
  "spark_chosen",
  "pass_chosen",
  "mutual_spark",
  // Chat & Sparks
  "chat_opened",
  "message_sent",
  "voice_intro_sent",
  "spark_extended",
  // Profile
  "profile_updated",
  "avatar_uploaded",
  // Token shop
  "token_shop_viewed",
  "token_purchase_started",
  "token_purchase_completed",
  // Referrals
  "referral_link_generated",
  "referral_accepted",
  // Settings
  "push_enabled",
  "push_disabled",
  "account_deleted",
  // Landing
  "landing_viewed",
  "landing_primary_cta_clicked",
  "waitlist_joined",
  "cta_clicked",
  // Vault
  "vault_viewed",
  "replay_watched",
  // Reflection
  "reflection_submitted",
  // Reports
  "report_submitted",
]);

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const body = await req.json();
    const { event_name, properties, session_id } = body;

    if (!event_name || typeof event_name !== "string") {
      return new Response(
        JSON.stringify({ error: "event_name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!ALLOWED_EVENTS.has(event_name)) {
      return new Response(
        JSON.stringify({ error: "Unknown event" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try to get authenticated user (optional)
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      userId = user?.id ?? null;
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Insert the event
    const { error: insertErr } = await admin.from("product_events").insert({
      event_name,
      user_id: userId,
      session_id: session_id || null,
      properties: properties || {},
    });

    if (insertErr) {
      console.error("Insert error:", insertErr);
      throw new Error("Failed to record event");
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("collect-product-event error:", error);
    const corsHeaders = getCorsHeaders(req);
    const msg = error instanceof Error ? error.message : "An error occurred";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
