import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { macId, userId, takim, oylananOyuncu } = await req.json();

    if (!macId || !userId || !takim || !oylananOyuncu) {
      return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json({ error: "Sunucu ayar hatası" }, { status: 500 });
    }

    // 1. Önce kullanıcının zaten oy verip vermediğini kontrol et
    const anahtar = `mvp_vote_${macId}_${userId}`;
    const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/ayarlar?anahtar=eq.${anahtar}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    const checkData = await checkRes.json();

    if (checkData && checkData.length > 0) {
      return NextResponse.json({ error: "Zaten oy kullandınız!" }, { status: 400 });
    }

    // 2. Oy'u kaydet
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/ayarlar`, {
      method: "POST",
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        anahtar: anahtar,
        deger: JSON.stringify({ takim, oylananOyuncu, date: new Date().toISOString() })
      })
    });

    if (!insertRes.ok) {
      const errorText = await insertRes.text();
      return NextResponse.json({ error: "Kayıt hatası: " + errorText }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const macId = searchParams.get("macId");
    
    if (!macId) {
      return NextResponse.json({ error: "Eksik macId" }, { status: 400 });
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Tüm oyları getir
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ayarlar?anahtar=like.mvp_vote_${macId}_%`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    const data = await res.json();
    return NextResponse.json({ votes: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
