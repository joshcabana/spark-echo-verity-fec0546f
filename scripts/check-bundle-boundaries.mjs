import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { init, parse } from "es-module-lexer";
import {
  REPO_ROOT,
  REQUIRED_RUNTIME_ENV_KEYS,
  VITE_BIN,
} from "./verity.config.mjs";

const distDirectoryPath = path.resolve(REPO_ROOT, "dist");
const assetsDirectoryPath = path.resolve(distDirectoryPath, "assets");
const pagesDirectoryPath = path.resolve(REPO_ROOT, "src", "pages");
const allowedChartPages = new Set(["Admin", "Transparency"]);
const allowedAgoraPages = new Set(["LiveCall"]);

const missingKeys = REQUIRED_RUNTIME_ENV_KEYS.filter((key) => {
  const value = process.env[key];
  return typeof value !== "string" || value.trim().length === 0;
});

if (missingKeys.length > 0) {
  console.error("[Verity] Bundle boundary checks require configured runtime env values.");
  for (const key of missingKeys) {
    console.error(`- ${key}`);
  }
  process.exit(1);
}

const buildResult = spawnSync(
  process.execPath,
  [VITE_BIN, "build"],
  {
    cwd: REPO_ROOT,
    env: process.env,
    stdio: "inherit",
  },
);

if (buildResult.status !== 0) {
  process.exit(buildResult.status ?? 1);
}

const assetEntries = await fs.readdir(assetsDirectoryPath);
const javascriptAssets = assetEntries.filter((entry) => entry.endsWith(".js"));
const assetGraph = new Map();

await init;

for (const assetName of javascriptAssets) {
  const assetPath = path.resolve(assetsDirectoryPath, assetName);
  const source = await fs.readFile(assetPath, "utf8");
  const imports = new Set();

  const [moduleImports] = parse(source);

  for (const moduleImport of moduleImports) {
    if (moduleImport.d !== -1) {
      continue;
    }

    const importPath = moduleImport.n;
    if (!importPath || !importPath.startsWith("./") || !importPath.endsWith(".js")) {
      continue;
    }

    imports.add(importPath.slice(2));
  }

  assetGraph.set(assetName, imports);
}

const collectReachableAssets = (entryAssetName) => {
  const reachableAssets = new Set();
  const pendingAssetNames = [entryAssetName];

  while (pendingAssetNames.length > 0) {
    const assetName = pendingAssetNames.pop();

    if (!assetName || reachableAssets.has(assetName)) {
      continue;
    }

    reachableAssets.add(assetName);
    const imports = assetGraph.get(assetName);

    if (!imports) {
      continue;
    }

    for (const importedAssetName of imports) {
      pendingAssetNames.push(importedAssetName);
    }
  }

  return reachableAssets;
};

const pageEntries = await fs.readdir(pagesDirectoryPath);
const pageNames = pageEntries
  .filter((entry) => entry.endsWith(".tsx"))
  .map((entry) => path.basename(entry, ".tsx"));

const failures = [];
const routeSummary = [];

for (const pageName of pageNames) {
  const entryAssetName = javascriptAssets.find((assetName) => assetName.startsWith(`${pageName}-`));

  if (!entryAssetName) {
    failures.push(`Missing built asset for page chunk ${pageName}`);
    continue;
  }

  const reachableAssets = collectReachableAssets(entryAssetName);
  const reachesCharts = Array.from(reachableAssets).some((assetName) => assetName.startsWith("vendor-charts-"));
  const reachesAgora = Array.from(reachableAssets).some((assetName) => assetName.startsWith("vendor-agora-"));

  if (reachesCharts && !allowedChartPages.has(pageName)) {
    failures.push(`${pageName} chunk reaches vendor-charts`);
  }

  if (reachesAgora && !allowedAgoraPages.has(pageName)) {
    failures.push(`${pageName} chunk reaches vendor-agora`);
  }

  if (reachesCharts || reachesAgora) {
    routeSummary.push({
      pageName,
      reachesAgora,
      reachesCharts,
    });
  }
}

const indexHtmlSource = await fs.readFile(path.resolve(distDirectoryPath, "index.html"), "utf8");
if (indexHtmlSource.includes("vendor-charts-")) {
  failures.push("index.html preloads or imports vendor-charts");
}
if (indexHtmlSource.includes("vendor-agora-")) {
  failures.push("index.html preloads or imports vendor-agora");
}

const landingAssetName = javascriptAssets.find((assetName) => assetName.startsWith("Landing-"));
if (!landingAssetName) {
  failures.push("Missing built asset for Landing route");
} else {
  const landingReachableAssets = collectReachableAssets(landingAssetName);
  if (Array.from(landingReachableAssets).some((assetName) => assetName.startsWith("vendor-charts-"))) {
    failures.push("Landing chunk reaches vendor-charts");
  }
  if (Array.from(landingReachableAssets).some((assetName) => assetName.startsWith("vendor-agora-"))) {
    failures.push("Landing chunk reaches vendor-agora");
  }
}

if (failures.length > 0) {
  console.error("[Verity] Bundle boundary check failed.");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  if (routeSummary.length > 0) {
    console.error("[Verity] Route vendor summary:");
    for (const summary of routeSummary) {
      console.error(
        `- ${summary.pageName}: charts=${summary.reachesCharts ? "yes" : "no"} agora=${summary.reachesAgora ? "yes" : "no"}`,
      );
    }
  }
  process.exit(1);
}

console.log("[Verity] Bundle boundaries verified.");
for (const summary of routeSummary) {
  console.log(
    `[Verity] ${summary.pageName}: charts=${summary.reachesCharts ? "yes" : "no"} agora=${summary.reachesAgora ? "yes" : "no"}`,
  );
}
