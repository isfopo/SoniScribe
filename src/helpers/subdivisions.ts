import { PointOptions } from "peaks.js";

export type SubdivisionValue = 1 | 2 | 4 | 8 | 16 | 32 | 64;

export interface SubdivisionPointOptions extends PointOptions {
  value: SubdivisionValue;
}

export const SubdivisionPoints: Record<
  string,
  Omit<SubdivisionPointOptions, "time">
> = {
  whole: {
    color: "#fff",
    value: 1,
  },
  half: {
    color: "#ccc",
    value: 2,
  },
  quarter: {
    color: "#aaa",
    value: 4,
  },
  eighth: {
    color: "#999",
    value: 8,
  },
  sixteenth: {
    color: "#777",
    value: 16,
  },
  thirtySecond: {
    color: "#666",
    value: 32,
  },
  sixtyFourth: {
    color: "#555 ",
    value: 64,
  },
} as const;

export type Subdivision = keyof typeof SubdivisionPoints;

export const getSubdivisionValue = (
  subdivision: Subdivision
): SubdivisionValue => SubdivisionPoints[subdivision].value as SubdivisionValue;
