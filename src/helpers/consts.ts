import { PointOptions } from "peaks.js";

export const SubdivisionPoints: Record<string, Omit<PointOptions, "time">> = {
  whole: {
    color: "#fff",
  },
  half: {
    color: "#ccc",
  },
  quarter: {
    color: "#aaa",
  },
  eighth: {
    color: "#999",
  },
  sixteenth: {
    color: "#777",
  },
  thirtySecond: {
    color: "#666",
  },
  sixtyFourth: {
    color: "#555 ",
  },
} as const;
