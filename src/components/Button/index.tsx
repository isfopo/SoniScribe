import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";

export interface ButtonProps
  extends Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    "className"
  > {}

export const Button = (props: ButtonProps) => {
  return <button {...props}></button>;
};
