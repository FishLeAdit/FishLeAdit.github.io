"use client";

import DesktopLayout from "@/components/desktop/desktop-layout";
import MobileLayout from "@/components/mobile/mobile-layout";
import { useIsDesktop } from "@/hooks/use-is-desktop";

export default function Home() {
  const isDesktop = useIsDesktop();

  // Until the screen size is known, show the boot screen's black instead of
  // a white flash (the static export's HTML is rendered before this runs).
  if (isDesktop === null) return <div className="fixed inset-0 bg-black" />;

  return isDesktop ? <DesktopLayout /> : <MobileLayout />;
}
