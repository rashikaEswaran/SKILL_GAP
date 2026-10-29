import { createClient } from "@supabase/supabase-js";
import { createMockSupabaseClient } from "@/services/mock-storage";

function createSupabaseClientInstance() {
  const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    return createMockSupabaseClient();
  }

  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _supabase;

export const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClientInstance();
    return Reflect.get(_supabase, prop, receiver);
  },
});
