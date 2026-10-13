"use client";

import { cn, getProjectIcon } from "@/lib/utils";
import { openFile, selectFile } from "@/store/folders-slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import type { Project, ProjectContainerProps } from "@/types";
import Image from "next/image";
import ImageShortcut from "../programs/image-viewer/image-shortcut";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { openDocument } from "@/store/document-viewer-slice";
import { openWindow } from "@/store/window-manager-slice";
import { openUrl } from "@/store/browser-slice";
import { PROJECT_LINK_LABELS, WRITEUPS } from "@/constants";
import { getProjectsData } from "@/store/projects-slice";
import { Win98Button } from "../shared/win-98-button";

export default function ProjectContainer({ projects }: ProjectContainerProps) {
  const dispatch = useAppDispatch();
  const { selectedFile, isFileOpen } = useAppSelector((state) => state.folders);
  const projectsStatus = useAppSelector((state) => state.projects.status);

  const handleSelectProject = (project: Project) => {
    dispatch(selectFile(project));
  };

  const handleOpenProject = () => {
    dispatch(openFile());
  };

  const isDesktop = useIsDesktop();

  // Files open on double-click like the rest of the desktop, but on a
  // single tap on phones.
  const openOn = (open: () => void) =>
    isDesktop ? { onDoubleClick: open } : { onClick: open };

  const handleOpenReadme = (project: Project) => {
    const repo = new URL(project.github_url!).pathname;
    dispatch(
      openDocument({
        documentPath: repo,
        documentType: "markdown",
        title: `${project.name} - README.md`,
        folderName: project.name,
        icon: "/icons/notepad.png",
      }),
    );
    dispatch(openWindow(25));
  };

  const handleOpenWriteup = (key: string) => {
    const { path } = WRITEUPS[key];

    // Phones have no IE window; the page is plain HTML, so open it directly.
    if (!isDesktop) {
      window.open(path, "_blank", "noopener");
      return;
    }

    dispatch(openUrl(path));
    dispatch(openWindow(10));
  };

  // Projects come from Supabase; a free-tier project can be paused or slow
  // to wake, so say so instead of showing an empty folder.
  if (projects.length === 0 && projectsStatus !== "fulfilled") {
    const failed = projectsStatus === "rejected";
    return (
      <div className="size-full flex items-center justify-center p-4">
        <div className="flex max-w-sm gap-3 items-start text-sm">
          <Image
            src={failed ? "/error.png" : "/hourglass-loading.gif"}
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 shrink-0 object-contain"
          />
          <div className="space-y-3">
            <p className="font-semibold">
              {failed ? "Unable to reach the project server." : "Loading projects..."}
            </p>
            {failed && (
              <>
                <p>
                  The database may be waking up after a quiet spell. Give it a
                  few seconds and try again.
                </p>
                <Win98Button onClick={() => dispatch(getProjectsData())}>
                  Retry
                </Win98Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full min-w-0 flex flex-col">
      {/* Phones have no side panel, so show what the project is up top. */}
      {!isDesktop && isFileOpen && selectedFile && (
        <div className="flex gap-3 items-start border-b border-[#808080] bg-white p-3">
          <Image
            src={getProjectIcon(selectedFile)}
            alt=""
            width={32}
            height={32}
            className="shrink-0"
          />
          <div className="min-w-0">
            <p className="font-semibold">{selectedFile.name}</p>
            <p className="text-sm text-[#404040] leading-snug">
              {selectedFile.description}
            </p>
          </div>
        </div>
      )}

      {isFileOpen && selectedFile ? (
        <div className="grid w-full h-fit grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 p-4">
          {selectedFile.github_url && (
            <button
              type="button"
              {...openOn(() => handleOpenReadme(selectedFile))}
              className="flex flex-col items-center cursor-pointer gap-1"
            >
              <Image
                src="/icons/notepad.png"
                alt="README"
                width={38}
                height={38}
              />

              <span className={cn("font-normal text-sm")}>README.md</span>
            </button>
          )}

          {selectedFile.writeup && WRITEUPS[selectedFile.writeup] && (
            <button
              type="button"
              {...openOn(() => handleOpenWriteup(selectedFile.writeup!))}
              className="flex flex-col items-center cursor-pointer gap-1"
            >
              <Image
                src="/icons/internet-file.png"
                alt="Write-up"
                width={38}
                height={38}
              />

              <span className={cn("font-normal text-sm")}>Write-up.htm</span>
            </button>
          )}

          {/* Plain links: next/link would prefetch same-origin URLs (like the
              git-why site under this domain) as if they were portfolio pages. */}
          {selectedFile.deployment_url && (
            <a
              href={selectedFile.deployment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center cursor-pointer gap-1"
            >
              <Image
                src="/icons/internet-file.png"
                alt="Project Image"
                width={38}
                height={38}
              />

              <span className={cn("font-normal text-sm")}>
                {PROJECT_LINK_LABELS[selectedFile.name] ?? selectedFile.name}
              </span>
            </a>
          )}

          {selectedFile.github_url && (
            <a
              href={selectedFile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center cursor-pointer gap-1"
            >
              <Image
                src="/icons/github-file.png"
                alt="Project Image"
                width={38}
                height={38}
              />

              <span className={cn("font-normal text-sm")}>
                {selectedFile.name}
              </span>
            </a>
          )}

          {selectedFile.images &&
            selectedFile.images.map((image, index) => (
              <ImageShortcut
                key={`${image}-${index}`}
                name={`Image ${index + 1}`}
                imageUrl={image}
                images={selectedFile.images}
              />
            ))}
        </div>
      ) : (
        <div className="grid w-full h-fit grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 p-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                handleSelectProject(project);
                if (!isDesktop) handleOpenProject();
              }}
              onDoubleClick={handleOpenProject}
            >
              <Image
                src={getProjectIcon(project)}
                alt={project.name}
                width={40}
                height={40}
                className={cn(
                  selectedFile?.id === project.id && "brightness-75",
                )}
              />

              <p
                className={cn(
                  "text-sm",
                  selectedFile?.id === project.id && "text-white bg-[#010f80]",
                )}
              >
                {project.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
