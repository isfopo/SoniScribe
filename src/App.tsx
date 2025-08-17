import { ContextMenu } from "./components/ContextMenu";
import { DialogManager } from "./components/Dialogs/Dialog/DialogManager";
import { ProjectView } from "./views/ProjectView";

export const App = (): React.ReactElement => {
	return (
		<>
			<DialogManager />
			<ContextMenu />
			<ProjectView />
		</>
	);
};
