import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tebmmmmbwsholknougiw.supabase.co";

const supabaseAnonKey =
  "sb_publishable_30Bz8YXRBuxUuMfdpWs7FA_L8spJFci";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);