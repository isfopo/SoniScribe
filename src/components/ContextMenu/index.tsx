import { AnchorPoint } from "../../hooks/useContextMenu";

import styles from "./index.module.css";

export interface ContextMenuItem<T> {
  label: string;
  key: string;
  action: () => void;
}

export interface ContextMenuProps<T> {
  items: Array<ContextMenuItem<T>>;
  anchorPoint: AnchorPoint;
  isShown: boolean;
}

export const ContextMenu = <T,>({
  items,
  anchorPoint,
  isShown,
}: ContextMenuProps<T>) => {
  if (!isShown) {
    return null;
  }

  return (
    <ul
      className={styles["context-menu"]}
      onContextMenu={(e) => e.preventDefault()}
      style={{ top: anchorPoint.y, left: anchorPoint.x }}
    >
      {items.map(({ label, action, key }) => (
        <li key={key} onClick={action}>
          {label}
        </li>
      ))}
    </ul>
  );
};
