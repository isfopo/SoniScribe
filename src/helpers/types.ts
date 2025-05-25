export type OptionalProperties<T> = {
  [K in keyof T as T[K] extends undefined ? K : never]?: T[K];
};
