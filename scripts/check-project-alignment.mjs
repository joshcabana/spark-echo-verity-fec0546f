import fs from "node:fs/promises";
import path from "node:path";
import {
  CANONICAL_SUPABASE_PROJECT_ID,
  CANONICAL_SUPABASE_URL,
  LEGACY_SUPABASE_PROJECT_IDS,
  REPO_ROOT,
} from "./verity.config.mjs";

const textExtensions = new Set([
  ".cjs",
  ".env",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".sql",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);
const excludedDirectories = new Set([
  ".git",
  "coverage",
  "dist",
  "dist-ssr",
  "node_modules",
]);
const requiredCanonicalFiles = [
  "AGENTS.md",
  "README.md",
  ".github/workflows/ci.yml",
];
const ignoredFiles = new Set([
  path.resolve(REPO_ROOT, "scripts", "verity.config.mjs"),
]);

const candidateFiles = [];

const collectCandidateFiles = async (directoryPath) => {
  const directoryEntries = await fs.readdir(directoryPath, { withFileTypes: true });

  for (const entry of directoryEntries) {
    if (excludedDirectories.has(entry.name)) {
      continue;
    }

    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      await collectCandidateFiles(entryPath);
      continue;
    }

    const extension = path.extname(entry.name);
    if (textExtensions.has(extension) || entry.name.startsWith(".env")) {
      candidateFiles.push(entryPath);
    }
  }
};

await collectCandidateFiles(REPO_ROOT);

const failures = [];

for (const filePath of candidateFiles) {
  if (ignoredFiles.has(filePath)) {
    continue;
  }

  const source = await fs.readFile(filePath, "utf8");
  const relativePath = path.relative(REPO_ROOT, filePath);

  for (const legacyProjectId of LEGACY_SUPABASE_PROJECT_IDS) {
    if (source.includes(legacyProjectId)) {
      failures.push(`${relativePath}: found legacy Supabase project reference ${legacyProjectId}`);
    }
  }
}

for (const relativePath of requiredCanonicalFiles) {
  const filePath = path.resolve(REPO_ROOT, relativePath);
  const source = await fs.readFile(filePath, "utf8");

  if (!source.includes(CANONICAL_SUPABASE_PROJECT_ID)) {
    failures.push(`${relativePath}: missing canonical Supabase project id ${CANONICAL_SUPABASE_PROJECT_ID}`);
  }
}

const workflowSource = await fs.readFile(
  path.resolve(REPO_ROOT, ".github/workflows/ci.yml"),
  "utf8",
);

if (!workflowSource.includes(CANONICAL_SUPABASE_URL)) {
  failures.push(`.github/workflows/ci.yml: missing canonical Supabase URL ${CANONICAL_SUPABASE_URL}`);
}

if (failures.length > 0) {
  console.error("[Verity] Project alignment check failed.");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("[Verity] Canonical Supabase project alignment is consistent.");
