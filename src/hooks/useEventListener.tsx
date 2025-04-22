import { useRef, useEffect } from "react";

export interface UseEventListenerOptions<T extends Event> {
  /** The event to listen for. */
  event: string;
  /** The target to listen on. */
  target?: EventTarget | null;
  /** The callback function to call when the event is triggered. */
  callback: (event: T) => void;
  /** The options for the event listener. */
  options?: AddEventListenerOptions;
  /** The debounce time in milliseconds. */
  debounce?: number;
}

export const useEventListener = <T extends Event>({
  event,
  target = window,
  callback,
  options,
  debounce = 0,
}: UseEventListenerOptions<T>) => {
  const targetRef = useRef<EventTarget | null>(target || window);
  const callbackRef = useRef<((event: T) => void) | null>(callback);
  const optionsRef = useRef<AddEventListenerOptions | undefined>(options);
  const debounceTimeoutRef = useRef<number>(new Date().getTime());

  useEffect(() => {
    if (targetRef.current && callbackRef.current) {
      const eventTarget = targetRef.current;
      const _options = optionsRef.current;

      const callbackHandler = (event: T) => {
        if (
          callbackRef.current &&
          debounceTimeoutRef.current + debounce < new Date().getTime()
        ) {
          callbackRef.current(event);
          debounceTimeoutRef.current = new Date().getTime();
        }
      };

      eventTarget.addEventListener(
        event,
        callbackHandler as EventListenerOrEventListenerObject,
        optionsRef.current
      );

      return () => {
        eventTarget.removeEventListener(
          event,
          callbackHandler as EventListenerOrEventListenerObject,
          _options
        );
      };
    }
  }, [debounce, event]);
};
