import { useState, useEffect, useMemo } from "react";

export interface UseFileSystemOptions {
  dirName: string;
  onError?: (error: Error) => void;
}

export const useFileSystem = ({ dirName, onError }: UseFileSystemOptions) => {
  const [root, setRoot] = useState<FileSystemDirectoryHandle | null>(null);

  const entries = useMemo(() => {
    if (!root) return [];
  }, [root]);

  useEffect(() => {
    const init = async () => {
      try {
        const rootHandle = await navigator.storage.getDirectory();
        const root = await rootHandle.getDirectoryHandle(dirName, {
          create: true,
        });
        setRoot(root);
      } catch (error) {
        onError?.(error as Error);
      }
    };

    init();

    return () => {};
  }, [dirName, onError]);

  return { entries, root };
};
