import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import Navbar from "./components/Navbar";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";
import GolSesiDinleyici from "./components/GolSesiDinleyici";
import CanliSkorBandi from "./components/CanliSkorBandi";
import ReklamBandi from "./components/ReklamBandi";
import { AuthProvider } from "@/lib/AuthContext";
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

import { Inter } from "next/font/google";
import LayoutWrapper from "./components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.className}>
      <head>
      </head>
      <body className="bg-[#f5f6f8] text-[#111111] antialiased selection:bg-[#e50914] selection:text-white">
        <AuthProvider>
          <ServiceWorkerRegister />
          <GolSesiDinleyici />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}