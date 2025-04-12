import { FileDropArea } from "../../FileDropArea";

export interface DragAndDropDialogProps {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  onDrop?: (files: File[]) => void;
  onDragOver?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
  onDragEnter?: (event: DragEvent) => void;
  allowedFileTypes?: string[];
  maxCount?: number;
  onDropError?: (errors: Error[]) => void;
}

export const DragAndDropDialog = ({
  dialogRef,
  onDrop,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDropError,
  allowedFileTypes,
  maxCount,
}: DragAndDropDialogProps) => {
  return (
    <dialog ref={dialogRef} className="file-drop-dialog">
      <FileDropArea
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDragEnter={onDragEnter}
        allowedFileTypes={allowedFileTypes}
        maxCount={maxCount}
        onDropError={onDropError}
      >
        <h2>Drop a song here</h2>
      </FileDropArea>
    </dialog>
  );
};
