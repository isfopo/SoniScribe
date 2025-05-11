import { PeaksInstance } from "peaks.js";
import { useNewSegmentStore } from "../../stores/newSegment";
import { useCallback, useEffect } from "react";

export const useSections = (
  peaksRef: React.RefObject<PeaksInstance | undefined>
) => {
  const { start, end, clear } = useNewSegmentStore();

  /**
   * Adds a segment to the Peaks instance.
   * @param start Start time of the segment
   * @param end End time of the segment
   * @returns void
   */
  const addSegment = useCallback(
    (start: number, end: number) => {
      if (peaksRef.current) {
        peaksRef.current.segments.add({
          startTime: start,
          endTime: end,
          editable: true,
          labelText: "part A",
        });
      }
    },
    [peaksRef]
  );

  useEffect(() => {
    if (start && end) {
      addSegment(start.time, end.time);
      clear();
    }
  }, [start, end, clear, addSegment]);

  return {
    addSegment,
  };
};
