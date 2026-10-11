"use client";

import Image from "next/image";
import { OWNER } from "@/constants";
import { useAppDispatch } from "@/store/store";
import { openWindow } from "@/store/window-manager-slice";
import { SOLITAIRE_WINDOW_ID } from "../programs/solitaire/solitaire";

interface SideIconProps {
  label: string;
  icon: string;
  shortcut?: boolean;
  onOpen: () => void;
}

// A desktop icon that is a button: focus is the selection, so it highlights
// on click, opens on double-click or Enter, and deselects on clicking away.
function SideIcon({ label, icon, shortcut, onOpen }: SideIconProps) {
  return (
    <button
      type="button"
      onDoubleClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      className="group w-24 flex flex-col items-center gap-1 select-none outline-none"
    >
      <span className="relative w-10 h-10">
        <Image
          src={icon}
          alt=""
          width={40}
          height={40}
          className="w-10 h-10 [image-rendering:pixelated] group-focus:brightness-75"
        />
        {shortcut && (
          <Image
            src="/icons/shortcut-arrow.svg"
            alt=""
            width={11}
            height={11}
            className="absolute -left-0.5 bottom-0 w-[11px] h-[11px]"
          />
        )}
      </span>
      <span className="font-normal text-sm text-white px-2 bg-[#0c7f80] group-focus:bg-[#010f80] truncate max-w-full">
        {label}
      </span>
    </button>
  );
}

export default function DesktopSideIcons() {
  const dispatch = useAppDispatch();
  const openLink = (url: string) => window.open(url, "_blank", "noopener");

  return (
    <div className="absolute right-4 top-4 flex flex-col gap-8 z-[5]">
      <SideIcon
        label="GitHub"
        icon="/icons/github-desktop.svg"
        shortcut
        onOpen={() => openLink(OWNER.github)}
      />
      <SideIcon
        label="LinkedIn"
        icon="/icons/linkedin.svg"
        shortcut
        onOpen={() => openLink(OWNER.linkedin)}
      />
      <SideIcon
        label="Solitaire"
        icon="/icons/solitaire.svg"
        onOpen={() => dispatch(openWindow(SOLITAIRE_WINDOW_ID))}
      />
    </div>
  );
}
