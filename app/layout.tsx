import "./globals.css";
import type { Metadata } from "next";
import ClientProviders from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "TRITORC Interactive",
  description: "Immersive product experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
