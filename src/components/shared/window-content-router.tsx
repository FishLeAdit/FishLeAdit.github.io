"use client";

import type { WindowItem, Folder } from "@/types";
import ProjectContainer from "../folder/project-container";
import ContactContainer from "../folder/contact-container";
import MobileDocument from "../mobile/mobile-document";
import ImageSlider from "../programs/image-viewer/image-slider";
import SolitaireGame from "../programs/solitaire/solitaire-game";
import { useAppSelector } from "@/store/store";
import NotAvailable from "./not-available";

// Content of a full-screen window on phones. Desktop renders each program in
// its own floating window instead.
export default function WindowContentRouter({
  window,
}: {
  window: WindowItem;
}) {
  const { projects } = useAppSelector((state) => state.projects);
  const { images, currentIndex } = useAppSelector((state) => state.imageViewer);

  if (window.type === "program") {
    if (window.id === 25) return <MobileDocument />;

    if (window.id === 31) return <SolitaireGame />;

    if (window.id === 11 && images.length > 0) {
      return (
        <div className="flex h-full min-h-0 flex-col">
          <ImageSlider images={images} initialIndex={currentIndex} />
        </div>
      );
    }

    return <NotAvailable message="Best viewed on a desktop." />;
  }

  const folder = window as Folder;

  if (folder.name === "Projects") {
    return <ProjectContainer projects={projects} />;
  }

  if (folder.name === "Contact me") {
    return <ContactContainer />;
  }

  return <NotAvailable message="Not available yet." />;
}
