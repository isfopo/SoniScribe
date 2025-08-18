import { ContextMenu } from "./components/ContextMenu";
import { Toaster } from "./components/ui/sonner";
import { ProjectView } from "./views/ProjectView";

export const App = (): React.ReactElement => {
  return (
    <>
      <ContextMenu />
      <ProjectView />
      <Toaster />
    </>
  );
};
