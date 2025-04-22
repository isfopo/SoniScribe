import React, { useEffect } from "react";
import { XIcon } from "lucide-react";
import styles from "./index.module.css";
import { useDialogStore } from "../../../stores/dialogs";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

export interface DialogProps
  extends Omit<React.HTMLProps<HTMLDialogElement>, "className"> {
  /**
   * header of the dialog.
   */
  header?: string;
  /**
   * Callback function to be called when the dialog is closed.
   */
  onClose?: () => void;
  /**
   * Callback function to be called when the dialog is opened.
   */
  onOpen?: () => void;
}

export const Dialog = ({
  children,
  header = "",
  onClose,
  onOpen,
  ...props
}: DialogProps) => {
  const { closeDialog } = useDialogStore();
  const { currentBreakpoint } = useMediaQuery();

  const dialogRef = React.useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
      if (onOpen) onOpen();
    }
  }, [onOpen]);

  useEffect(() => {
    if (dialogRef.current) {
      const handleClose = () => {
        // Wait for the dialog to close before calling closeDialog
        setTimeout(() => {
          if (onClose) onClose();
          closeDialog();
        }, 500);
      };

      dialogRef.current.addEventListener("close", handleClose);
    }
  }, [onClose, closeDialog]);

  return (
    <dialog
      {...props}
      ref={dialogRef}
      className={styles["dialog"]}
      onClick={() => dialogRef.current?.close()}
    >
      <header>
        {currentBreakpoint === "mobile" ? (
          <hr />
        ) : (
          <>
            <h2>{header}</h2>
            <button
              type="button"
              aria-label="Close"
              title="Close"
              tabIndex={0}
              className={styles["close-button"]}
              onClick={() => {
                if (onClose) onClose();
                dialogRef.current?.close();
              }}
            >
              {/* Close button shown on desktop*/}
              <XIcon />
            </button>
          </>
        )}
      </header>
      {children}
    </dialog>
  );
};
