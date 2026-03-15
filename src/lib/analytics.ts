import { supabase } from "@/integrations/supabase/client"

export const ANALYTICS_EVENTS = {
  appealSubmitted: "appeal_submitted",
  blockCreated: "block_created",
  callStarted: "call_connected",
  callEnded: "call_ended",
  chatStarted: "chat_started",
  checkoutStarted: "checkout_started",
  dropCheckedIn: "drop_checked_in",
  dropRsvpCancelled: "drop_rsvp_cancelled",
  dropRsvpCreated: "drop_rsvp_created",
  experimentExposed: "experiment_exposed",
  landingPrimaryCtaClicked: "landing_cta_clicked",
  landingViewed: "landing_viewed",
  lobbyJoined: "lobby_joined",
  lobbyViewed: "lobby_viewed",
  matchFound: "match_found",
  messageSent: "message_sent",
  mutualSparkRevealed: "mutual_spark_revealed",
  notificationOpened: "notification_opened",
  notificationReceived: "notification_received",
  onboardingCompleted: "onboarding_completed",
  onboardingStepCompleted: "onboarding_step_completed",
  onboardingStepSkipped: "onboarding_step_skipped",
  onboardingStepViewed: "onboarding_step_viewed",
  passChosen: "pass_submitted",
  postCallFeedbackSubmitted: "post_call_feedback_submitted",
  purchaseCompleted: "purchase_completed",
  queueTimedOut: "queue_timed_out",
  reactivationEmailOpened: "reactivation_email_opened",
  reactivationReturned: "reactivation_returned",
  reminderSet: "reminder_set",
  reportSubmitted: "report_submitted",
  signupCompleted: "signup_completed",
  signupStarted: "signup_started",
  speechFallbackUsed: "speech_fallback_used",
  sparkChosen: "spark_submitted",
  tokenShopViewed: "token_shop_viewed",
} as const

type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]

export type AnalyticsPayload = Record<
  string,
  boolean | number | string | null | undefined
>

const ANALYTICS_SESSION_STORAGE_KEY = "verity:analytics:session-id"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    plausible?: (
      eventName: string,
      options?: { props?: AnalyticsPayload },
    ) => void
    Tinybird?: {
      trackEvent?: (
        eventName: string,
        payload?: AnalyticsPayload,
      ) => Promise<unknown> | void
    }
  }
}

const createSessionId = (): string => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

let sessionId: string | null = null

function getSessionId(): string {
  if (sessionId) {
    return sessionId
  }

  try {
    const existing = window.localStorage.getItem(ANALYTICS_SESSION_STORAGE_KEY)
    if (existing) {
      sessionId = existing
      return existing
    }
  } catch {
    // Ignore storage failures and fall back to an in-memory session id.
  }

  const nextSessionId = createSessionId()
  sessionId = nextSessionId

  try {
    window.localStorage.setItem(ANALYTICS_SESSION_STORAGE_KEY, nextSessionId)
  } catch {
    // Ignore storage failures and keep the in-memory id.
  }

  return nextSessionId
}

async function recordFirstPartyEvent(
  name: AnalyticsEventName,
  properties: AnalyticsPayload,
): Promise<void> {
  const { error } = await supabase.functions.invoke("collect-product-event", {
    body: {
      event_name: name,
      properties,
      session_id: getSessionId(),
    },
  })

  if (error) {
    throw error
  }
}

export function trackEvent(
  name: AnalyticsEventName,
  properties: AnalyticsPayload = {},
): void {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(
    new CustomEvent("verity:analytics", {
      detail: {
        name,
        properties,
        recordedAt: new Date().toISOString(),
      },
    }),
  )

  void recordFirstPartyEvent(name, properties).catch((error) => {
    console.warn("[analytics] Failed to record event", name, error)
  })

  if (typeof window.Tinybird?.trackEvent === "function") {
    void window.Tinybird.trackEvent(name, properties)
  }

  if (typeof window.plausible === "function") {
    window.plausible(name, { props: properties })
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", name, properties)
  }
}

export function getVariant(
  userId: string,
  experimentKey: string,
  variants: string[],
): string {
  if (variants.length === 0) {
    return "control"
  }

  let hash = 0
  const value = `${userId}:${experimentKey}`

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return variants[Math.abs(hash) % variants.length]
}
