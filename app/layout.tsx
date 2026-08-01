import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KLAS LİG BURSA",
  description: "KLAS LİG BURSA Resmi Web Sitesi",
  applicationName: "KLAS LİG BURSA",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/logo.png", sizes: "180x180" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KLAS LİG BURSA",
  },
};

export const viewport: Viewport = {
  themeColor: "#070707",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}