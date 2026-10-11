"use client";

import WindowWrapper from "@/components/shared/window-wrapper";
import { SolitaireGame } from "../lazy";

export const SOLITAIRE_WINDOW_ID = 31;

export default function Solitaire() {
  return (
    <WindowWrapper
      id={SOLITAIRE_WINDOW_ID}
      title="Solitaire"
      icon="/icons/solitaire.svg"
      controls={{ close: true, minimize: true, maximize: true }}
      className="!w-[640px] !h-[560px]"
    >
      <SolitaireGame />
    </WindowWrapper>
  );
}
