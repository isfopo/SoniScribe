import { HTMLAttributes } from "react";

export type OptionalProperties<T> = {
  [K in keyof T as T[K] extends undefined ? K : never]?: T[K];
};

export type ElementWithClassName<T extends HTMLElement> = Omit<
  HTMLAttributes<T>,
  "className"
>;
