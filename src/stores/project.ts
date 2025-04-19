import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ProjectState {
  currentProject: FileSystemFileHandle | null;
  setCurrentProject: (project: FileSystemFileHandle | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      currentProject: null,
      setCurrentProject: (project) => {
        set({ currentProject: project });
      },
    }),
    {
      name: "project-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
