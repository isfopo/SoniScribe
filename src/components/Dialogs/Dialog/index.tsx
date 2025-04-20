import styles from "./index.module.css";

export interface DialogProps extends React.HTMLProps<HTMLDialogElement> {
  /**
   * Ref to the dialog element.
   * This is used to control the dialog element (open, close, etc.).
   */
  dialogRef: React.RefObject<HTMLDialogElement | null>;
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

export const Dialog = (
  props: Omit<React.HTMLProps<HTMLDialogElement>, "className">
) => {
  return <dialog className={styles["dialog"]} {...props}></dialog>;
};
