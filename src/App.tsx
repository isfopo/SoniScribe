import { ContextMenu } from "./components/ContextMenu";
import { DialogManager } from "./components/Dialogs/Dialog/DialogManager";
import { useTheme } from "./theme/useTheme";
import { ProjectView } from "./views/ProjectView";

export const App = (): React.ReactElement => {
  useTheme();

  return (
    <>
      <DialogManager />
      <ContextMenu />
      <ProjectView />
    </>
  );
};
