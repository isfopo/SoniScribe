import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ProjectState {
  currentProject: string | null;
  getCurrentProject: () => Promise<FileSystemFileHandle | null>;
  setCurrentProject: (project: FileSystemFileHandle | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      currentProject: null,
      getCurrentProject: async () => {
        const { currentProject } = get();

        if (!currentProject) {
          return null;
        }

        const root = await navigator.storage.getDirectory();
        return await root.getFileHandle(currentProject, {
          create: true,
        });
      },
      setCurrentProject: (project) => {
        set({ currentProject: project?.name });
      },
    }),
    {
      name: "project-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
