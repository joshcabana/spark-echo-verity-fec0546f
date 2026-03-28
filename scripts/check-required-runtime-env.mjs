import {
  CANONICAL_SUPABASE_URL,
  REQUIRED_RUNTIME_ENV_KEYS,
} from "./verity.config.mjs";

const missingKeys = REQUIRED_RUNTIME_ENV_KEYS.filter((key) => {
  const value = process.env[key];
  return typeof value !== "string" || value.trim().length === 0;
});

if (missingKeys.length > 0) {
  console.error("[Verity] Required preview/production runtime configuration is missing.");
  console.error("[Verity] Set these environment variables before build/publish:");
  for (const key of missingKeys) {
    console.error(`- ${key}`);
  }
  console.error(
    `[Verity] Example: VITE_SUPABASE_URL=${CANONICAL_SUPABASE_URL} VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>`,
  );
  process.exit(1);
}

console.log("[Verity] Runtime environment contract is satisfied.");
