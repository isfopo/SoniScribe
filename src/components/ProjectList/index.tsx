import { Button } from "../Button";
import { BarContainer } from "../Container/BarContainer";
import { FolderOpen, Trash2, Plus } from "lucide-react";
import styles from "./index.module.css";
import { ButtonGroup } from "../ButtonGroup";

export interface ProjectListProps {
  projects: FileSystemFileHandle[];
  /**
   * Opens dialog to create a new project.
   */
  add: () => void;
  /**
   * Opens the project file.
   * @param file The file to open.
   */
  open: (file: FileSystemFileHandle) => void;
  /**
   * Removes the project file.
   * @param file The file to remove.
   */
  remove: (file: FileSystemFileHandle) => void;
}

export const ProjectList = ({
  projects,
  add,
  open,
  remove,
}: ProjectListProps) => {
  return (
    <div className={styles["project-list"]}>
      <Button onClick={add}>
        <Plus />
      </Button>
      <ul>
        {projects.map((project) => (
          <li key={project.name}>
            <BarContainer>
              <div>
                <h3>{project.name}</h3>
              </div>
              <ButtonGroup>
                <Button onClick={() => open(project)}>
                  <FolderOpen />
                </Button>
                <Button onClick={() => remove(project)}>
                  <Trash2 />
                </Button>
              </ButtonGroup>
            </BarContainer>
          </li>
        ))}
      </ul>
    </div>
  );
};
