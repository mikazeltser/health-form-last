import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "הצהרת בריאות",
  description: "טופס הצהרת בריאות מקוון",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
