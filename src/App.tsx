import "./App.css";
import { useTheme } from "./theme/useTheme";
import { ProjectView } from "./views/ProjectView";

export const App = (): React.ReactElement => {
  useTheme();

  return <ProjectView />;
};
