import { useCallback, useState } from "react";

export interface AnchorPoint {
  x: number;
  y: number;
}

export const useContextMenu = () => {
  const [anchorPoint, setAnchorPoint] = useState<AnchorPoint>({ x: 0, y: 0 });
  const [isShown, setIsShow] = useState(false);

  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      setAnchorPoint({ x: event.pageX, y: event.pageY });
      setIsShow(true);
    },
    [setIsShow, setAnchorPoint]
  );

  const handleClick = useCallback(() => {
    if (isShown) {
      setIsShow(false);
    }
  }, [isShown]);

  const handleMouseLeave = useCallback(() => {
    if (isShown) {
      setIsShow(false);
    }
  }, [isShown]);

  return {
    anchorPoint,
    isShown,
    handleContextMenu,
    handleClick,
    handleMouseLeave,
  };
};
