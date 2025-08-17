import { ContextMenu } from "./components/ContextMenu";
import { ProjectView } from "./views/ProjectView";

export const App = (): React.ReactElement => {
  return (
    <>
      <ContextMenu />
      <ProjectView />
    </>
  );
};
