import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import styles from "./index.module.css";

export interface FileDropAreaProps extends PropsWithChildren {
  /**
   * Array of allowed file types for the drop area.
   * If provided, only files with these types will be accepted.
   */
  allowedFileTypes?: string[];
  /**
   * Maximum number of files that can be dropped.
   * If provided, the drop will be rejected if the number of files exceeds this limit.
   */
  maxCount?: number;
  /**
   * Callback function called when files are dropped into the drop area.
   * @param files - Array of dropped files.
   */
  onDrop?: (files: File[]) => void;
  /**
   * Callback function called when a drag event occurs.
   * @param event - The drag event.
   */
  onDragOver?: (event: DragEvent) => void;
  /**
   * Callback function called when a drag event leaves the drop area.
   * @param event - The drag event.
   */
  onDragLeave?: (event: DragEvent) => void;
  /**
   * Callback function called when a drag event enters the drop area.
   * @param event - The drag event.
   */
  onDragEnter?: (event: DragEvent) => void;
  /**
   * Callback function called when there are errors during the drop.
   * @param errors - Array of Error objects representing the errors.
   */
  onDropError?: (errors: Error[]) => void;
}

/**
 * FileDropArea component that renders a file input and handles drag-and-drop events.
 *
 */
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
  const dropInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileInputChange = useCallback(
    (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!dropInputRef.current?.files) return;

      const files = Array.from(dropInputRef.current.files);

      if (files.length > 0) {
        // Call the onDrop callback if provided
        if (onDrop) {
          onDrop(files);
        }
      }
    },
    [onDrop]
  );

  useEffect(() => {
    const dropArea = dropInputRef.current;
    if (dropArea) {
      dropArea.addEventListener("dragenter", handleDragEnter);
      dropArea.addEventListener("dragleave", handleDragLeave);
      dropArea.addEventListener("dragover", handleDragOver);
      dropArea.addEventListener("drop", handleDrop);
      dropArea.addEventListener("change", handleFileInputChange);
    }
    return () => {
      if (dropArea) {
        dropArea.removeEventListener("dragenter", handleDragEnter);
        dropArea.removeEventListener("dragleave", handleDragLeave);
        dropArea.removeEventListener("dragover", handleDragOver);
        dropArea.removeEventListener("drop", handleDrop);
        dropArea.removeEventListener("change", handleFileInputChange);
      }
    };
  }, [
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInputChange,
  ]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    dropInputRef.current?.click();
  }, []);

  return (
    <div className={styles["drop-area"]} onClick={handleClick}>
      <input
        id="file-drop-area"
        name="file-drop-area"
        type="file"
        ref={dropInputRef}
        className={styles["file-drop-input"]}
        accept={allowedFileTypes?.join(",")}
        aria-label="File Drop Area"
      />

      {children}
    </div>
  );
};
