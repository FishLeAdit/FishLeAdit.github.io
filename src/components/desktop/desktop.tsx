"use client";

import Shortcut from "../dock/shortcut";
import { useAppSelector } from "@/store/store";
import ProjectContainer from "../folder/project-container";
import ContactContainer from "../folder/contact-container";
import { Folder } from "@/types";
import DesktopContextMenu from "./desktop-context-menu";
import { DisplayProperties } from "../programs/display-properties/display-properties";
import InternetExplorer from "../programs/IE/internet-explorer";
import ImageViewer from "../programs/image-viewer/image-viewer";
import DocumentViewer from "../programs/document-viewer/document-viewer";
import DocumentViewerShortcut from "../programs/document-viewer/document-viewer-shortcut";
import { RESUME } from "@/constants";
import AboutDialog from "../programs/about-dialog";
import Solitaire from "../programs/solitaire/solitaire";
import DesktopSideIcons from "./desktop-side-icons";

export default function Desktop() {
  const { projects } = useAppSelector((state) => state.projects);
  const { windows } = useAppSelector((state) => state.windows);
  const folders = windows.filter((window) => window.type === "folder");

  return (
    <DesktopContextMenu>
      <>
        <div className="pt-4 grid grid-flow-col auto-cols-[96px] grid-rows-[repeat(auto-fit,96px)] gap-x-6 gap-y-8 size-full relative overflow-hidden">
          {folders.map((folder) => (
            <Shortcut folder={folder as Folder} key={folder.id}>
              {folder.name === "Projects" && (
                <ProjectContainer projects={projects} />
              )}
              {folder.name === "Contact me" && <ContactContainer />}
            </Shortcut>
          ))}

          <DocumentViewerShortcut id={25} {...RESUME} />

          <DesktopSideIcons />
        </div>

        <DisplayProperties />

        <InternetExplorer />

        <ImageViewer />

        <DocumentViewer />

        <AboutDialog />

        <Solitaire />
      </>
    </DesktopContextMenu>
  );
}
