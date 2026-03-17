import fs from "node:fs/promises";
import path from "node:path";
import { REPO_ROOT } from "./verity.config.mjs";

const scanRoots = [
  path.resolve(REPO_ROOT, "src"),
  path.resolve(REPO_ROOT, "public"),
];
const textExtensions = new Set([".css", ".html", ".js", ".json", ".ts", ".tsx"]);
const suspiciousPatterns = [
  {
    label: "hardcoded Supabase URL",
    expression: /https:\/\/[a-z0-9]{20}\.supabase\.co/giu,
  },
  {
    label: "hardcoded Supabase publishable key",
    expression: /\bsb_publishable_[A-Za-z0-9_-]+\b/gu,
  },
  {
    label: "hardcoded Supabase secret key",
    expression: /\bsb_(?:secret|service_role)_[A-Za-z0-9_-]+\b/gu,
  },
  {
    label: "hardcoded JWT-like API key",
    expression: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/gu,
  },
];

const candidateFiles = [];

const collectFiles = async (directoryPath) => {
  const directoryEntries = await fs.readdir(directoryPath, { withFileTypes: true });

  for (const entry of directoryEntries) {
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(entryPath);
      continue;
    }

    if (textExtensions.has(path.extname(entry.name))) {
      candidateFiles.push(entryPath);
    }
  }
};

for (const scanRoot of scanRoots) {
  await collectFiles(scanRoot);
}

const findings = [];

for (const filePath of candidateFiles) {
  const source = await fs.readFile(filePath, "utf8");
  const relativePath = path.relative(REPO_ROOT, filePath);
  const sourceLines = source.split("\n");

  for (const { label, expression } of suspiciousPatterns) {
    const matches = Array.from(source.matchAll(expression));

    for (const match of matches) {
      const matchIndex = match.index ?? 0;
      const lineNumber = source.slice(0, matchIndex).split("\n").length;
      const line = sourceLines[lineNumber - 1]?.trim() ?? "";
      findings.push(`${relativePath}:${lineNumber} ${label} -> ${line}`);
    }
  }
}

if (findings.length > 0) {
  console.error("[Verity] Hardcoded Supabase credentials were detected.");
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log("[Verity] No hardcoded Supabase credentials detected in application assets.");
