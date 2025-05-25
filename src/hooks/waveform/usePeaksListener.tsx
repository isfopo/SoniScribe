import { PeaksEvents, PeaksInstance } from "peaks.js";
import { useEffect } from "react";

export interface UsePeaksListenerOptions<E extends keyof PeaksEvents> {
  /**
   * The event to listen to.
   */
  event: E;
  /**
   * The callback to call when the event is triggered.
   */
  on: PeaksEvents[E];
}

/**
 * usePeaksListener is a custom hook that adds an event listener to a Peaks instance.
 * @param peaksRef - A ref to the Peaks instance.
 * @param options - Options for the event listener.
 * @returns void
 */
export const usePeaksListener = <E extends keyof PeaksEvents>(
  peaksRef: React.RefObject<PeaksInstance | undefined>,
  { on, event }: UsePeaksListenerOptions<E>
) => {
  useEffect(() => {
    const peaks = peaksRef.current;
    if (!peaks) return;

    // Add the event listener
    peaks.on(event, on as PeaksEvents[E]);

    // Cleanup function to remove the event listener
    return () => {
      peaks.off(event, on as PeaksEvents[E]);
    };
  }, [peaksRef, event, on]);
};
