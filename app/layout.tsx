import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import Navbar from "./components/Navbar";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";
import CanliSkorBandi from "./components/CanliSkorBandi";
import ReklamBandi from "./components/ReklamBandi";
import { AuthProvider } from "@/lib/AuthContext";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRO LİG BURSA",
  description: "PRO LİG BURSA Resmi Web Sitesi",
  applicationName: "PRO LİG BURSA",
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
    title: "PRO LİG BURSA",
  },
};

export const viewport: Viewport = {
  themeColor: "#070707",
};

import LayoutWrapper from "./components/LayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <ServiceWorkerRegister />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}