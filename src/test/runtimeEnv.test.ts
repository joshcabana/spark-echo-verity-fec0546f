import {
  getMissingRuntimeEnvKeysFromSource,
  readRuntimeValue,
  resolveSupabaseRuntimeConfigFromSource,
  type RuntimeEnvSource,
} from "@/lib/runtimeEnv";

const createRuntimeEnvSource = (
  overrides: RuntimeEnvSource,
): RuntimeEnvSource => {
  return {
    VITE_SUPABASE_URL: "https://example.supabase.co",
    VITE_SUPABASE_PUBLISHABLE_KEY: "publishable-key",
    ...overrides,
  };
};

describe("runtimeEnv", () => {
  it("trims whitespace from runtime values", () => {
    const source = createRuntimeEnvSource({
      VITE_SUPABASE_URL: "  https://trimmed.supabase.co  ",
    });

    expect(readRuntimeValue(source, "VITE_SUPABASE_URL")).toBe(
      "https://trimmed.supabase.co",
    );
  });

  it("returns missing keys from the provided source", () => {
    const source = createRuntimeEnvSource({
      VITE_SUPABASE_URL: " ",
      VITE_SUPABASE_PUBLISHABLE_KEY: undefined,
    });

    expect(getMissingRuntimeEnvKeysFromSource(source)).toEqual([
      "VITE_SUPABASE_URL",
      "VITE_SUPABASE_PUBLISHABLE_KEY",
    ]);
  });

  it("resolves the Supabase runtime config when all keys are present", () => {
    const source = createRuntimeEnvSource({
      VITE_SUPABASE_URL: "https://resolved.supabase.co",
      VITE_SUPABASE_PUBLISHABLE_KEY: "resolved-key",
    });

    expect(resolveSupabaseRuntimeConfigFromSource(source)).toEqual({
      supabaseUrl: "https://resolved.supabase.co",
      supabasePublishableKey: "resolved-key",
    });
  });

  it("falls back to empty strings when required keys are missing", () => {
    const source = createRuntimeEnvSource({
      VITE_SUPABASE_PUBLISHABLE_KEY: " ",
    });

    expect(resolveSupabaseRuntimeConfigFromSource(source)).toEqual({
      supabaseUrl: "https://example.supabase.co",
      supabasePublishableKey: "",
    });
  });
});
