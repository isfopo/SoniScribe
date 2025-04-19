/**
 * Stringifies an object, handling circular references by removing non-serializable members.
 * @param obj - The object to stringify.
 * @template T - The type of the object.
 * @returns The object as a JSON string.
 */
export const stringify = <T extends object>(obj: T) => {
  let cache: Array<unknown> | null = [];
  const str = JSON.stringify(obj, (_, value) => {
    if (cache === null) {
      return "";
    }

    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
};

export const isEmpty = <T extends object>(obj: T) => {
  return Object.keys(obj).length === 0;
};

export const isNullOrEmpty = <T extends object>(obj: T | null) => {
  return obj === null || isEmpty(obj);
};
