import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Bu sayfalar giriş gerektirmez (Sadece Giriş ve Kayıt)
const ACIK_SAYFALAR = [
  "/giris", 
  "/kayit"
];

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const pathname = req.nextUrl.pathname;

  // Açık sayfalara her zaman erişim var
  if (ACIK_SAYFALAR.some((s) => pathname.startsWith(s))) {
    return res;
  }

  // Statik dosyalar ve Next.js internal rotalar
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/logos") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return res;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
            res = NextResponse.next({ request: req });
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Oturum yoksa giriş sayfasına yönlendir
    if (!user) {
      const url = req.nextUrl.clone();
      url.pathname = "/giris";
      return NextResponse.redirect(url);
    }
  } catch {
    // Hata olursa devam et
    return res;
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
