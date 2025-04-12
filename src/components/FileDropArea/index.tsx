import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import styles from "./index.module.css";

export interface FileDropAreaProps extends PropsWithChildren {
  onDrop?: (files: File[]) => void;
  onDragOver?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
  onDragEnter?: (event: DragEvent) => void;
  allowedFileTypes?: string[];
  maxCount?: number;
  onDropError?: (errors: Error[]) => void;
}

export const FileDropArea = ({
  onDrop,
  onDragEnter,
  onDragLeave,
  onDragOver,
  allowedFileTypes,
  maxCount,
  onDropError,
  children,
}: FileDropAreaProps) => {
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const handleDragEnter = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      // Call the onDragEnter callback if provided
      if (onDragEnter) {
        onDragEnter(event);
      }
    },
    [onDragEnter]
  );

  const handleDragLeave = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      // Call the onDragLeave callback if provided
      if (onDragLeave) {
        onDragLeave(event);
      }
    },
    [onDragLeave]
  );

  const handleDragOver = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      // Call the onDragOver callback if provided
      if (onDragOver) {
        onDragOver(event);
      }
    },
    [onDragOver]
  );

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (!event.dataTransfer) return;

      const errors: Error[] = [];

      if (event.dataTransfer.items.length === 0) {
        errors.push(new Error("No files dropped"));
      }

      if (maxCount && event.dataTransfer.files.length > maxCount) {
        errors.push(
          new Error(`Maximum file count exceeded. Limit: ${maxCount}`)
        );
      }

      if (allowedFileTypes) {
        const files = Array.from(event.dataTransfer.files);
        const validFiles = files.filter((file) =>
          allowedFileTypes.includes(file.type)
        );
        if (validFiles.length === 0) {
          errors.push(
            new Error(
              `No valid file types dropped. Allowed: ${allowedFileTypes.join(
                ", "
              )}`
            )
          );
        }
      }

      if (errors.length > 0) {
        // Call the onDropError callback if provided
        if (onDropError) {
          onDropError(errors);
        }
        return;
      }

      const files = Array.from(event.dataTransfer.files || []);
      if (files.length > 0) {
        // Call the onDrop callback if provided
        if (onDrop) {
          onDrop(files);
        }
      }
    },
    [allowedFileTypes, maxCount, onDrop, onDropError]
  );

  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (dropArea) {
      dropArea.addEventListener("dragenter", handleDragEnter);
      dropArea.addEventListener("dragleave", handleDragLeave);
      dropArea.addEventListener("dragover", handleDragOver);
      dropArea.addEventListener("drop", handleDrop);
    }
    return () => {
      if (dropArea) {
        dropArea.removeEventListener("dragenter", handleDragEnter);
        dropArea.removeEventListener("dragleave", handleDragLeave);
        dropArea.removeEventListener("dragover", handleDragOver);
        dropArea.removeEventListener("drop", handleDrop);
      }
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  return (
    <div ref={dropAreaRef} className={styles["drop-area"]}>
      {children}
    </div>
  );
};
