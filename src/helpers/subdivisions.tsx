import { Point, PointOptions } from "peaks.js";
import React from "react";
import WholeNoteIcon from "@/assets/icons/notes/whole.svg?react";
import HalfNoteIcon from "@/assets/icons/notes/half.svg?react";
import QuarterNoteIcon from "@/assets/icons/notes/quarter.svg?react";
import EighthNoteIcon from "@/assets/icons/notes/eighth.svg?react";
import SixteenthNoteIcon from "@/assets/icons/notes/sixteenth.svg?react";
import ThirtySecondNoteIcon from "@/assets/icons/notes/thirty-second.svg?react";
import SixtyFourthNoteIcon from "@/assets/icons/notes/sixty-fourth.svg?react";
import { getTheme } from "@/hooks/useTheme";

/**
 * Possible subdivisions.
 */
export type SubdivisionValue = 1 | 2 | 4 | 8 | 16 | 32 | 64;

/**
 * A point with a subdivision value.
 */
export interface SubdivisionPoint extends Point {
  subdivision: SubdivisionValue;
}

/**
 * Options for a subdivision point.
 */
export interface SubdivisionPointOptions extends PointOptions {
  subdivision: SubdivisionValue;
}

const theme = getTheme();

/**
 * A map of given subdivision values to a PointOptions object.
 */
export const SubdivisionPoints: Record<
  SubdivisionValue,
  Omit<PointOptions, "time">
> = {
  1: {
    color: theme["chart-1"],
  },
  2: {
    color: theme["chart-2"],
  },
  4: {
    color: theme["chart-3"],
  },
  8: {
    color: theme["chart-4"],
  },
  16: {
    color: theme["chart-5"],
  },
  32: {
    color: "#666",
  },
  64: {
    color: "#555 ",
  },
} as const;

/**
 * The keys of the SubdivisionPoints object.
 */
export type Subdivision = keyof typeof SubdivisionPoints;

export interface ISubdivisionMeta {
  label: string;
  icon: React.ReactElement;
}

export const SubdivisionMeta: Record<Subdivision, ISubdivisionMeta> = {
  1: {
    label: "Whole",
    icon: <WholeNoteIcon />,
  },
  2: {
    label: "Half",
    icon: <HalfNoteIcon />,
  },
  4: {
    label: "Quarter",
    icon: <QuarterNoteIcon />,
  },
  8: {
    label: "Eighth",
    icon: <EighthNoteIcon />,
  },
  16: {
    label: "Sixteenth",
    icon: <SixteenthNoteIcon />,
  },
  32: {
    label: "Thirty-second",
    icon: <ThirtySecondNoteIcon />,
  },
  64: {
    label: "Sixty-fourth",
    icon: <SixtyFourthNoteIcon />,
  },
} as const;

/**
 * Get the value of a subdivision.
 * @param subdivision is the subdivision to get the value of.
 * @returns the value of the subdivision.
 */
export const getSubdivisionValue = (
  subdivision: Subdivision,
): SubdivisionValue => SubdivisionPoints[subdivision].value as SubdivisionValue;

/**
 * Determine if a subdivision is a subdivision of another. Ex. 16 is a subdivision of 8.
 * @param a Subdivision to test
 * @param b subdivision to test against
 * @returns true if a is a subdivision of b, false otherwise
 */
export const isSubdivision = (a: Subdivision, b: Subdivision): boolean =>
  b % a == 0;
