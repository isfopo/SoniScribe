import { useCallback } from "react";
import {
  ContextMenuAction,
  useContextMenuStore,
} from "../../stores/contextMenu";

import styles from "./index.module.css";

export const ContextMenu = () => {
  const {
    anchorPoint,
    isShown,
    items,
    closeContextMenu,
    initialEvent,
    initialObject,
  } = useContextMenuStore();

  const handleSelection = useCallback(
    (action: ContextMenuAction<unknown>) => {
      if (!initialEvent || !initialObject) {
        return;
      }

      action({
        event: initialEvent,
        object: initialObject,
      });

      closeContextMenu();
    },
    [closeContextMenu, initialEvent, initialObject]
  );

  if (!isShown) {
    return null;
  }

  return (
    <div>
      <ul
        className={styles["context-menu"]}
        onMouseLeave={closeContextMenu}
        style={{ top: anchorPoint.y, left: anchorPoint.x }}
      >
        {items.map(({ label, action, key }) => (
          <li key={key} onClick={() => handleSelection(action)}>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};
