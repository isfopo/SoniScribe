import { useCallback, useRef } from "react";
import { useFileSystem } from "./useFileSystem";
import { SubdivisionPointOptions } from "../helpers/subdivisions";
import { stringify } from "../helpers/objects";
import { stripExtension } from "../helpers/files";

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

  const createNewProject = useCallback(
    async (mediaFile: File) => {
      const name = prompt(
        "Enter a name for the file:",
        stripExtension(mediaFile.name)
      );
      if (!name) {
        console.error("No name provided for the project");
        return;
      }
      // Write the media file to the file system
      await write(mediaFile.name, mediaFile);

      const projectFile = await write(
        `${name}.json`,
        new Blob(
          [
            JSON.stringify({
              media: mediaFile.name,
              type: mediaFile.type,
              size: mediaFile.size,
              points: [],
            } as SavedProjectData),
          ],
          { type: "application/json" }
        )
      );

      if (!projectFile) {
        console.error("Failed to create project file");
        return;
      }

      setCurrentProject(projectFile);
    },
    [write, setCurrentProject]
  );

  const addPointsToCurrentProject = useCallback(
    async (points: SubdivisionPointOptions[]) => {
      if (!currentProject.current) {
        console.error("No current project selected");
        return;
      }

      const file = await currentProject.current.getFile();
      const data = await file.text();
      const projectData = JSON.parse(data) as SavedProjectData;
      projectData.points = [...projectData.points, ...points];

      await write(
        currentProject.current.name,
        new Blob([stringify(projectData)], { type: "application/json" })
      );
    },
    [write]
  );

  const removePointsFromCurrentProject = useCallback(
    async (points: SubdivisionPointOptions[]) => {
      if (!currentProject.current) {
        console.error("No current project selected");
        return;
      }

      const file = await currentProject.current.getFile();
      const data = await file.text();
      const projectData = JSON.parse(data) as SavedProjectData;

      projectData.points = projectData.points.filter(
        (point: SubdivisionPointOptions) =>
          !points.some((p) => p.id === point.id)
      );

      await write(
        currentProject.current.name,
        new Blob([stringify(projectData)], { type: "application/json" })
      );
    },
    [write]
  );

  return {
    write,
    remove,
    projects: entries.filter((entry) => entry.name.endsWith(".json")),
    currentProject: currentProject.current,
    setCurrentProject,
    createNewProject,
    addPointsToCurrentProject,
    removePointsFromCurrentProject,
  };
};
