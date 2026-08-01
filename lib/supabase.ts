import { createBrowserClient } from "@supabase/ssr";

// Ana Supabase client (auth gerektiren işlemler için)
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Sadece okuma için kullanılan client - RLS bypass için aynı anon key ama fresh instance
export const supabasePublic = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);