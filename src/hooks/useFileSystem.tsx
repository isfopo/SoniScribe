import { useCallback } from "react";

export interface UseFileSystemOptions {
  dirName: string;
  onError?: (error: Error) => void;
}

export const useFileSystem = ({ dirName, onError }: UseFileSystemOptions) => {
  // const [root, setRoot] = useState<FileSystemDirectoryHandle | null>(null);

  const save = useCallback(
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

  return { save };
};
