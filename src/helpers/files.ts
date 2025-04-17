/**
 * Removes the file extension from a given filename.
 * This function is useful for displaying filenames without their extensions.
 * @param filename is the filename to strip the extension from.
 * @returns the filename without the extension.
 */
export const stripExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return filename; // No extension found
  }
  return filename.slice(0, lastDotIndex);
};
