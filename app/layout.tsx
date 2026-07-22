import ServiceWorkerRegister from "./components/ServiceWorkerRegister";

import type { Metadata, Viewport } from "next";
import "./globals.css";

  
export const metadata: Metadata = {
  title: "KLAS LİG BURSA",
  description: "KLAS LİG BURSA Resmi Web Sitesi",
  manifest: "/manifest.webmanifest",
  icons: {
  icon: "/icons/logo.png",
  apple: "/icons/logo.png",
},
  themeColor: "#070707",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KLAS LİG BURSA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body suppressHydrationWarning>
  <ServiceWorkerRegister />
  {children}
</body>
    </html>
  );
}