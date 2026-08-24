export const runtime = "nodejs";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    vapidPublic: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY.substring(0, 15) + "..." : "missing",
    vapidPrivate: process.env.VAPID_PRIVATE_KEY ? "exists" : "missing",
    vapidEmail: process.env.VAPID_EMAIL || "missing"
  });
}
