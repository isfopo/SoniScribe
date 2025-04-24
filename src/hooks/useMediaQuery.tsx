import { useCallback, useEffect, useState } from "react";
import { useEventListener } from "./useEventListener";

export interface Breakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
}

export interface UseMediaQueryOptions {
  breakpoints: Breakpoints;
}

export type Breakpoint = keyof Breakpoints;

const defaultBreakpoints: Breakpoints = {
  mobile: "600px",
  tablet: "1024px",
  desktop: "1440px",
};

export const useMediaQuery = (
  { breakpoints: { mobile, tablet } }: UseMediaQueryOptions = {
    breakpoints: defaultBreakpoints,
  }
) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>();

  const handleResize = useCallback(() => {
    if (window.innerWidth < parseInt(mobile)) {
      setCurrentBreakpoint("mobile");
    } else if (window.innerWidth < parseInt(tablet)) {
      setCurrentBreakpoint("tablet");
    } else {
      setCurrentBreakpoint("desktop");
    }
  }, [mobile, tablet]);

  useEventListener({
    event: "resize",
    callback: handleResize,
  });

  useEffect(() => {
    handleResize();
  }, [handleResize]);

  return { currentBreakpoint };
};
