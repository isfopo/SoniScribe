import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";
import styles from "./index.module.css";

export interface ButtonProps
  extends Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    "className"
  > {}

export const Button = (props: ButtonProps) => {
  return <button className={styles["button"]} {...props}></button>;
};
