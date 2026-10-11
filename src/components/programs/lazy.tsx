"use client";

import dynamic from "next/dynamic";
import HourglassLoading from "../shared/hourglass-loading";

// Heavy programs load only when first opened, so they stay out of the
// initial page bundle (PDF.js alone is a large chunk).
const loading = () => (
  <HourglassLoading className="w-full h-full flex justify-center items-center" />
);

export const PdfViewer = dynamic(() => import("./document-viewer/pdf-viewer"), {
  ssr: false,
  loading,
});

export const MarkdownViewer = dynamic(() => import("./document-viewer/markdown-viewer"), {
  ssr: false,
  loading,
});

export const SolitaireGame = dynamic(() => import("./solitaire/solitaire-game"), {
  ssr: false,
  loading,
});
