import { supabase } from "@/integrations/supabase/client";

export const ANALYTICS_EVENTS = {
  callStarted: "call_started",
  dropCheckedIn: "drop_checked_in",
  dropRsvpCreated: "drop_rsvp_created",
  landingPrimaryCtaClicked: "landing_primary_cta_clicked",
  matchFound: "match_found",
  onboardingCompleted: "onboarding_completed",
  passChosen: "pass_chosen",
  reportSubmitted: "report_submitted",
  sparkChosen: "spark_chosen",
} as const;

type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type AnalyticsPayload = Record<string, boolean | number | string | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (eventName: string, options?: { props?: AnalyticsPayload }) => void;
  }
}

// Stable session ID for the current browser tab
let _sessionId: string | null = null;
function getSessionId(): string {
  if (!_sessionId) {
    _sessionId = crypto.randomUUID();
  }
  return _sessionId;
}

/**
 * Fire-and-forget send to the collect-product-event edge function.
 * Failures are silently logged — analytics should never break the app.
 */
function sendToBackend(name: string, properties: AnalyticsPayload): void {
  supabase.functions
    .invoke("collect-product-event", {
      body: {
        event_name: name,
        properties,
        session_id: getSessionId(),
      },
    })
    .then(({ error }) => {
      if (error) {
        console.debug("[analytics] backend send failed:", error.message);
      }
    })
    .catch(() => {
      // swallow — analytics must never throw
    });
}

export function trackEvent(name: AnalyticsEventName, properties: AnalyticsPayload = {}): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("verity:analytics", {
      detail: {
        name,
        properties,
        recordedAt: new Date().toISOString(),
      },
    }),
  );

  // Send to backend
  sendToBackend(name, properties);

  if (typeof window.plausible === "function") {
    window.plausible(name, { props: properties });
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", name, properties);
  }
}
