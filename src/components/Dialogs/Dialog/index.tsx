import React, { useEffect } from "react";
import { XIcon } from "lucide-react";
import styles from "./index.module.css";

export interface DialogProps
  extends Omit<React.HTMLProps<HTMLDialogElement>, "className"> {
  /**
   * Callback function to be called when the dialog is closed.
   */
  onClose?: () => void;
  /**
   * Callback function to be called when the dialog is opened.
   */
  onOpen?: () => void;
  /**
   * Callback function to be called when the dialog is cancelled.
   */
  onCancel?: () => void;
}

export const Dialog = ({ children, onClose, ...props }: DialogProps) => {
  const dialogRef = React.useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, []);

  return (
    <dialog ref={dialogRef} className={styles["dialog"]} {...props}>
      <header>
        <button
          type="button"
          aria-label="Close"
          title="Close"
          tabIndex={0}
          className={styles["close-button"]}
          onClick={() => {
            if (onClose) onClose();
            if (dialogRef.current) dialogRef.current.close();
          }}
        >
          {/* Close button shown on desktop*/}
          <XIcon />
        </button>
        <h2 className={styles["dialog-title"]}>{props.title}</h2>
        <hr /> {/* hr shown on mobile */}
      </header>
      {children}
    </dialog>
  );
};
