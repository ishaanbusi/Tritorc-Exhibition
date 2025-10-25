"use client";

import { useEffect } from "react";
import { useMemory } from "./MemoryManager";

export default function ViewedMarker({
  slug,
  name,
  model,
}: {
  slug: string;
  name: string;
  model?: string;
}) {
  const { addView } = useMemory();

  useEffect(() => {
    if (!slug) return;

    // Idempotent guard per-tab/per-slug to survive Strict Effects double runs
    const key = `rv:${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    // Defer to next microtask to avoid any hydration ordering issues
    queueMicrotask(() => {
      addView({
        id: slug,
        slug,
        name,
        images: [`/images/${slug}.jpg`],
        category: model,
      });
    });
  }, [slug, name, model, addView]);

  return null;
}
