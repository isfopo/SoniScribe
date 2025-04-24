import React from "react";
import { useDialogStore } from "../../../../stores/dialogs";

export const DialogManager = () => {
  const { activeDialogs } = useDialogStore();

  return (
    <>
      {activeDialogs.map(({ id, component }) => (
        <React.Fragment key={id}>{component}</React.Fragment>
      ))}
    </>
  );
};
