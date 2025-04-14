import { useCallback, useRef } from "react";
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
  const currentProject = useRef<FileSystemFileHandle | undefined>(undefined);

  const setCurrentProject = useCallback(
    (project: FileSystemFileHandle | undefined) => {
      currentProject.current = project;
    },
    [currentProject]
  );

  const addPointsToCurrentProject = useCallback(
    async (points: SubdivisionPointOptions[]) => {
      if (!currentProject.current) {
        console.error("No current project selected");
        return;
      }
      const writable = await currentProject.current.createWritable();
      const file = await currentProject.current.getFile();
      const data = await file.text();
      const projectData = JSON.parse(data) as SavedProjectData;
      projectData.points = [...projectData.points, ...points];
      await writable.write(stringify(projectData));
      await writable.close();
    },
    [currentProject]
  );

  const removePointsFromCurrentProject = useCallback(
    async (points: SubdivisionPointOptions[]) => {
      if (!currentProject.current) {
        console.error("No current project selected");
        return;
      }
      const writable = await currentProject.current.createWritable();
      const file = await currentProject.current.getFile();
      const data = await file.text();
      const projectData = JSON.parse(data) as SavedProjectData;
      projectData.points = projectData.points.filter(
        (point: SubdivisionPointOptions) =>
          !points.some((p) => p.id === point.id)
      );
      await writable.write(stringify(projectData));
      await writable.close();
    },
    [currentProject]
  );

  return {
    write,
    remove,
    projects: entries.filter((entry) => entry.name.endsWith(".json")),
    currentProject: currentProject.current,
    setCurrentProject,
    addPointsToCurrentProject,
    removePointsFromCurrentProject,
  };
};
