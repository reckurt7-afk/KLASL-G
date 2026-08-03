import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Sadece admin sayfasını koru (direkt URL ile açılabilsin ama başka güvenlik yok)
  return NextResponse.next({ request: req });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
