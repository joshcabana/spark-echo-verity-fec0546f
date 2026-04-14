/**
 * Lazy-loaded Sentry integration.
 * Only activates when VITE_SENTRY_DSN is set; otherwise all exports are no-ops.
 * Keeps ~454 KB of @sentry/react off the critical path via dynamic import.
 */

const DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;

let _initialized = false;
let _sentry: typeof import("@sentry/react") | null = null;

/** Noise patterns from browser extensions & third-party scripts */
const IGNORE_PATTERNS = [
  /extensions\//i,
  /^chrome-extension:\/\//,
  /^moz-extension:\/\//,
  /ResizeObserver loop/,
  /Loading chunk \d+ failed/,
  /Network request failed/,
];

export async function initSentry(): Promise<void> {
  if (!DSN || _initialized) return;
  _initialized = true;

  try {
    const Sentry = await import("@sentry/react");
    _sentry = Sentry;

    Sentry.init({
      dsn: DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0.1,
      beforeSend(event) {
        const message = event.exception?.values?.[0]?.value ?? "";
        if (IGNORE_PATTERNS.some((p) => p.test(message))) return null;

        // Drop events from browser-extension frames
        const frames = event.exception?.values?.[0]?.stacktrace?.frames;
        if (frames?.some((f) => IGNORE_PATTERNS.some((p) => p.test(f.filename ?? "")))) {
          return null;
        }

        return event;
      },
    });
  } catch (e) {
    console.warn("[Sentry] Failed to initialise:", e);
  }
}

export function captureException(error: unknown): void {
  _sentry?.captureException(error);
}

export function captureMessage(msg: string): void {
  _sentry?.captureMessage(msg);
}
