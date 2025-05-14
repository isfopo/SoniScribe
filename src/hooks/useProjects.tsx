import { useCallback, useRef } from "react";
import { useFileSystem } from "./useFileSystem";
import { SubdivisionPointOptions } from "../helpers/subdivisions";
import { stringify } from "../helpers/objects";
import { stripExtension } from "../helpers/files";
import { Segment, SegmentOptions } from "peaks.js";
import { mapSegmentToSegmentOptions } from "../helpers/segments";

export interface SavedProjectData {
  media: string;
  type: string;
  size: number;
  points: SubdivisionPointOptions[];
  segments?: SegmentOptions[];
}

/**
 * Custom hook to manage projects in the file system.
 * It provides functions to create, open, and remove projects.
 * It also provides functions to add and remove points from the current project.
 */
export const useProjects = () => {
  const { write, entries, remove } = useFileSystem({});

  const currentProject = useRef<FileSystemFileHandle | undefined>(undefined);

  /** The projects found on the users' folder */
  const projects = entries.filter((entry) =>
    entry.name.endsWith(".json")
  ) as FileSystemFileHandle[];

  /**
   * Sets the current project to the given project.
   * @param project The project to set as the current project.
   */
  const setCurrentProject = useCallback(
    (project: FileSystemFileHandle | undefined) => {
      currentProject.current = project;
    },
    [currentProject]
  );

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
              segments: [],
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
      if (
        currentProject.current &&
        (await file.isSameEntry(currentProject.current))
      ) {
        currentProject.current = undefined;
      }
      remove(file);
    },
    [remove]
  );

  /**
   * Adds points to the current project.
   * @param points The points to add to the current project.
   */
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

  /**
   * Removes points from the current project.
   * @param points The points to remove from the current project.
   */
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

  /**
   * Adds segments to the current project.
   * @param segments The segments to add to the current project.
   */
  const addSegmentsToCurrentProject = useCallback(
    async (segments: SegmentOptions[]) => {
      if (!currentProject.current) {
        console.error("No current project selected");
        return;
      }
      const file = await currentProject.current.getFile();
      const data = await file.text();
      const projectData = JSON.parse(data) as SavedProjectData;
      projectData.segments = [...(projectData.segments || []), ...segments];
      await write(
        currentProject.current.name,
        new Blob([stringify(projectData)], { type: "application/json" })
      );
    },
    [write]
  );

  /**
   * Removes segments from the current project.
   * @param segments The segments to remove from the current project.
   */
  const removeSegmentsFromCurrentProject = useCallback(
    async (segments: SegmentOptions[]) => {
      if (!currentProject.current) {
        console.error("No current project selected");
        return;
      }
      const file = await currentProject.current.getFile();
      const data = await file.text();
      const projectData = JSON.parse(data) as SavedProjectData;
      projectData.segments = projectData.segments?.filter(
        (segment: SegmentOptions) => !segments.some((s) => s.id === segment.id)
      );
      await write(
        currentProject.current.name,
        new Blob([stringify(projectData)], { type: "application/json" })
      );
    },
    [write]
  );

  const updateSegmentInCurrentProject = useCallback(
    async (segment: Segment, options: Partial<SegmentOptions>) => {
      if (!currentProject.current) {
        console.error("No current project selected");
        return;
      }

      segment.update(options);

      const file = await currentProject.current.getFile();
      const data = await file.text();
      const projectData = JSON.parse(data) as SavedProjectData;

      projectData.segments = projectData.segments?.map((s) => {
        if (s.id === segment.id) {
          return mapSegmentToSegmentOptions(segment);
        }
        return s;
      });

      await write(
        currentProject.current.name,
        new Blob([stringify(projectData)], { type: "application/json" })
      );
    },
    [write]
  );

  return {
    projects,
    /** The current project */
    currentProject: currentProject.current,
    setCurrentProject,
    createNewProject,
    deleteProject,
    addPointsToCurrentProject,
    removePointsFromCurrentProject,
    addSegmentsToCurrentProject,
    removeSegmentsFromCurrentProject,
    updateSegmentInCurrentProject,
  };
};
