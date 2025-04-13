import { useState } from "react";
import { useFileSystem } from "./useFileSystem";
import { SubdivisionPoint } from "../helpers/subdivisions";

export const useProjects = () => {
  const { write, entries, remove } = useFileSystem({});

  const [currentProject, setCurrentProject] = useState<
    FileSystemFileHandle | undefined
  >();

  const addPointsToCurrentProject = async (points: SubdivisionPoint[]) => {
    if (!currentProject) {
      console.error("No current project selected");
      return;
    }
    const fileHandle = currentProject;
    const writable = await fileHandle.createWritable();
    const file = await fileHandle.getFile();
    const data = await file.text();
    const projectData = JSON.parse(data);
    projectData.points.push(points);
    await writable.write(JSON.stringify(projectData));
    await writable.close();
  };

  return {
    write,
    remove,
    projects: entries.filter((entry) => entry.name.endsWith(".json")),
    currentProject,
    setCurrentProject,
    addPointsToCurrentProject,
  };
};
