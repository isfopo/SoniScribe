export const stripExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return filename; // No extension found
  }
  return filename.slice(0, lastDotIndex);
};
