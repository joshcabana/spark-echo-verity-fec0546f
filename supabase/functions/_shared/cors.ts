const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:8080",
  "capacitor://localhost",
  "https://getverity.com.au",
  "https://www.getverity.com.au",
  "https://app.getverity.com.au",
  "https://verity-app-plum.vercel.app",
  "https://spark-echo-verity.lovable.app",
  "https://id-preview--a81e90ba-a208-41e2-bf07-a3adfb94bfcb.lovable.app",
];

export function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const allowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith(".vercel.app");
  return {
    "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Vary": "Origin",
  };
}
