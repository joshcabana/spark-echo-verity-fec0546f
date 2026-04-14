const REQUIRED_RUNTIME_KEYS = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
] as const;

export type RequiredRuntimeKey = (typeof REQUIRED_RUNTIME_KEYS)[number];
export type RuntimeEnvSource = Partial<Record<RequiredRuntimeKey, string | undefined>>;

export const readRuntimeValue = (
  source: RuntimeEnvSource,
  key: RequiredRuntimeKey,
): string | undefined => {
  const rawValue = source[key];
  if (!rawValue) return undefined;
  const trimmedValue = rawValue.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

export const getMissingRuntimeEnvKeysFromSource = (
  source: RuntimeEnvSource,
): RequiredRuntimeKey[] => {
  return REQUIRED_RUNTIME_KEYS.filter(
    (key) => !readRuntimeValue(source, key),
  );
};

export const resolveSupabaseRuntimeConfigFromSource = (
  source: RuntimeEnvSource,
): {
  supabaseUrl: string;
  supabasePublishableKey: string;
} => {
  const url = readRuntimeValue(source, "VITE_SUPABASE_URL") ?? "";
  const key = readRuntimeValue(source, "VITE_SUPABASE_PUBLISHABLE_KEY") ?? "";

  return { supabaseUrl: url, supabasePublishableKey: key };
};

const getRuntimeEnvSource = (): RuntimeEnvSource => {
  return import.meta.env as RuntimeEnvSource;
};

export const getMissingRuntimeEnvKeys = (): RequiredRuntimeKey[] => {
  return getMissingRuntimeEnvKeysFromSource(getRuntimeEnvSource());
};

export const getSupabaseRuntimeConfig = (): {
  supabaseUrl: string;
  supabasePublishableKey: string;
} => {
  return resolveSupabaseRuntimeConfigFromSource(getRuntimeEnvSource());
};
