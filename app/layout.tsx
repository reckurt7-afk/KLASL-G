import "./globals.css";

export const metadata = {
  title: "KLAS LİG BURSA",
  description: "KLAS LİG BURSA Resmi Web Sitesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}