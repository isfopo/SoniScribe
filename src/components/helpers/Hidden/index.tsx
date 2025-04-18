import { PropsWithChildren } from "react";
import styles from "./index.module.css";

export interface HiddenProps extends PropsWithChildren {
  /**
   * If true, the children will be hidden.
   */
  when: boolean;
}

/**
 * A component that hides its children when the `when` prop is true.
 */
export const Hidden = ({ when, children }: HiddenProps) => {
  return <div className={`${when ? styles["hidden"] : ""}`}>{children}</div>;
};
