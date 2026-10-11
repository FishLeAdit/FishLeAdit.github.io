"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/store/store";

export type SoundType = "startup" | "click";

const soundPaths: Record<SoundType, string> = {
  startup: "/soundtrack/windows-98-startup.mp3",
  click: "/soundtrack/click.wav",
};

// Anything that reads as a button gets a click sound.
const CLICKABLE =
  'button, a, select, [role="menuitem"], [role="tab"], [role="checkbox"], [role="option"], .cursor-pointer';

// One shared element per sound, so every caller plays through the same
// volume setting and the files are only fetched once.
const audio: Partial<Record<SoundType, HTMLAudioElement>> = {};
let volume = 0.5;

function getAudio(type: SoundType) {
  if (typeof window === "undefined") return null;
  if (!audio[type]) {
    audio[type] = new Audio(soundPaths[type]);
    audio[type]!.preload = "auto";
  }
  return audio[type]!;
}

export function playSound(type: SoundType) {
  if (volume === 0) return;

  const el = getAudio(type);
  if (!el) return;

  el.volume = volume;
  el.currentTime = 0;
  // Browsers reject play() until the visitor has interacted with the page.
  el.play().catch(() => {});
}

export default function SoundManager() {
  const { volume: level, muted } = useAppSelector(
    (state) => state.settings.sound,
  );

  useEffect(() => {
    volume = muted ? 0 : level / 100;
  }, [level, muted]);

  useEffect(() => {
    getAudio("startup");
    getAudio("click");

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if ((e.target as Element | null)?.closest?.(CLICKABLE)) {
        playSound("click");
      }
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  return null;
}
