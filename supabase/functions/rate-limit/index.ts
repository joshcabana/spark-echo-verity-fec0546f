import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";

const RATE_LIMIT_POLICIES = {
  default: {
    maxRequests: 30,
    windowSeconds: 60,
  },
} as const;

type RateLimitScope = keyof typeof RATE_LIMIT_POLICIES;

interface RateLimitRequest {
  scope?: RateLimitScope;
}

interface RateLimitResponse {
  allowed: boolean;
  remaining: number;
  reset_at: string;
}

function jsonResponse(
  body: unknown,
  corsHeaders: Record<string, string>,
  init: ResponseInit = {},
) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

function getRequestIdentity(req: Request): string | null {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const clientIp = forwardedFor?.split(",")[0]?.trim()
    ?? req.headers.get("cf-connecting-ip")
    ?? req.headers.get("x-real-ip");

  return clientIp ? `ip:${clientIp}` : null;
}

serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json().catch(() => ({})) as RateLimitRequest;
    const scope = payload.scope ?? "default";

    if (!(scope in RATE_LIMIT_POLICIES)) {
      return jsonResponse(
        { error: "Unsupported rate limit scope" },
        corsHeaders,
        { status: 400 },
      );
    }

    const authHeader = req.headers.get("Authorization");
    let identity = getRequestIdentity(req);

    if (authHeader?.startsWith("Bearer ")) {
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });

      const {
        data: { user },
      } = await userClient.auth.getUser();

      if (user) {
        identity = `user:${user.id}`;
      }
    }

    if (!identity) {
      return jsonResponse(
        { error: "Unable to determine request identity" },
        corsHeaders,
        { status: 400 },
      );
    }

    const { maxRequests, windowSeconds } = RATE_LIMIT_POLICIES[scope];

    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_key: `${scope}:${identity}`,
      p_max_requests: maxRequests,
      p_window_seconds: windowSeconds,
    });

    if (error) {
      throw new Error(error.message);
    }

    const { allowed, remaining, reset_at } = data as RateLimitResponse;

    return jsonResponse(
      { allowed, remaining, reset_at, scope },
      corsHeaders,
      {
        status: allowed ? 200 : 429,
        headers: {
          "X-RateLimit-Limit": String(maxRequests),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": reset_at,
        },
      },
    );
  } catch (error) {
    return jsonResponse({ error: String(error) }, corsHeaders, { status: 500 });
  }
});
