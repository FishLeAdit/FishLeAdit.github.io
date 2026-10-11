"use client";

import { useAppSelector } from "@/store/store";
import { Win98Button } from "@/components/shared/win-98-button";
import PdfViewer from "../programs/document-viewer/pdf-viewer";
import MarkdownViewer from "../programs/document-viewer/markdown-viewer";
import { documentHref } from "../programs/document-viewer/document-viewer";

// Phone version of the Document Viewer: no menus, just the document and
// a way to get the file itself, since PDF rendering on phones is fragile.
export default function MobileDocument() {
  const { documentPath, documentType } = useAppSelector(
    (state) => state.documentViewer,
  );

  if (!documentPath) return null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-none items-center justify-end gap-2 border-b border-[#808080] p-2">
        <Win98Button asChild className="h-10 px-4">
          <a
            href={documentHref(documentPath, documentType)}
            target="_blank"
            rel="noopener noreferrer"
            download={documentType === "pdf" ? "" : undefined}
          >
            {documentType === "pdf" ? "Download PDF" : "Open on GitHub"}
          </a>
        </Win98Button>
      </div>

      <div className="min-h-0 flex-1">
        {documentType === "pdf" ? (
          <PdfViewer documentPath={documentPath} />
        ) : (
          <MarkdownViewer documentPath={documentPath} />
        )}
      </div>
    </div>
  );
}
