import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  CANONICAL_SUPABASE_URL,
  REPO_ROOT,
  VITE_BIN,
} from "./verity.config.mjs";

const createHeaders = () => ({
  "access-control-allow-headers": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-origin": "*",
});

const getContentType = (filePath) => {
  const extension = path.extname(filePath);

  if (extension === ".css") return "text/css; charset=utf-8";
  if (extension === ".html") return "text/html; charset=utf-8";
  if (extension === ".js") return "text/javascript; charset=utf-8";
  if (extension === ".json") return "application/json; charset=utf-8";
  if (extension === ".png") return "image/png";
  if (extension === ".svg") return "image/svg+xml";
  if (extension === ".woff2") return "font/woff2";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".webp") return "image/webp";

  return "application/octet-stream";
};

const buildApplication = (outputDirectoryPath, buildEnv) => {
  const buildResult = spawnSync(
    process.execPath,
    [VITE_BIN, "build", "--outDir", outputDirectoryPath],
    {
      cwd: REPO_ROOT,
      env: {
        ...process.env,
        ...buildEnv,
      },
      stdio: "inherit",
    },
  );

  if (buildResult.status !== 0) {
    throw new Error(`[Verity] Smoke build failed for ${outputDirectoryPath}`);
  }
};

const startStaticServer = async (rootDirectoryPath) => {
  const server = createServer(async (request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    if (request.method === "OPTIONS") {
      response.writeHead(204, createHeaders());
      response.end();
      return;
    }

    const requestedPath = requestUrl.pathname === "/"
      ? "index.html"
      : requestUrl.pathname.replace(/^\/+/, "");
    const normalizedPath = path.normalize(requestedPath);
    const resolvedPath = path.join(rootDirectoryPath, normalizedPath);
    const safeRootPrefix = `${rootDirectoryPath}${path.sep}`;

    if (resolvedPath !== rootDirectoryPath && !resolvedPath.startsWith(safeRootPrefix)) {
      response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    let filePath = resolvedPath;
    let exists = true;

    try {
      const fileStats = await fs.stat(filePath);
      if (fileStats.isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }
    } catch {
      exists = false;
    }

    if (!exists) {
      filePath = path.join(rootDirectoryPath, "index.html");
    }

    try {
      const body = await fs.readFile(filePath);
      response.writeHead(200, {
        "content-type": getContentType(filePath),
      });
      response.end(body);
    } catch {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("[Verity] Failed to determine smoke server address");
  }

  return {
    close: () => new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    }),
    url: `http://127.0.0.1:${address.port}`,
  };
};

const ensureVisibleText = async (page, text) => {
  await page.getByText(text, { exact: false }).first().waitFor({
    state: "visible",
    timeout: 10000,
  });
};

const fulfillJson = async (route, statusCode, payload) => {
  await route.fulfill({
    body: JSON.stringify(payload),
    contentType: "application/json; charset=utf-8",
    headers: createHeaders(),
    status: statusCode,
  });
};

const registerMocks = async (context) => {
  const futureDropTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  await context.route("https://cdn.jsdelivr.net/**", async (route) => {
    await route.fulfill({
      body: "",
      status: 204,
    });
  });

  await context.route(`${CANONICAL_SUPABASE_URL}/**`, async (route) => {
    const requestUrl = new URL(route.request().url());
    const requestMethod = route.request().method();

    if (requestMethod === "OPTIONS") {
      await route.fulfill({
        headers: createHeaders(),
        status: 204,
      });
      return;
    }

    if (requestUrl.pathname.endsWith("/rest/v1/rpc/get_public_drop_schedule")) {
      await fulfillJson(route, 200, [
        {
          description: "Live, anonymous speed dating for verified locals.",
          duration_minutes: 45,
          id: "drop-smoke-1",
          is_friendfluence: false,
          max_capacity: 24,
          room_id: "room-smoke-1",
          room_name: "Friday Night Pilot",
          rsvp_count: 9,
          scheduled_at: futureDropTime,
          status: "scheduled",
          timezone: "Australia/Sydney",
          title: "Friday Night Pilot",
        },
      ]);
      return;
    }

    if (requestUrl.pathname.includes("/rest/v1/platform_stats")) {
      await fulfillJson(route, 200, {
        active_users: 128,
        ai_accuracy: 96,
        appeals_total: 5,
        appeals_upheld: 1,
        gender_balance: {
          men: 46,
          nonbinary: 4,
          women: 50,
        },
        moderation_flags_count: 3,
        total_calls: 81,
        total_sparks: 27,
      });
      return;
    }

    if (requestUrl.pathname.endsWith("/functions/v1/get-feature-flags")) {
      await fulfillJson(route, 200, {
        enable_friendfluence: true,
        enable_guardian_net: true,
        enable_replay_vault: true,
        enable_voice_intro: true,
        require_phone_verification: false,
      });
      return;
    }

    if (requestUrl.pathname.endsWith("/auth/v1/settings")) {
      await fulfillJson(route, 200, {
        disable_signup: false,
        external: {
          email: true,
          google: false,
          phone: false,
        },
        mailer_autoconfirm: false,
      });
      return;
    }

    await fulfillJson(route, 200, {});
  });
};

const runHappyPathSmoke = async (browser, baseUrl) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await registerMocks(context);

  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await ensureVisibleText(page, "Anonymous first.");
  await ensureVisibleText(page, "Get verified for the first Drop");

  await page.goto(`${baseUrl}/auth`, { waitUntil: "domcontentloaded" });
  await ensureVisibleText(page, "Sign in with a magic link");

  await page.goto(`${baseUrl}/onboarding`, { waitUntil: "domcontentloaded" });
  await ensureVisibleText(page, "Watch 45-second demo");

  await page.goto(`${baseUrl}/transparency`, { waitUntil: "domcontentloaded" });
  await ensureVisibleText(page, "Verity operates with");
  await ensureVisibleText(page, "Gender Balance");

  await page.goto(`${baseUrl}/lobby`, { waitUntil: "domcontentloaded" });
  await page.waitForURL("**/auth", { timeout: 10000 });
  await ensureVisibleText(page, "Send magic link");

  await context.close();
};

const runConfigErrorSmoke = async (browser, baseUrl) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await ensureVisibleText(page, "Runtime configuration is incomplete");
  await ensureVisibleText(page, "VITE_SUPABASE_URL");
  await ensureVisibleText(page, "VITE_SUPABASE_PUBLISHABLE_KEY");

  await context.close();
};

const createBuildDirectory = async (prefix) => {
  return await fs.mkdtemp(path.join(os.tmpdir(), prefix));
};

let chromium;

try {
  const playwrightModule = await import("playwright");
  chromium = playwrightModule.chromium;
} catch {
  throw new Error("[Verity] Playwright is not installed. Run `npm install` and `npx playwright install chromium` before `npm run test:smoke`.");
}

const normalBuildDirectoryPath = await createBuildDirectory("verity-smoke-");
const configErrorBuildDirectoryPath = await createBuildDirectory("verity-smoke-config-");

let browser;
let normalServer;
let configErrorServer;

try {
  buildApplication(normalBuildDirectoryPath, {
    VITE_SUPABASE_PUBLISHABLE_KEY: "smoke_publishable_key",
    VITE_SUPABASE_URL: CANONICAL_SUPABASE_URL,
  });
  buildApplication(configErrorBuildDirectoryPath, {
    VITE_SUPABASE_PUBLISHABLE_KEY: "",
    VITE_SUPABASE_URL: "",
  });

  try {
    browser = await chromium.launch();
  } catch {
    throw new Error("[Verity] Chromium is not available for Playwright. Run `npx playwright install chromium` and try again.");
  }

  normalServer = await startStaticServer(normalBuildDirectoryPath);
  await runHappyPathSmoke(browser, normalServer.url);

  configErrorServer = await startStaticServer(configErrorBuildDirectoryPath);
  await runConfigErrorSmoke(browser, configErrorServer.url);

  console.log("[Verity] Smoke suite passed.");
} finally {
  if (configErrorServer) {
    await configErrorServer.close();
  }
  if (normalServer) {
    await normalServer.close();
  }
  if (browser) {
    await browser.close();
  }
  await fs.rm(normalBuildDirectoryPath, { force: true, recursive: true });
  await fs.rm(configErrorBuildDirectoryPath, { force: true, recursive: true });
}
