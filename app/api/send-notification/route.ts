import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  try {
    const { baslik, mesaj } = await request.json();

    const { data: aboneler, error } = await supabase
      .from("bildirim_aboneleri")
      .select("*");

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    let gonderilen = 0;

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
        console.log("Push hatası:", err?.statusCode, err?.message);

        // Geçersiz abonelikleri sil
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
      gonderilen,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}