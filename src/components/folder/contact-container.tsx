"use client";

import Image from "next/image";
import { useState } from "react";
import { Win98Button } from "@/components/shared/win-98-button";
import { OWNER, RESUME } from "@/constants";

const rows = [
  {
    label: "E-mail",
    value: OWNER.email,
    href: `mailto:${OWNER.email}`,
    action: "Send Mail",
    copy: true,
  },
  {
    label: "Phone",
    value: OWNER.phone,
    href: `tel:${OWNER.phone}`,
    action: "Call",
    copy: true,
  },
  {
    label: "GitHub",
    value: OWNER.github.replace(/^https:\/\//, ""),
    href: OWNER.github,
    action: "Open",
    copy: false,
  },
  {
    label: "LinkedIn",
    value: "Jawad Adit Chowdhury",
    href: OWNER.linkedin,
    action: "Open",
    copy: false,
  },
];

export default function ContactContainer() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); the value is still visible.
    }
  };

  return (
    <div className="w-full h-fit p-4 text-sm">
      <div className="flex items-center gap-3 mb-4">
        <Image src="/modem.png" alt="Modem" width={40} height={40} />
        <div>
          <p className="font-semibold text-base">{OWNER.name}</p>
          <p className="text-[#404040]">{OWNER.role}</p>
        </div>
      </div>

      <fieldset className="border border-[#808080] shadow-[1px_1px_0_#fff] px-3 pb-3 pt-1">
        <legend className="px-1">Connection details</legend>

        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-wrap items-center gap-x-3 gap-y-1"
            >
              <span className="w-16 shrink-0">{row.label}:</span>

              <span className="flex-1 min-w-[160px] bg-white px-1 py-0.5 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white truncate select-all">
                {row.value}
              </span>

              <div className="flex gap-1">
                <Win98Button asChild className="min-w-16">
                  <a
                    href={row.href}
                    target={row.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    {row.action}
                  </a>
                </Win98Button>

                {row.copy && (
                  <Win98Button
                    className="min-w-16"
                    onClick={() => handleCopy(row.label, row.value)}
                  >
                    {copied === row.label ? "Copied!" : "Copy"}
                  </Win98Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="flex justify-end mt-4">
        <Win98Button asChild>
          <a href={RESUME.documentPath} download>
            Download CV
          </a>
        </Win98Button>
      </div>
    </div>
  );
}
