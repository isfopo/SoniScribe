import { create } from "zustand";
import { Subdivision } from "../helpers/subdivisions";

export interface SettingsState {
  subdivision: Subdivision;
  setSubdivision: (subdivision: Subdivision) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  subdivision: "whole",
  setSubdivision: (subdivision) => set({ subdivision }),
}));
