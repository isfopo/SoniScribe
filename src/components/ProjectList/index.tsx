export interface ProjectListProps {
  projects: FileSystemFileHandle[];
  open: (file: FileSystemFileHandle) => void;
  remove: (file: FileSystemFileHandle) => void;
}

export const ProjectList = ({ projects, open, remove }: ProjectListProps) => {
  return (
    <>
      {projects.map((project) => (
        <div key={project.name}>
          <span>{project.name}</span>
          <button onClick={() => open(project)}>Open</button>
          <button onClick={() => remove(project)}>Remove</button>
        </div>
      ))}
    </>
  );
};
