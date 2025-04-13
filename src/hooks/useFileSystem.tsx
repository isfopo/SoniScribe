import { useCallback, useEffect, useState } from "react";

export interface UseFileSystemOptions {
  onError?: (error: Error) => void;
}

export const useFileSystem = ({ onError }: UseFileSystemOptions) => {
  // const [root, setRoot] = useState<FileSystemDirectoryHandle | null>(null);
  const [entries, setEntries] = useState<FileSystemHandle[]>([]);

  const getEntries = useCallback(async () => {
    const root = await navigator.storage.getDirectory();
    const entries: FileSystemHandle[] = [];
    for await (const entry of root.values()) {
      entries.push(entry);
    }
    return entries;
  }, []);

  const write = useCallback(
    async (fileName: string, data: Blob) => {
      try {
        const root = await navigator.storage.getDirectory();
        const fileHandle = await root.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(data);
        await writable.close();
      } catch (error) {
        onError?.(error as Error);
      }
    },
    [onError]
  );

  const remove = useCallback(
    async (file: FileSystemHandle) => {
      const root = await navigator.storage.getDirectory();
      root.removeEntry(file.name, { recursive: true });
      setEntries(await getEntries());
    },
    [getEntries]
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
