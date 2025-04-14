import { useCallback, useState } from "react";
import { useFileSystem } from "./useFileSystem";
import { SubdivisionPointOptions } from "../helpers/subdivisions";
import { stringify } from "../helpers/objects";

export interface SavedProjectData {
  media: string;
  type: string;
  size: number;
  points: SubdivisionPointOptions[];
}
export const useProjects = () => {
  const { write, entries, remove } = useFileSystem({});

  const [currentProject, setCurrentProject] = useState<
    FileSystemFileHandle | undefined
  >();

  const addPointsToCurrentProject = useCallback(
    async (points: SubdivisionPointOptions[]) => {
      if (!currentProject) {
        console.error("No current project selected");
        return;
      }
      const fileHandle = currentProject;
      const writable = await fileHandle.createWritable();
      const file = await fileHandle.getFile();
      const data = await file.text();
      const projectData = JSON.parse(data) as SavedProjectData;
      projectData.points = [...projectData.points, ...points];
      await writable.write(stringify(projectData));
      await writable.close();
    },
    [currentProject]
  );

  return {
    write,
    remove,
    projects: entries.filter((entry) => entry.name.endsWith(".json")),
    currentProject,
    setCurrentProject,
    addPointsToCurrentProject,
  };
};
