export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { baslik, mesaj } = await req.json();

    const { data: aboneler, error } = await supabase
      .from("bildirim_aboneleri")
      .select("*");

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    let gonderilen = 0;

    await Promise.all(
      (aboneler ?? []).map(async (abone) => {
        try {
          await Promise.race([
            webpush.sendNotification(
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
            ),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Timeout")), 10000)
            ),
          ]);

          gonderilen++;
        } catch (e: any) {
          console.error("Bildirim hatası:", e?.message);

          if (
            e?.statusCode === 404 ||
            e?.statusCode === 410
          ) {
            await supabase
              .from("bildirim_aboneleri")
              .delete()
              .eq("id", abone.id);
          }
        }
      })
    );

    return NextResponse.json({
      success: true,
      gonderilen,
    });
  } catch (e: any) {
    console.error(e);

    return NextResponse.json(
      {
        success: false,
        error: e?.message || "Sunucu hatası",
      },
      { status: 500 }
    );
  }
}