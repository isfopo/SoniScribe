import { useState } from "react";
import { useFileSystem } from "./useFileSystem";

export interface UseProjectsOptions {}

export const useProjects = ({}: UseProjectsOptions) => {
  const { write, entries, remove } = useFileSystem({});

  const [currentProject, setCurrentProject] = useState<
    FileSystemHandle | undefined
  >();

  return {
    write,
    remove,
    projects: entries.filter((entry) => entry.name.endsWith(".json")),
    currentProject,
    setCurrentProject,
  };
};
