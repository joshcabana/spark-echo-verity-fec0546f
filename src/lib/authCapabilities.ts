import { getSupabaseRuntimeConfig } from "@/lib/runtimeEnv";

export interface AuthCapabilities {
  disableSignup: boolean;
  mailerAutoconfirm: boolean;
  emailEnabled: boolean;
  phoneEnabled: boolean;
  googleEnabled: boolean;
}

interface AuthSettingsResponse {
  disable_signup?: boolean;
  mailer_autoconfirm?: boolean;
  external?: {
    email?: boolean;
    phone?: boolean;
    google?: boolean;
  };
}

export const mapAuthSettingsToCapabilities = (settings: AuthSettingsResponse): AuthCapabilities => {
  return {
    disableSignup: settings.disable_signup ?? true,
    mailerAutoconfirm: settings.mailer_autoconfirm ?? false,
    emailEnabled: settings.external?.email ?? false,
    phoneEnabled: settings.external?.phone ?? false,
    googleEnabled: settings.external?.google ?? false,
  };
};

export const fetchAuthCapabilities = async (): Promise<AuthCapabilities> => {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseRuntimeConfig();

  const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
    headers: {
      apikey: supabasePublishableKey,
      Authorization: `Bearer ${supabasePublishableKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load auth capabilities (${response.status})`);
  }

  const settings = await response.json() as AuthSettingsResponse;
  return mapAuthSettingsToCapabilities(settings);
};
