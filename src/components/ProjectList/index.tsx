import { FolderOpen, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";

export interface ProjectListProps {
  projects: FileSystemFileHandle[];
  /**
   * Adds a new project from the given file.
   */
  add: (files: File[]) => void;
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
    <div className="flex flex-col gap-2">
      <Dropzone accept={{ "audio/*": [] }} maxFiles={1} onDrop={add}>
        <DropzoneEmptyState /> <DropzoneContent />
      </Dropzone>

      <ul className="flex flex-col gap-2">
        {projects.map((project) => (
          <li key={project.name}>
            <Card className="flex-row justify-between items-center px-6">
              <CardHeader className="flex-grow">
                <CardTitle className="text-justify px-0">
                  {project.name}
                </CardTitle>
              </CardHeader>
              <div className="flex flex-row gap-1 text-left">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={() => open(project)}>
                      <FolderOpen />
                      <span className="sr-only">Open</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="px-2 py-1 text-xs">
                    Open
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={() => remove(project)}>
                      <Trash2 />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="px-2 py-1 text-xs">
                    Remove
                  </TooltipContent>
                </Tooltip>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};
