import { create } from "zustand";

export interface Dialog {
  id: string;
  component: React.ReactElement;
}

export interface DialogState {
  activeDialogs: Dialog[];
  addDialog: (dialog: Dialog) => void;
  closeDialog: () => void;
  removeDialog: (dialog: Dialog) => void;
  clearDialogs: () => void;
}

export const useDialogStore = create<DialogState>()((set) => ({
  activeDialogs: [],
  addDialog: (dialog) => {
    set((state) => ({
      activeDialogs: [...state.activeDialogs, dialog],
    }));
  },
  removeDialog: (dialog) => {
    set((state) => ({
      activeDialogs: state.activeDialogs.filter((d) => d.id !== dialog.id),
    }));
  },
  closeDialog: () => {
    set((state) => ({
      activeDialogs: state.activeDialogs.slice(0, -1),
    }));
  },
  clearDialogs: () => set({ activeDialogs: [] }),
}));
