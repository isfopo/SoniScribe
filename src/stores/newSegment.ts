import { Point } from "peaks.js";
import { create } from "zustand";

export interface NewSegmentState {
  start: Point | null;
  end: Point | null;
  isDrawing: boolean;
  addStart: (point: Point) => void;
  addEnd: (point: Point) => void;
  clear: () => void;
}

/**
 * NewSegmentState is a Zustand store that manages the state of new segments.
 * It includes the start and end points of the segment, a flag to indicate if the segment is being drawn,
 * and methods to add start and end points, and clear the segment.
 */
export const useNewSegmentStore = create<NewSegmentState>()((set) => ({
  start: null,
  end: null,
  isDrawing: false,
  addStart: (point) => set({ start: point, isDrawing: true }),
  addEnd: (point) => set({ end: point, isDrawing: false }),
  clear: () => set({ start: null, end: null, isDrawing: false }),
}));
