import { useCallback, useEffect, useState } from "react";
import { useFileSystem } from "./useFileSystem";
import { SubdivisionPointOptions } from "../helpers/subdivisions";
import { stringify } from "../helpers/objects";
import { stripExtension } from "../helpers/files";
import { useProjectStore } from "../stores/project";

export interface SavedProjectData {
  media: string;
  type: string;
  size: number;
  points: SubdivisionPointOptions[];
}

/**
 * Custom hook to manage projects in the file system.
 * It provides functions to create, open, and remove projects.
 * It also provides functions to add and remove points from the current project.
 */
export const useProjects = () => {
  const { write, entries, remove } = useFileSystem({});
  const { getCurrentProject, setCurrentProject } = useProjectStore();

  const [currentProject, setCurrentProjectState] =
    useState<FileSystemFileHandle>();

  useEffect(() => {
    const loadCurrentProject = async () => {
      const project = await getCurrentProject();
      if (project) {
        setCurrentProjectState(project);
      }
    };
    loadCurrentProject();
  }, [getCurrentProject]);

  /** The projects found on the users' folder */
  const projects = entries.filter((entry) =>
    entry.name.endsWith(".json")
  ) as FileSystemFileHandle[];

  /**
   * Creates a new project with the given media file.
   * @param mediaFile The media file to create a project for.
   */
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

  /**
   * Removes a project from the file system.
   */
  const deleteProject = useCallback(
    async (file: FileSystemFileHandle) => {
      const currentProject = await getCurrentProject();

      if (currentProject && (await file.isSameEntry(currentProject))) {
        setCurrentProject(null);
      }
      remove(file);
    },
    [getCurrentProject, remove, setCurrentProject]
  );

  /**
   * Adds points to the current project.
   * @param points The points to add to the current project.
   */
  const addPointsToCurrentProject = useCallback(
    async (points: SubdivisionPointOptions[]) => {
      const currentProject = await getCurrentProject();

      if (!currentProject) {
        console.error("No current project selected");
        return;
      }

      const file = await currentProject.getFile();
      const data = await file.text();
      const projectData = JSON.parse(data) as SavedProjectData;
      projectData.points = [...projectData.points, ...points];

      await write(
        currentProject.name,
        new Blob([stringify(projectData)], { type: "application/json" })
      );
    },
    [getCurrentProject, write]
  );

  /**
   * Removes points from the current project.
   * @param points The points to remove from the current project.
   */
  const removePointsFromCurrentProject = useCallback(
    async (points: SubdivisionPointOptions[]) => {
      const currentProject = await getCurrentProject();

      if (!currentProject) {
        console.error("No current project selected");
        return;
      }

      const file = await currentProject.getFile();
      const data = await file.text();
      const projectData = JSON.parse(data) as SavedProjectData;

      projectData.points = projectData.points.filter(
        (point: SubdivisionPointOptions) =>
          !points.some((p) => p.id === point.id)
      );

      await write(
        currentProject.name,
        new Blob([stringify(projectData)], { type: "application/json" })
      );
    },
    [getCurrentProject, write]
  );

  return {
    projects,
    /** The current project */
    currentProject,
    setCurrentProject,
    /** The function to create a new project */
    createNewProject,
    /** The function to delete a project */
    deleteProject,
    addPointsToCurrentProject,
    removePointsFromCurrentProject,
  };
};
