import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RateLimitRequest {
  key: string;
  max_requests: number;
  window_seconds: number;
}

interface RateLimitResponse {
  allowed: boolean;
  remaining: number;
  reset_at: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { key, max_requests, window_seconds }: RateLimitRequest = await req.json();

    if (!key || !max_requests || !window_seconds) {
      return new Response(
        JSON.stringify({ error: "key, max_requests, and window_seconds are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Delegate to the atomic SQL RPC to avoid race conditions
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_key: key,
      p_max_requests: max_requests,
      p_window_seconds: window_seconds,
    });

    if (error) {
      throw new Error(error.message);
    }

    const { allowed, remaining, reset_at } = data as RateLimitResponse;

    return new Response(JSON.stringify({ allowed, remaining, reset_at }), {
      status: allowed ? 200 : 429,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "X-RateLimit-Limit": String(max_requests),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": reset_at,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
