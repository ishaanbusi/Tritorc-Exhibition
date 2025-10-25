import "./globals.css";
import type { Metadata } from "next";

// Global components
import AmbientBackground from "@/components/AmbientBackground";
import SoundManager from "@/components/SoundManager";
import { MemoryProvider } from "@/components/MemoryManager";
import OfflineIndicator from "@/components/OfflineIndicator";
import SWRegister from "@/components/SWRegister";

export const metadata: Metadata = {
  title: "TRITONK Interactive",
  description: "Immersive product experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AmbientBackground />
        <SoundManager />
        <MemoryProvider>
          {children}
          <OfflineIndicator />
        </MemoryProvider>
        <SWRegister />
      </body>
    </html>
  );
}
