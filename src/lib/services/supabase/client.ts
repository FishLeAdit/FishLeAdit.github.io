import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

// Created lazily so a missing env var surfaces as a rejected fetch
// (shown as an error dialog) instead of crashing the whole page on import.
export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_API_KEY;
  const key = process.env.NEXT_PUBLIC_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_API_KEY and NEXT_PUBLIC_ANON_KEY."
    );
  }

  client = createClient(url, key);
  return client;
}
