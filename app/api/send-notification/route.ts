export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { baslik, mesaj, url } = await req.json();

    if (!baslik || !mesaj) {
      return NextResponse.json({ success: false, error: "baslik ve mesaj gerekli" }, { status: 400 });
    }

    // VAPID key kontrolü
    const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY;

    if (!vapidPublic || !vapidPrivate) {
      console.warn("VAPID keys eksik - bildirim gönderilemiyor");
      return NextResponse.json({
        success: true,
        gonderilen: 0,
        hatali: 0,
        uyari: "VAPID keys ayarlı değil",
      });
    }

    // Supabase service role key kontrolü
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    webpush.setVapidDetails(
      "mailto:recepkurt7@gmail.com",
      vapidPublic,
      vapidPrivate
    );

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey!
    );

    const { data: aboneler, error } = await supabase
      .from("bildirim_aboneleri")
      .select("*");

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!aboneler || aboneler.length === 0) {
      return NextResponse.json({
        success: true,
        gonderilen: 0,
        hatali: 0,
        toplam: 0,
        uyari: "Kayıtlı abone yok",
      });
    }

    let gonderilen = 0;
    let hatali = 0;

    for (const abone of aboneler) {
      try {
        await webpush.sendNotification(
          {
            endpoint: abone.endpoint,
            keys: {
              p256dh: abone.p256dh,
              auth: abone.auth,
            },
          },
          JSON.stringify({
            title: baslik,
            body: mesaj,
            url: url || "/",
          })
        );
        gonderilen++;
      } catch (err: any) {
        hatali++;
        console.log("Bildirim hatası:", err?.statusCode, err?.message);

        // Geçersiz aboneleri sil
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await supabase
            .from("bildirim_aboneleri")
            .delete()
            .eq("id", abone.id);
        }
      }
    }

    return NextResponse.json({
      success: true,
      toplam: aboneler.length,
      gonderilen,
      hatali,
    });

  } catch (err: any) {
    console.error("send-notification hatası:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}