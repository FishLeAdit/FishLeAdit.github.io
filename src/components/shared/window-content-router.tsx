"use client";

import type { WindowItem, Folder } from "@/types";
import ProgramsContainer from "../folder/programs-container";
import ProjectContainer from "../folder/project-container";
import ContactContainer from "../folder/contact-container";
import { useAppSelector } from "@/store/store";
import NotAvailable from "./not-available";

export default function WindowContentRouter({
  window,
}: {
  window: WindowItem;
}) {
  const { projects } = useAppSelector((state) => state.projects);

  if (window.type === "program") {
    return <ProgramsContainer programs={[window]} />;
  }

  const folder = window as Folder;

  if (folder.name === "Projects") {
    return <ProjectContainer projects={projects} />;
  }

  if (folder.name === "Contact me") {
    return <ContactContainer />;
  }

  return <NotAvailable message="Not available yet." />;
}
