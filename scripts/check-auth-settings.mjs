import { spawnSync } from "node:child_process";
import { REPO_ROOT, VITEST_BIN } from "./verity.config.mjs";

const result = spawnSync(
  process.execPath,
  [
    VITEST_BIN,
    "run",
    "src/test/authCapabilities.test.ts",
    "src/test/protectedRoute.test.tsx",
    "src/test/runtimeEnv.test.ts",
    "src/test/agoraImportGraph.test.ts",
  ],
  {
    cwd: REPO_ROOT,
    env: process.env,
    stdio: "inherit",
  },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
