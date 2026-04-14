import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";
import { rateLimitOrResponse } from "../_shared/rate-limit.ts";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const urlRegex = /^https?:\/\/.{1,2000}$/;

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const limited = rateLimitOrResponse(`submit-appeal:${user.id}`, 3, 60_000, corsHeaders);
    if (limited) {
      return limited;
    }

    const body = await req.json();

    // Validate inputs
    const appealTextRaw =
      typeof body.appeal_text === "string"
        ? body.appeal_text
        : typeof body.explanation === "string"
          ? body.explanation
          : "";
    const appeal_text = appealTextRaw.trim();
    if (appeal_text.length < 10 || appeal_text.length > 2000) {
      return new Response(JSON.stringify({ error: "Appeal text must be 10-2000 characters" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const voice_note_url = body.voice_note_url ? String(body.voice_note_url).trim() : null;
    if (voice_note_url && !urlRegex.test(voice_note_url)) {
      return new Response(JSON.stringify({ error: "Invalid voice note URL" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const moderationEventIdRaw = body.moderation_event_id ?? body.flag_id;
    const moderation_event_id = moderationEventIdRaw ? String(moderationEventIdRaw).trim() : "";
    if (!uuidRegex.test(moderation_event_id)) {
      return new Response(JSON.stringify({ error: "Invalid moderation_event_id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data, error } = await supabase
      .from("appeals")
      .insert({
        user_id: user.id,
        appeal_text,
        voice_note_url,
        moderation_event_id,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, appeal: data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
