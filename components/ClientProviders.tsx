"use client";

import AmbientBackground from "@/components/AmbientBackground";
import SoundManager from "@/components/SoundManager";
import { MemoryProvider } from "@/components/MemoryManager";
import MemoryManager from "@/components/MemoryManager";
import OfflineIndicator from "@/components/OfflineIndicator";
import SWRegister from "@/components/SWRegister";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MemoryProvider>
      <AmbientBackground />
      <SoundManager />
      {children}
      <OfflineIndicator />
      <MemoryManager />
      <SWRegister />
    </MemoryProvider>
  );
}
