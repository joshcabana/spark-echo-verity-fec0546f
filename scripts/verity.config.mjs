import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptFilePath = fileURLToPath(import.meta.url);
const scriptsDirectoryPath = path.dirname(scriptFilePath);

export const REPO_ROOT = path.resolve(scriptsDirectoryPath, "..");
export const CANONICAL_SUPABASE_PROJECT_ID = "nhpbxlvogqnqutmflwlk";
export const CANONICAL_SUPABASE_URL = `https://${CANONICAL_SUPABASE_PROJECT_ID}.supabase.co`;
export const LEGACY_SUPABASE_PROJECT_IDS = ["itdzdyhdkbcxbqgukzis"];
export const REQUIRED_RUNTIME_ENV_KEYS = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
];
export const VITE_BIN = path.resolve(REPO_ROOT, "node_modules", "vite", "bin", "vite.js");
export const VITEST_BIN = path.resolve(REPO_ROOT, "node_modules", "vitest", "vitest.mjs");
