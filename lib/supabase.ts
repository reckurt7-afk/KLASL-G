import { createBrowserClient } from "@supabase/ssr";

// Giriş/çıkış ve profil işlemleri için (auth gerektirir)
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// RLS'yi bypass eden direkt fetch - herkese açık tablolar için
export async function publicFetch(
  tablo: string,
  params: string = "*"
): Promise<any[]> {
  try {
    const url = `${SUPA_URL}/rest/v1/${tablo}?${params}`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}