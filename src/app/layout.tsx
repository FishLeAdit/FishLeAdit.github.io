import type { Metadata, Viewport } from "next";
import { Titillium_Web, Inter, Jost } from "next/font/google";
import "./globals.css";

import ReduxProvider from "@/store/redux-provider";
import SoundManager from "@/components/shared/sound-manager";
import { ThemeProvider } from "@/themes/theme-provider";

const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700", "900"],
  style: "normal",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Jawad Adit Chowdhury | 98.portfolio",
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
            className={`${inter.variable} ${jost.variable} ${titillium.className}`}
          >
            <SoundManager />
            {children}
          </body>
        </html>
      </ThemeProvider>
    </ReduxProvider>
  );
}
