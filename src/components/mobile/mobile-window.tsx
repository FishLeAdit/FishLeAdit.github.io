"use client";

import { AnimatePresence, motion } from "framer-motion";
import WindowContentRouter from "../shared/window-content-router";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { closeWindow } from "@/store/window-manager-slice";
import { clearSelectedFile } from "@/store/folders-slice";
import Image from "next/image";
import { getProjectsData } from "@/store/projects-slice";
import { useEffect } from "react";

export default function MobileWindow() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProjectsData());
  }, [dispatch]);

  const window = useAppSelector((state) => {
    const items = state.windows.dockItems;
    return items.length > 0 ? items[items.length - 1] : null;
  });

  const documentTitle = useAppSelector((state) => state.documentViewer.title);

  if (!window) return null;

  const title = window.id === 25 ? documentTitle : window.name;

  const handleClose = () => {
    dispatch(clearSelectedFile());
    dispatch(closeWindow(window.id));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed inset-x-0 top-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-50 bg-[#c0c0c0] flex flex-col crt pt-[env(safe-area-inset-top)]"
      >
        <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white pl-2 pr-1 py-1 flex justify-between items-center gap-2">
          <span className="text-sm font-bold truncate">{title}</span>
          <Button
            variant="w98"
            aria-label="Close"
            className="bg-[#C0C0C0] w-10 h-9 p-1 flex items-center justify-center shrink-0"
            onClick={handleClose}
          >
            <Image
              width={0}
              height={0}
              alt=""
              src="/close.svg"
              className="w-3.5 h-auto"
            />
          </Button>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <WindowContentRouter window={window} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
