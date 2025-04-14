import { Point, PointOptions } from "peaks.js";

export type SubdivisionValue = 1 | 2 | 4 | 8 | 16 | 32 | 64;

export interface SubdivisionPoint extends Point {
  subdivision: SubdivisionValue;
}

export interface SubdivisionPointOptions extends PointOptions {
  subdivision: SubdivisionValue;
}

export const SubdivisionPoints: Record<
  SubdivisionValue,
  Omit<PointOptions, "time">
> = {
  1: {
    color: "#fff",
  },
  2: {
    color: "#ccc",
  },
  4: {
    color: "#aaa",
  },
  8: {
    color: "#999",
  },
  16: {
    color: "#777",
  },
  32: {
    color: "#666",
  },
  64: {
    color: "#555 ",
  },
} as const;

export type Subdivision = keyof typeof SubdivisionPoints;

/**
 * Get the value of a subdivision.
 * @param subdivision is the subdivision to get the value of.
 * @returns the value of the subdivision.
 */
export const getSubdivisionValue = (
  subdivision: Subdivision
): SubdivisionValue => SubdivisionPoints[subdivision].value as SubdivisionValue;

/**
 * Determine if a subdivision is a subdivision of another.
 * @param a Subdivision to test
 * @param b subdivision to test against
 * @returns true if a is a subdivision of b, false otherwise
 */
export const isSubdivision = (a: Subdivision, b: Subdivision): boolean =>
  b % a == 0;
