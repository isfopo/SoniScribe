import { create } from "zustand";

export interface AnchorPoint {
  x: number;
  y: number;
}

export interface ContextMenuActionParams<T> {
  event: MouseEvent;
  object: T;
}

export type ContextMenuAction<T> = (params: ContextMenuActionParams<T>) => void;

export interface ContextMenuItem<T> {
  label: string;
  key: string;
  action: ContextMenuAction<T>;
}

export interface OpenContextMenuArgs<T> {
  event: MouseEvent;
  object: T;
  items: Array<ContextMenuItem<T>>;
}

export interface ContextMenuState<T> {
  isShown: boolean;
  anchorPoint: AnchorPoint;
  initialEvent: MouseEvent | null;
  initialObject: T | null;
  items: Array<ContextMenuItem<T>>;
  openContextMenu: (args: OpenContextMenuArgs<unknown>) => void;
  closeContextMenu: () => void;
}

const defaults: Omit<
  ContextMenuState<unknown>,
  "openContextMenu" | "closeContextMenu"
> = {
  isShown: false,
  anchorPoint: { x: 0, y: 0 },
  initialEvent: null,
  initialObject: null,
  items: [],
};

export const useContextMenuStore = create<ContextMenuState<unknown>>()(
  (set) => ({
    ...defaults,
    openContextMenu: ({
      event,
      object,
      items,
    }: OpenContextMenuArgs<unknown>) => {
      event.preventDefault();
      set({
        anchorPoint: { x: event.pageX, y: event.pageY },
        isShown: true,
        initialEvent: event,
        initialObject: object,
        items,
      });
    },
    closeContextMenu: () => set(defaults),
  })
);
