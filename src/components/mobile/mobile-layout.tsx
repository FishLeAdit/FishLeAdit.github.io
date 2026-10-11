"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import StatusBar from "./status-bar";
import ClockWidget from "./clock-widget";
import AppIcon from "./app-icon";
import TipsBox from "./tips-box";
import Taskbar from "./task-bar";
import RecentAppsDrawer from "./recent-apps-drawer";
import AllAppsDrawer from "./all-apps-drawer";
import BootAnimation from "./boot-animation";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Folder } from "@/types";
import { folders, RESUME } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { openWindow, closeWindow } from "@/store/window-manager-slice";
import { closeFile } from "@/store/folders-slice";
import { openDocument } from "@/store/document-viewer-slice";
import { bootState } from "@/lib/boot-state";
import MobileWindow from "./mobile-window";

// My Resume is a document, not a folder; it opens in the Document Viewer (25).
const resumeItem: Folder = {
  id: 25,
  name: RESUME.title,
  image: RESUME.icon,
  isOpen: false,
  isMaximized: false,
  isMinimized: false,
  isDocument: true,
  documentType: "pdf",
  documentPath: RESUME.documentPath,
};

export default function MobileLayout() {
  const [showBoot, setShowBoot] = useState(!bootState.done);
  const [showAllApps, setShowAllApps] = useState(false);
  const [showRecentApps, setShowRecentApps] = useState(false);
  const [recentApps, setRecentApps] = useState<
    Array<{ label: string; iconImage?: string }>
  >([]);

  const dispatch = useAppDispatch();

  const isDrawerOpen = showAllApps || showRecentApps;

  const apps = [...folders, resumeItem];

  const { dockItems } = useAppSelector((state) => state.windows);
  const { isFileOpen } = useAppSelector((state) => state.folders);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const handleFolderClick = (folder: Folder) => {
    setRecentApps((prev) => {
      const filtered = prev.filter((a) => a.label !== folder.name);
      return [
        { label: folder.name, iconImage: folder.image },
        ...filtered,
      ].slice(0, 6);
    });

    if (folder.id === resumeItem.id) dispatch(openDocument(RESUME));
    dispatch(openWindow(folder.id));
  };

  const handleHomeClick = () => {
    setShowAllApps(false);
    setShowRecentApps(false);
    dispatch(closeFile());
    dockItems.forEach((item) => dispatch(closeWindow(item.id)));
    window.scrollTo({ top: 0 });
  };

  const handleRecentAppsClick = () => {
    setShowRecentApps(true);
    setShowAllApps(false);
  };

  const handleBackClick = () => {
    // Inside a project, Back returns to the project list first.
    if (dockItems.length > 0 && isFileOpen) {
      dispatch(closeFile());
      return;
    }

    if (dockItems.length > 0) {
      const lastOpened = dockItems[dockItems.length - 1];
      dispatch(closeWindow(lastOpened.id));
      return;
    }

    if (showRecentApps) setShowRecentApps(false);
    else if (showAllApps) setShowAllApps(false);
  };

  if (showBoot) {
    return (
      <AnimatePresence>
        <BootAnimation
          onComplete={() => {
            bootState.done = true;
            setShowBoot(false);
          }}
        />
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[url('/windows-98-cloud.jpg')] bg-cover crt flex flex-col relative overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-24 px-2 pt-[calc(1rem+env(safe-area-inset-top))]">
        <StatusBar />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          <ClockWidget />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 col-span-2 md:col-span-3">
            {apps.map((folder) => (
              <AppIcon
                key={folder.id}
                item={folder}
                onClick={handleFolderClick}
              />
            ))}
          </div>

          <div className="col-span-2 md:col-span-full">
            <TipsBox />
          </div>
        </div>

        <div className="flex justify-end px-2 mb-6">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-white font-bold text-sm hover:bg-white/10"
            onClick={() => setShowAllApps(true)}
            style={{
              textShadow: `
                1px 1px 0 rgba(0,0,0,0.8),
                0 0 2px rgba(255,255,255,0.25)
              `,
            }}
          >
            <span>All Apps</span>
            <Image src="/arrow-right.svg" alt="arrow" width={12} height={12} />
          </Button>
        </div>
      </div>

      <Taskbar
        onRecentApps={handleRecentAppsClick}
        onHome={handleHomeClick}
        onBack={handleBackClick}
      />

      <RecentAppsDrawer
        show={showRecentApps}
        recentApps={recentApps}
        onClose={() => setShowRecentApps(false)}
        onRemoveApp={(index) =>
          setRecentApps((prev) => prev.filter((_, i) => i !== index))
        }
      />

      <AllAppsDrawer
        show={showAllApps}
        folders={apps}
        onClose={() => setShowAllApps(false)}
        onFolderClick={handleFolderClick}
      />

      <MobileWindow />
    </div>
  );
}
