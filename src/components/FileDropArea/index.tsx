import { useCallback, useEffect, useRef } from "react";
import styles from "./index.module.css";

export interface FileDropAreaProps {
  onDrop?: (files: File[]) => void;
  onDragOver?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
  onDragEnter?: (event: DragEvent) => void;
}

export const FileDropArea = ({
  onDrop,
  onDragEnter,
  onDragLeave,
  onDragOver,
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

      const files = Array.from(event.dataTransfer.files);
      if (files.length > 0) {
        // Handle the dropped files
        console.log("Dropped files:", files);
        // Call the onDrop callback if provided
        if (onDrop) {
          onDrop(files);
        }
      }
    },
    [onDrop]
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
      Drop a song here
    </div>
  );
};
