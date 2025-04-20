import {
  DragEventHandler,
  FormEvent,
  FormEventHandler,
  MouseEventHandler,
  useCallback,
  useRef,
} from "react";
import styles from "./index.module.css";
import { Button } from "../Button";
import { displayBytes } from "../../helpers/files";

export interface FileDropAreaProps {
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
   * Maximum size of files that can be dropped in bytes.
   * If provided, the drop will be rejected if the file size exceeds this limit.
   */
  maxSize?: number;
  /**
   * Callback function called when files are dropped into the drop area.
   * @param files - Array of dropped files.
   */
  onDrop?: (files: File[]) => void;
  /**
   * Callback function called when a drag event occurs.
   * @param event - The drag event.
   */
  onDragOver?: DragEventHandler<HTMLDivElement>;
  /**
   * Callback function called when a drag event leaves the drop area.
   * @param event - The drag event.
   */
  onDragLeave?: DragEventHandler<HTMLDivElement>;
  /**
   * Callback function called when a drag event enters the drop area.
   * @param event - The drag event.
   */
  onDragEnter?: DragEventHandler<HTMLDivElement>;
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
  maxSize,
  onDropError,
}: FileDropAreaProps) => {
  const dropInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter: DragEventHandler<HTMLDivElement> = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      // Call the onDragEnter callback if provided
      if (onDragEnter) {
        onDragEnter(event);
      }
    },
    [onDragEnter]
  );

  const handleDragLeave: DragEventHandler<HTMLDivElement> = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      // Call the onDragLeave callback if provided
      if (onDragLeave) {
        onDragLeave(event);
      }
    },
    [onDragLeave]
  );

  const handleDragOver: DragEventHandler<HTMLDivElement> = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      // Call the onDragOver callback if provided
      if (onDragOver) {
        onDragOver(event);
      }
    },
    [onDragOver]
  );

  const handleDrop: DragEventHandler<HTMLDivElement> = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
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

      if (maxSize) {
        const files = Array.from(event.dataTransfer.files);
        const invalidFiles = files.filter((file) => file.size > maxSize);
        if (invalidFiles.length > 0) {
          errors.push(
            new Error(`File size exceeded. Maximum size: ${maxSize} bytes`)
          );
        }
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
    [allowedFileTypes, maxCount, maxSize, onDrop, onDropError]
  );

  const handleFileInputChange: FormEventHandler<HTMLDivElement> = useCallback(
    (event: FormEvent<HTMLDivElement>) => {
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

  const handleClick: MouseEventHandler<HTMLDivElement | HTMLButtonElement> =
    useCallback((event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      dropInputRef.current?.click();
    }, []);

  const fileText = maxCount === 1 ? "file" : "files";

  return (
    <div
      className={styles["drop-area"]}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onChange={handleFileInputChange}
    >
      <input
        id="file-drop-area"
        name="file-drop-area"
        type="file"
        ref={dropInputRef}
        className={styles["file-drop-input"]}
        accept={allowedFileTypes?.join(",")}
        aria-label="File Drop Area"
      />
      <div className={styles["drop-area-overlay"]}>
        <span className={styles["drop-area-text"]}>
          <p>
            Drag and drop {fileText} here or click to select {fileText}
          </p>
          <p>or</p>
        </span>
        <Button onClick={handleClick}>Click to select {fileText}</Button>

        {allowedFileTypes && (
          <p className={styles["allowed-file-types"]}>
            Allowed file types: <strong>{allowedFileTypes.join(", ")}</strong>
          </p>
        )}

        {maxCount && maxCount > 1 && (
          <p className={styles["max-file-count"]}>
            Maximum number of files: <strong>{maxCount}</strong>
          </p>
        )}

        {maxSize && (
          <p className={styles["max-file-size"]}>
            Maximum file size: <strong>{displayBytes(maxSize)}</strong>
          </p>
        )}
      </div>
    </div>
  );
};
