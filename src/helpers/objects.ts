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
