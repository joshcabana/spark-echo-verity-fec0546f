import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const body = await req.json();
    const { key, max_requests, window_seconds } = body;

    if (!key || typeof key !== "string") {
      return new Response(
        JSON.stringify({ error: "key is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const admin = createClient(supabaseUrl, serviceKey);

    const { data, error } = await admin.rpc("check_rate_limit", {
      p_key: key,
      p_max_requests: max_requests ?? 60,
      p_window_seconds: window_seconds ?? 60,
    });

    if (error) {
      console.error("Rate limit check error:", error);
      throw new Error("Rate limit check failed");
    }

    const allowed = data as boolean;

    return new Response(
      JSON.stringify({ allowed }),
      {
        status: allowed ? 200 : 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("rate-limit error:", error);
    const corsHeaders = getCorsHeaders(req);
    return new Response(
      JSON.stringify({ error: "Rate limit check failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
