"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const TIPS = [
  "Tap Projects to see what I've built. Each project has its README, a live demo and the source code.",
  "The Pediatric Brain Tumor project has a write-up page about my thesis. Open it, then tap Write-up.htm.",
  "Want to get in touch? Contact me has my e-mail, phone, GitHub and LinkedIn.",
  "My Resume opens my CV right here. There's a Download PDF button at the top.",
  "This site is a Windows 98 desktop. Open it on a computer for draggable windows, themes and wallpapers.",
];

export default function TipsBox() {
  // Picked after mount so the server and client render the same first tip.
  const [tip, setTip] = useState(TIPS[0]);

  useEffect(() => {
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: "linear" }}
      className="col-span-2 md:col-span-1 bg-[#fffef7] border-[2px] border-solid border-black border-t-white border-l-white rounded-none p-2 flex flex-col select-none"
      style={{
        fontFamily: `"MS Sans Serif", Tahoma, monospace`,
      }}
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="w-8 h-8 flex items-center justify-center border border-t-[#404040] border-l-[#404040] border-r-white border-b-white bg-[#c0c0c0] text-black text-xs font-bold">
          i
        </div>

        <div className="flex-1">
          <h3 className="text-xs font-bold mb-1 text-black">
            Did you know...
          </h3>

          <p className="text-xs leading-snug text-black">{tip}</p>
        </div>
      </div>

      <div className="mt-auto text-[10px] font-bold text-black">Tips</div>
    </motion.div>
  );
}
