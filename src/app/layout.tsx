import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

import ReduxProvider from "@/store/redux-provider";
import SoundManager from "@/components/shared/sound-manager";
import { ThemeProvider } from "@/themes/theme-provider";

// Self-hosted (SIL OFL, see fonts/OFL.txt) so the build never has to reach
// Google Fonts; that download kept hanging builds on this machine.
const titillium = localFont({
  src: [
    { path: "./fonts/titillium-web-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/titillium-web-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/titillium-web-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/titillium-web-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jawad Adit Chowdhury | Portfolio",
  description:
    "Portfolio of Jawad Adit Chowdhury, full-stack and ML developer, built as a Windows 98 desktop.",
};

// viewport-fit=cover lets the mobile layout pad itself around notches and
// the home indicator with env(safe-area-inset-*).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <html lang="en">
          <body
            className={titillium.className}
          >
            <SoundManager />
            {children}
          </body>
        </html>
      </ThemeProvider>
    </ReduxProvider>
  );
}
