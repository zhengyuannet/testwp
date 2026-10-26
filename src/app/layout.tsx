import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LOS MANGOS - Supermercado",
  description: "Supermercado online - Pide fácil y rápido por WhatsApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

