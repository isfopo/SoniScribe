import { useDialogStore } from "../../../../stores/dialogs";

export const DialogManager = () => {
  const { activeDialogs } = useDialogStore();

  return <>{activeDialogs.map((dialog) => dialog.component)}</>;
};
