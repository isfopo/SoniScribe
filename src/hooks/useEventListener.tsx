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
  /** The debounce time in milliseconds. */
  debounce?: number;
}

export const useEventListener = ({
  event,
  target = window,
  callback,
  options,
  debounce = 0,
}: UseEventListenerOptions) => {
  const targetRef = useRef<EventTarget | null>(target || window);
  const callbackRef = useRef<((event: Event) => void) | null>(callback);
  const optionsRef = useRef<AddEventListenerOptions | undefined>(options);
  const debounceTimeoutRef = useRef<number>(new Date().getTime());

  useEffect(() => {
    if (targetRef.current && callbackRef.current) {
      const eventTarget = targetRef.current;
      const _callback = callbackRef.current;
      const _options = optionsRef.current;

      const callbackHandler = (event: Event) => {
        if (
          callbackRef.current &&
          debounceTimeoutRef.current + debounce < new Date().getTime()
        ) {
          callbackRef.current(event);
          debounceTimeoutRef.current = new Date().getTime();
        }
      };

      eventTarget.addEventListener(event, callbackHandler, optionsRef.current);

      return () => {
        eventTarget.removeEventListener(event, _callback, _options);
      };
    }
  }, [debounce, event]);
};
