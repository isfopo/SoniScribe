import { Point, PointOptions } from "peaks.js";
import { SubdivisionValue } from "./subdivisions";

/**
 * Maps a Point to a PointOptions object. Removes the update property from the Point, which is non-serializable.
 * @param point The Point to map.
 * @returns The PointOptions object.
 */
export const mapPointToPointOptions = (point: Point): PointOptions => ({
  time: point._time as number,
  color: point._color as string,
  label: point._label as string,
  subdivision: point.subdivision as SubdivisionValue,
  editable: point._editable as boolean,
  id: point._id as string,
});
