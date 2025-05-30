import { ElementWithClassName } from "../../helpers/types";
import styles from "./index.module.css";

export interface ButtonGroupProps
  extends ElementWithClassName<HTMLDivElement> {}

export const ButtonGroup = (props: ButtonGroupProps) => {
  return <div className={styles["button-group"]} {...props}></div>;
};
