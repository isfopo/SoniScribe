import { useCallback, useEffect, useState } from "react";

export interface UseFileSystemOptions {
  /** Callback function to handle errors during file system operations. */
  onError?: (error: Error) => void;
}

/**
 * Custom hook to manage file system operations.
 * It provides functions to write, remove, and list files in the file system.
 * It also provides a way to handle errors during file system operations.
 */
export const useFileSystem = ({ onError }: UseFileSystemOptions) => {
  const [entries, setEntries] = useState<FileSystemHandle[]>([]);

  /**
   * Retrieves the entries in the file system.
   * @returns A promise that resolves to an array of FileSystemHandle objects.
   */
  const getEntries = useCallback(async (): Promise<FileSystemHandle[]> => {
    const root = await navigator.storage.getDirectory();
    const entries: FileSystemHandle[] = [];
    // @ts-expect-error .value() method is not available in the type definition
    for await (const entry of root.values()) {
      entries.push(entry);
    }
    return entries;
  }, []);

  /**
   * Writes a file to the file system.
   * @param fileName The name of the file to write.
   * @param data The data to write to the file.
   * @returns A promise that resolves to the FileSystemFileHandle if successful.
   */
  const write = useCallback(
    async (
      fileName: string,
      data: Blob
    ): Promise<FileSystemFileHandle | undefined> => {
      try {
        const root = await navigator.storage.getDirectory();
        const fileHandle = await root.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(data);
        await writable.close();
        return fileHandle;
      } catch (error) {
        onError?.(error as Error);
      } finally {
        setEntries(await getEntries());
      }
    },
    [getEntries, onError]
  );

  /**
   * Removes a file from the file system.
   * @param file The file to remove.
   * @returns A promise that resolves when the file is removed.
   */
  const remove = useCallback(
    async (file: FileSystemHandle): Promise<void> => {
      try {
        const root = await navigator.storage.getDirectory();
        root.removeEntry(file.name, { recursive: true });
      } catch (error) {
        onError?.(error as Error);
      } finally {
        setEntries(await getEntries());
      }
    },
    [getEntries, onError]
  );

  useEffect(() => {
    const handleError = (error: Error) => {
      console.error("Error accessing file system:", error);
      onError?.(error);
    };
    const handleStorageChange = async () => {
      try {
        const root = await navigator.storage.getDirectory();
        if (!root) {
          throw new Error("No root directory found");
        }
        // Handle storage change logic here
        setEntries(await getEntries());
      } catch (error) {
        handleError(error as Error);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [getEntries, onError]);

  useEffect(() => {
    const _getEntries = async () => {
      try {
        setEntries(await getEntries());
      } catch (error) {
        onError?.(error as Error);
      }
    };
    _getEntries();
  }, [getEntries, onError]);

  return { write, entries, remove };
};
