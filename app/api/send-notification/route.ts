export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  try {
    const { baslik, mesaj } = await req.json();

    if (!baslik || !mesaj) {
      return NextResponse.json(
        {
          success: false,
          error: "Başlık veya mesaj boş olamaz",
        },
        { status: 400 }
      );
    }

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

        console.log(
          "Bildirim gönderilemedi:",
          err?.statusCode,
          err?.body
        );

        // Ölü aboneleri temizle
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
    });

  } catch (err: any) {
    console.error("SEND NOTIFICATION ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        statusCode: err?.statusCode,
        message: err?.message,
        body: err?.body,
        stack: err?.stack,
      },
      {
        status: 500,
      }
    );
  }
}