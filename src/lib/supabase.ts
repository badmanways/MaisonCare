import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { MaisonCareDatabase } from "./db";

// Ensure Node.js 20 environment has a WebSocket constructor so @supabase/supabase-js
// does not throw "Node.js 20 detected without native WebSocket support"
if (typeof globalThis !== "undefined" && !globalThis.WebSocket) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).WebSocket = class DummyWebSocket {};
}

let supabaseInstance: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes("your-project"));
}

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes("your-project")) {
    return null;
  }

  try {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    return supabaseInstance;
  } catch (err) {
    console.warn("[Supabase] Failed to initialize client:", err);
    return null;
  }
}

/**
 * Loads the complete MaisonCare database state from Supabase JSONB store
 */
export async function fetchDatabaseFromSupabase(): Promise<MaisonCareDatabase | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("maisoncare_store")
      .select("data")
      .eq("key", "main_db")
      .single();

    if (error) {
      // Non-fatal if table doesn't exist yet
      console.warn("[Supabase] Fetch note:", error.message);
      return null;
    }

    if (data && data.data) {
      return data.data as MaisonCareDatabase;
    }
    return null;
  } catch (err) {
    console.warn("[Supabase] Fetch exception:", err);
    return null;
  }
}

/**
 * Persists the entire MaisonCare database state to Supabase
 */
export async function saveDatabaseToSupabase(
  dbState: MaisonCareDatabase
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("maisoncare_store").upsert(
      {
        key: "main_db",
        data: dbState,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    if (error) {
      console.warn("[Supabase] Save note:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[Supabase] Save exception:", err);
    return false;
  }
}

/**
 * Uploads applicant CVs to Supabase Storage bucket 'cvs'
 */
export async function uploadCvToSupabaseStorage(
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { error } = await supabase.storage.from("cvs").upload(fileName, buffer, {
      contentType: mimeType,
      upsert: true,
    });

    if (error) {
      console.warn("[Supabase Storage] Upload note:", error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("cvs")
      .getPublicUrl(fileName);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.warn("[Supabase Storage] Upload exception:", err);
    return null;
  }
}

