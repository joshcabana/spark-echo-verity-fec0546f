import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { getCorsHeaders } from "../_shared/cors.ts"

const PUBLIC_EVENTS = new Set([
  "landing_cta_clicked",
  "landing_viewed",
])

const LEGACY_EVENT_ALIASES = {
  call_started: "call_connected",
  landing_primary_cta_clicked: "landing_cta_clicked",
  lobby_entered: "lobby_viewed",
  pass_chosen: "pass_submitted",
  spark_chosen: "spark_submitted",
} as const

const VALID_EVENTS = new Set([
  "appeal_submitted",
  "block_created",
  "call_connected",
  "call_ended",
  "chat_started",
  "checkout_started",
  "drop_checked_in",
  "drop_rsvp_cancelled",
  "drop_rsvp_created",
  "experiment_exposed",
  "landing_cta_clicked",
  "landing_viewed",
  "lobby_joined",
  "lobby_viewed",
  "match_found",
  "message_sent",
  "mutual_spark_revealed",
  "notification_opened",
  "notification_received",
  "onboarding_completed",
  "onboarding_step_completed",
  "onboarding_step_skipped",
  "onboarding_step_viewed",
  "pass_submitted",
  "post_call_feedback_submitted",
  "purchase_completed",
  "queue_timed_out",
  "reactivation_email_opened",
  "reactivation_returned",
  "reminder_set",
  "report_submitted",
  "signup_completed",
  "signup_started",
  "speech_fallback_used",
  "spark_submitted",
  "token_shop_viewed",
])

const MILESTONE_COLUMNS = {
  call_connected: "first_call_at",
  drop_rsvp_created: "first_rsvp_at",
  lobby_viewed: "first_lobby_seen_at",
  mutual_spark_revealed: "first_mutual_spark_at",
} as const

type AnalyticsScalar = boolean | number | string | null
type AnalyticsProperties = Record<string, AnalyticsScalar>

const isAnalyticsProperties = (value: unknown): value is AnalyticsProperties => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false
  }

  return Object.values(value).every(
    (entry) =>
      entry === null ||
      typeof entry === "boolean" ||
      typeof entry === "number" ||
      typeof entry === "string",
  )
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Supabase client configuration is missing" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }

    const authHeader = req.headers.get("Authorization")
    const authClient = createClient(
      supabaseUrl,
      anonKey,
      authHeader?.startsWith("Bearer ")
        ? { global: { headers: { Authorization: authHeader } } }
        : {},
    )
    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    let userId: string | null = null

    if (authHeader?.startsWith("Bearer ")) {
      const {
        data: { user },
        error: userError,
      } = await authClient.auth.getUser()

      if (!userError && user) {
        userId = user.id
      }
    }

    const body = (await req.json()) as Record<string, unknown>
    const eventName =
      typeof body.event_name === "string" ? body.event_name.trim() : ""
    const normalizedEventName =
      LEGACY_EVENT_ALIASES[eventName as keyof typeof LEGACY_EVENT_ALIASES] ?? eventName

    if (!eventName) {
      return new Response(
        JSON.stringify({ error: "event_name is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }

    if (!VALID_EVENTS.has(normalizedEventName)) {
      return new Response(
        JSON.stringify({ error: `Unknown event: ${eventName}` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }

    const rawProperties = body.properties
    if (
      rawProperties !== undefined &&
      !isAnalyticsProperties(rawProperties)
    ) {
      return new Response(
        JSON.stringify({ error: "properties must be a flat JSON object" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }

    const sessionId =
      body.session_id === undefined || body.session_id === null
        ? null
        : typeof body.session_id === "string" &&
            body.session_id.trim().length > 0 &&
            body.session_id.length <= 200
          ? body.session_id.trim()
          : null

    if (body.session_id !== undefined && body.session_id !== null && !sessionId) {
      return new Response(
        JSON.stringify({ error: "session_id must be a non-empty string" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }

    if (!userId && !PUBLIC_EVENTS.has(normalizedEventName)) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }

    const properties = rawProperties ?? {}
    const { error: insertError } = await adminClient.from("product_events").insert({
      event_name: normalizedEventName,
      properties,
      session_id: sessionId,
      user_id: userId,
    })

    if (insertError) {
      console.error("collect-product-event insert failed", insertError)
      return new Response(
        JSON.stringify({ error: "Failed to record event" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }

    const milestoneColumn =
      MILESTONE_COLUMNS[normalizedEventName as keyof typeof MILESTONE_COLUMNS]

    if (milestoneColumn && userId) {
      const { error: updateError } = await adminClient
        .from("profiles")
        .update({ [milestoneColumn]: new Date().toISOString() })
        .eq("user_id", userId)
        .is(milestoneColumn, null)

      if (updateError) {
        console.error(
          `collect-product-event milestone update failed for ${milestoneColumn}`,
          updateError,
        )
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("collect-product-event unexpected error", error)
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      {
        status: 500,
        headers: {
          ...getCorsHeaders(req),
          "Content-Type": "application/json",
        },
      },
    )
  }
})
