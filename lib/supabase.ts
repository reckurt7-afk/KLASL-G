import { createBrowserClient } from "@supabase/ssr";
import { useCityStore } from "@/app/store/cityStore";

const SUPA_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://tebmmmmbwsholknougiw.supabase.co";

const SUPA_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYm1tbW1id3Nob2xrbm91Z2l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NzE1NjIsImV4cCI6MjA5OTU0NzU2Mn0.m9Op9xMoxPndfl3IdZculYHPVF7hRUHwEpb1mTywKNw";

// Giriş/çıkış ve profil işlemleri için (auth gerektirir)
export const supabase = createBrowserClient(SUPA_URL, SUPA_KEY);

// RLS'yi bypass eden direkt fetch - herkese açık tablolar için
export async function publicFetch(
  tablo: string,
  params: string = "select=*"
): Promise<any[]> {
  try {
    let formattedParams = params.includes("=") ? params : `select=${params}`;
    
    // Yalnızca şehre bağlı olan ana tablolara city_id filtresini otomatik ekle
    const cityScopedTables = ['takimlar', 'oyuncular', 'maclar', 'fikstur', 'duyurular', 'hakemler', 'puan_durumu', 'ayarlar'];
    const leagueScopedTables = ['teams', 'matches', 'match_events'];
    
    if (cityScopedTables.includes(tablo)) {
      if (!formattedParams.includes('city_id=')) {
        const cityId = useCityStore.getState().selectedCityId || 1;
        formattedParams += `&city_id=eq.${cityId}`;
      }
    } else if (leagueScopedTables.includes(tablo)) {
      if (!formattedParams.includes('league_id=')) {
        const cityId = useCityStore.getState().selectedCityId || 1;
        formattedParams += `&league_id=eq.${cityId}`;
      }
    }

    const url = `${SUPA_URL}/rest/v1/${tablo}?${formattedParams}`;
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
