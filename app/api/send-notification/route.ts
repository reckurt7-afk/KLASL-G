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

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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
        console.error("Push hatası:", err);

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
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: err?.stack || err?.message || String(err),
      },
      {
        status: 500,
      }
    );
  }
}