"use client";

import { motion } from "framer-motion";
import Clock from "../dock/clock";
import Image from "next/image";

interface TaskbarProps {
  onRecentApps: () => void;
  onHome: () => void;
  onBack: () => void;
}

const buttonTap = {
  scale: 0.97,
  transition: { duration: 0.05, ease: "linear" },
};

export default function Taskbar({
  onRecentApps,
  onHome,
  onBack,
}: TaskbarProps) {
  return (
    <div className="crt fixed bottom-0 left-0 right-0 z-50 h-[calc(3.5rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] bg-[#c0c0c0] border-[2px] border-solid border-black border-t-white border-l-white rounded-none border-b-0 flex items-center px-2 gap-2 select-none">
      <motion.button
        whileTap={buttonTap}
        onClick={onRecentApps}
        aria-label="Recent apps"
        className="h-11 w-11 border-[2px] border-solid border-black border-t-white border-l-white rounded-none px-[2px] gap-1 hover:border-black hover:border-b-white hover:border-r-white flex items-center justify-center"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          shapeRendering="crispEdges"
        >
          <rect x="3" y="3" width="8" height="6" fill="#000000"  />
          <rect x="5" y="5" width="8" height="6" fill="#000000" />
          <rect x="7" y="7" width="8" height="6" fill="#000000" />
        </svg>
      </motion.button>

      <motion.button
        whileTap={buttonTap}
        onClick={onHome}
        aria-label="Home"
        className="h-11 w-11 border-[2px] border-solid border-black border-t-white border-l-white rounded-none px-[2px] gap-1 hover:border-black hover:border-b-white hover:border-r-white flex items-center justify-center"
      >
        <Image src="/windows.png" alt="Home Icon" width={16} height={16} />
      </motion.button>

      <motion.button
        whileTap={buttonTap}
        onClick={onBack}
        aria-label="Back"
        className="h-11 w-11 border-[2px] border-solid border-black border-t-white border-l-white rounded-none px-[2px] gap-1 hover:border-black hover:border-b-white hover:border-r-white flex items-center justify-center"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path
            d="M9 3L4 8L9 13"
            stroke="#000080"
            strokeWidth="2"
            strokeLinecap="square"
            shapeRendering="crispEdges"
          />
        </svg>
      </motion.button>

      <div className="flex-1 h-full border border-[#808080] mx-1" />

      <div className="h-11 flex items-center justify-center border-[2px] border-solid border-black border-t-white border-l-white rounded-none px-[2px] gap-1 hover:border-black hover:border-b-white hover:border-r-white">
        <Clock showSeconds={true} className="" />
      </div>
    </div>
  );
}
