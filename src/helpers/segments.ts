import { Segment, SegmentOptions } from "peaks.js";

/**
 * Maps a Segment to a SegmentOptions object. Removes the update property from the Segment, which is non-serializable.
 * @param segment The Segment to map.
 * @returns The SegmentOptions object.
 */
export const mapSegmentToSegmentOptions = (
  segment: Segment
): SegmentOptions => ({
  startTime: segment._startTime as number,
  endTime: segment._endTime as number,
  id: segment._id as string,
  color: segment._color as string,
  labelText: segment._labelText as string,
  editable: segment._editable as boolean,
});
