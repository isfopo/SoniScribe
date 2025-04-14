export interface ProjectListProps {
  projects: FileSystemHandle[];
  open: (file: FileSystemHandle) => void;
  remove: (file: FileSystemHandle) => void;
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
