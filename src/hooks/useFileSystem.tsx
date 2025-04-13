import { useState, useEffect, useMemo } from "react";

export interface UseFileSystemOptions {
  dirName: string;
}

export const useFileSystem = ({ dirName }: UseFileSystemOptions) => {
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
        console.error("Error accessing file system:", error);
      }
    };

    init();

    return () => {};
  }, [dirName]);

  return { entries, root };
};
