import { useCallback } from "react";
import {
  ContextMenuAction,
  useContextMenuStore,
} from "../../stores/contextMenu";

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
    [closeContextMenu, initialEvent, initialObject],
  );

  if (!isShown) {
    return null;
  }

  return (
    <div
      className="absolute z-50 bg-card border-border border-1 p-1 rounded-md"
      onMouseLeave={closeContextMenu}
      style={{ top: anchorPoint.y, left: anchorPoint.x }}
    >
      <ul>
        {items.map(({ label, action, key }) => (
          <li
            className="hover:bg-accent text-sm rounded-md px-6 py-1 text-left cursor-pointer"
            key={key}
            onClick={() => handleSelection(action)}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};
