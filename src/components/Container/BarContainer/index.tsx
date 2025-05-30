import { ReactNode } from "react";
import { ElementWithClassName } from "../../../helpers/types";
import styles from "./index.module.css";

export interface BarContainerProps
  extends ElementWithClassName<HTMLDivElement> {}

export const BarContainer = ({ children, ...props }: BarContainerProps) => {
  return (
    <div className={styles["container"]} {...props}>
      {children as ReactNode}
    </div>
  );
};
