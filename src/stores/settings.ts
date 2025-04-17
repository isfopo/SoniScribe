import { create } from "zustand";
import { Subdivision } from "../helpers/subdivisions";
import { persist, createJSONStorage } from "zustand/middleware";

export interface SettingsState {
  subdivision: Subdivision;
  setSubdivision: (subdivision: Subdivision) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      /** Current subdivision  */
      subdivision: 1,
      /** Sets the current subdivision */
      setSubdivision: (subdivision) => {
        set({ subdivision });
      },
    }),
    {
      name: "settings-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
