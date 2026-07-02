// Supabase Client Initialization with Fallback Support

import { mockUserStats } from "./mockData";

export const isSupabaseConfigured = () => {
  return (
    typeof window !== "undefined" &&
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

// We don't import @supabase/supabase-js directly to avoid crashes if it's not configured
// or if the library is not used. We will dynamically load it or mock it.
export const getSupabaseClient = async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    return null;
  }
};
