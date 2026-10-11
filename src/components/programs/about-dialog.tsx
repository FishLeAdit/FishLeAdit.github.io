"use client";

import Image from "next/image";
import WindowWrapper from "@/components/shared/window-wrapper";
import { Win98Button } from "@/components/shared/win-98-button";
import { useAppDispatch } from "@/store/store";
import { closeWindow } from "@/store/window-manager-slice";
import { TEMPLATE } from "@/constants";

export const ABOUT_WINDOW_ID = 30;

// Help → About: credits the template this desktop is built on.
export default function AboutDialog() {
  const dispatch = useAppDispatch();

  return (
    <WindowWrapper
      id={ABOUT_WINDOW_ID}
      title="About"
      icon="/icons/help-book.png"
      controls={{ close: true, minimize: false, maximize: false }}
      className="!w-[440px] !h-auto"
    >
      <div className="p-4 text-sm">
        <div className="flex gap-4">
          <Image
            src="/windows.png"
            alt=""
            width={48}
            height={48}
            className="w-12 h-12 shrink-0 object-contain"
          />

          <div className="space-y-3">
            <p className="font-semibold text-base">About this desktop</p>

            <p>
              This portfolio is built on{" "}
              <span className="font-semibold">{TEMPLATE.name}</span>, an
              open-source Windows 98 desktop made by{" "}
              <span className="font-semibold">{TEMPLATE.author}</span>. The
              windows, folders, taskbar, boot screens and Display Properties
              are his work. I trimmed it down and filled it with my own
              projects.
            </p>

            <p>Thank you, Alexandre, for sharing it!</p>
          </div>
        </div>

        <hr className="my-4 border-t border-t-[#808080] border-b border-b-white" />

        <div className="flex flex-wrap justify-end gap-2">
          <Win98Button asChild>
            <a href={TEMPLATE.repo} target="_blank" rel="noopener noreferrer">
              View the original repo
            </a>
          </Win98Button>

          <Win98Button asChild>
            <a
              href={TEMPLATE.authorGithub}
              target="_blank"
              rel="noopener noreferrer"
            >
              {TEMPLATE.author} on GitHub
            </a>
          </Win98Button>

          <Win98Button onClick={() => dispatch(closeWindow(ABOUT_WINDOW_ID))}>
            OK
          </Win98Button>
        </div>
      </div>
    </WindowWrapper>
  );
}
