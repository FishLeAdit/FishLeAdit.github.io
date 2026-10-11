"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { Separator } from "../../ui/separator";
import HourglassLoading from "../../shared/hourglass-loading";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

// Pages render at the window's width (capped), so the CV fits a phone
// screen and the desktop window without sideways scrolling.
const MAX_PAGE_WIDTH = 900;

export default function PdfViewer({ documentPath }: { documentPath: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [width, setWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.min(entry.contentRect.width - 16, MAX_PAGE_WIDTH));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto bg-white">
      <Document
        file={documentPath}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <HourglassLoading className="w-full h-full flex mt-40 justify-center items-center" />
        }
        noData={"Page not found."}
      >
        {width &&
          (Array.apply(null, Array(numPages)) as number[])
            .map((_, i: number) => i + 1)
            .map((page: number) => {
              return (
                <div key={page} className="w-full flex flex-col items-center py-2">
                  <Page
                    pageNumber={page}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    width={width}
                  />
                  {page < (numPages ?? 0) && <Separator className="h-2" />}
                </div>
              );
            })}
      </Document>
    </div>
  );
}
