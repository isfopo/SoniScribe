import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ProjectState {
  currentProject: FileSystemFileHandle | null;
  setCurrentProject: (project: FileSystemFileHandle | null) => void;
  projects: FileSystemFileHandle[];
  setProjects: (projects: FileSystemFileHandle[]) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      currentProject: null,
      setCurrentProject: (project) => {
        set({ currentProject: project });
      },
      projects: [],
      setProjects: (projects) => {
        set({ projects });
      },
    }),
    {
      name: "project-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
