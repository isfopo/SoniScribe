import { useCallback, useEffect } from "react";

export interface UseKeyPressOptions {
  /**
   * A mapping of key codes to functions that should be called when the corresponding key is pressed.
   * The key codes are the values of the KeyboardEvent.code property.
   */
  keymap: Record<string, () => void>;
}

/**
 * Custom hook to handle key press events.
 * It listens for keydown events and triggers the corresponding function from the keymap.
 */
export const useKeyPress = ({ keymap }: UseKeyPressOptions) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const key = event.code;
      if (keymap[key]) {
        event.preventDefault();
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
