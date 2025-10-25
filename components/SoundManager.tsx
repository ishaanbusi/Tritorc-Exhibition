"use client";

import { useEffect, useState } from "react";
import useSound from "use-sound";

interface SoundManagerProps {
  enabled?: boolean;
}

export default function SoundManager({ enabled = true }: SoundManagerProps) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(enabled);

  const [playClick] = useSound("/sounds/click.mp3", { volume: 0.3 });
  const [playHover] = useSound("/sounds/hover.mp3", { volume: 0.2 });
  const [playSuccess] = useSound("/sounds/success.mp3", { volume: 0.4 });
  const [playHydraulic] = useSound("/sounds/hydraulic.mp3", { volume: 0.3 });

  useEffect(() => {
    if (!isSoundEnabled) return;

    // Add click sound to all buttons
    const buttons = document.querySelectorAll('button, a[role="button"]');

    const handleClick = () => {
      playClick();
      // Haptic feedback on mobile
      if ("vibrate" in navigator) {
        navigator.vibrate(10);
      }
    };

    const handleHover = () => {
      playHover();
    };

    buttons.forEach((button) => {
      button.addEventListener("click", handleClick);
      button.addEventListener("mouseenter", handleHover);
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("click", handleClick);
        button.removeEventListener("mouseenter", handleHover);
      });
    };
  }, [isSoundEnabled, playClick, playHover]);

  return null;
}

// Custom hook for specific sounds
export function useProductSounds() {
  const [playSuccess] = useSound("/sounds/success.mp3", { volume: 0.4 });
  const [playError] = useSound("/sounds/error.mp3", { volume: 0.4 });
  const [playHydraulic] = useSound("/sounds/hydraulic.mp3", { volume: 0.3 });

  const hapticFeedback = (pattern: number | number[] = 10) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return {
    playSuccess,
    playError,
    playHydraulic,
    hapticFeedback,
  };
}
