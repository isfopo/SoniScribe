import { SavedProjectData } from "../hooks/useProjects";

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

export const displayBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Converts a file handle to project data.
 * @param file The file handle to convert.
 * @returns A promise that resolves to a blob.
 */
export const getProjectDataFromCurrentProject = async (
  project: FileSystemFileHandle
): Promise<SavedProjectData> => {
  const file = await project.getFile();
  return JSON.parse(await file.text()) as SavedProjectData;
};
