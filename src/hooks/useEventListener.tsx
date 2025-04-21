import { useRef, useEffect } from "react";

export interface UseEventListenerOptions {
  /** The event to listen for. */
  event: string;
  /** The target to listen on. */
  target?: EventTarget | null;
  /** The callback function to call when the event is triggered. */
  callback: (event: Event) => void;
  /** The options for the event listener. */
  options?: AddEventListenerOptions;
}

export const useEventListener = ({
  event,
  target = window,
  callback,
  options,
}: UseEventListenerOptions) => {
  const targetRef = useRef<EventTarget | null>(target || window);
  const callbackRef = useRef<((event: Event) => void) | null>(callback);
  const optionsRef = useRef<AddEventListenerOptions | undefined>(options);

  useEffect(() => {
    if (targetRef.current && callbackRef.current) {
      const eventTarget = targetRef.current;
      const _callback = callbackRef.current;
      const _options = optionsRef.current;

      eventTarget.addEventListener(
        event,
        callbackRef.current,
        optionsRef.current
      );

      return () => {
        eventTarget.removeEventListener(event, _callback, _options);
      };
    }
  }, [event]);
};
