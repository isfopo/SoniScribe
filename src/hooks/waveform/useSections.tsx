import { PeaksInstance } from "peaks.js";
import { useNewSegmentStore } from "../../stores/newSegment";
import { useCallback, useEffect } from "react";
import { useTheme } from "../../theme/useTheme";

export const useSections = (
  peaksRef: React.RefObject<PeaksInstance | undefined>
) => {
  const { start, end, clear } = useNewSegmentStore();
  const {
    scheme: { primary, secondary, tertiary },
  } = useTheme();

  /**
   * Adds a segment to the Peaks instance.
   * @param start Start time of the segment
   * @param end End time of the segment
   * @returns void
   */
  const addSegment = useCallback(
    (start: number, end: number) => {
      if (peaksRef.current) {
        let span = { startTime: start, endTime: end };
        if (start > end) {
          span = { startTime: end, endTime: start };
        }

        const name = prompt("Enter a name for the segment:", "Aart A");

        if (!name) {
          alert("No name provided for the segment");
          return;
        }

        peaksRef.current.segments.add({
          id: name + start.toString() + end.toString(),
          editable: true,

          labelText: name,
          ...span,
        });
      }
    },
    [peaksRef]
  );

  /**
   * Removes a segment from the Peaks instance.
   * @param segmentId ID of the segment to remove
   * @returns void
   */
  const removeSegment = useCallback(
    (segmentId: string) => {
      if (peaksRef.current) {
        peaksRef.current.segments.removeById(segmentId);
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
    removeSegment,
  };
};
