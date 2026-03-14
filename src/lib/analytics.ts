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

  if (typeof window.plausible === "function") {
    window.plausible(name, { props: properties });
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", name, properties);
  }
}
