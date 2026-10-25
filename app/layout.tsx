import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "이미지 QR 스튜디오",
  description: "이미지를 올리고 QR코드를 다운로드하세요.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
