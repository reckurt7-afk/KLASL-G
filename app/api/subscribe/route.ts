export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const subscription = await req.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ success: false, error: "Geçersiz abonelik verisi" }, { status: 400 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ success: false, error: "Supabase ayarları eksik" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Save to bildirim_aboneleri table
    const { error } = await supabase
      .from("bildirim_aboneleri")
      .upsert({
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      }, { onConflict: "endpoint" }); // assuming endpoint is unique

    if (error) {
      console.error("Supabase upsert error:", error);
      // Wait, if the table doesn't have onConflict endpoint constraint, upsert might fail.
      // Let's just do a select then insert.
      
      const { data: existing } = await supabase
        .from("bildirim_aboneleri")
        .select("id")
        .eq("endpoint", subscription.endpoint)
        .single();
        
      if (!existing) {
        const { error: insertError } = await supabase
          .from("bildirim_aboneleri")
          .insert([{
            endpoint: subscription.endpoint,
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth
          }]);
          
        if (insertError) throw insertError;
      }
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("subscribe api error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}
