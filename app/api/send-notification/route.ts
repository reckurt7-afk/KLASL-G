export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";
console.log(
  "PUBLIC:",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.slice(0, 10)
);

console.log(
  "PRIVATE:",
  process.env.VAPID_PRIVATE_KEY?.slice(0, 10)
);
export async function POST(req: Request) {
  webpush.setVapidDetails(
    "mailto:recepkurt7@gmail.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  try {
    const { baslik, mesaj } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: aboneler, error } = await supabase
      .from("bildirim_aboneleri")
      .select("*");

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    let gonderilen = 0;
    let hatali = 0;
    let hataDetayi: any = null;

    for (const abone of aboneler || []) {
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
          })
        );

        gonderilen++;

      } catch (err: any) {
        hatali++;

        hataDetayi = {
          statusCode: err?.statusCode,
          message: err?.message,
          body: err?.body,
        };

        console.log("Bildirim hatası:", hataDetayi);

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
      toplam: aboneler?.length || 0,
      gonderilen,
      hatali,
      hataDetayi,
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message,
      },
      { status: 500 }
    );
  }
}