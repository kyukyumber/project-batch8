/**
 * Environment variable utility for type-safe access.
 * Centralizes all env var reading so nothing is scattered.
 * Uses getters so values are resolved lazily (not at module load time).
 */

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  supabase: {
    get url() {
      return getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
    },
    get anonKey() {
      return getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    },
  },
  app: {
    get url() {
      return getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
    },
  },
} as const;
