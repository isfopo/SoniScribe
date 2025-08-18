import { PeaksInstance } from "peaks.js";
import { useNewSegmentStore } from "../../stores/newSegment";
import { useCallback, useEffect } from "react";
import { nanoid } from "nanoid";
import { useTheme } from "../useTheme";
import { toast } from "sonner";

export const useSections = (
  peaksRef: React.RefObject<PeaksInstance | undefined>,
) => {
  const { start, end, clear } = useNewSegmentStore();
  const theme = useTheme();

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

        const name = prompt("Enter a name for the segment:", "Part A");

        if (!name) {
          alert("No name provided for the segment");
          return;
        }

        peaksRef.current.segments.add({
          id: nanoid(),
          editable: true,
          overlay: true,
          color: theme["chart-1"],
          labelText: name,
          ...span,
        });
      }
    },
    [peaksRef, theme],
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
    [peaksRef],
  );

  useEffect(() => {
    if (start && !end) {
      toast("Please select an end time for the segment");
    }
  }, [start, end]);

  useEffect(() => {
    if (start && end) {
      addSegment(start.time, end.time);
      toast("Segment added successfully");
      clear();
    }
  }, [start, end, clear, addSegment]);

  return {
    addSegment,
    removeSegment,
  };
};
