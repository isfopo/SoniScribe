import { useCallback, useEffect } from "react";

export interface UseKeyPressOptions {
  keymap: Record<string, () => void>;
}

export const useKeyPress = ({ keymap }: UseKeyPressOptions) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const key = event.code;
      if (keymap[key]) {
        keymap[key]();
      }
    },
    [keymap]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
};
