
import { useState } from "react";
import { Project } from "@/hooks/use-projects";
import { FolderKanban } from "@/components/projects/icons";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectListItem } from "@/components/projects/ProjectListItem";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectListProps {
  projects: Project[];
  filter: string;
  sortBy: "name" | "date";
  sortOrder: "asc" | "desc";
  isLoading: boolean;
  onEdit: (project: Project) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAdd: () => void;
}

export function ProjectList({ 
  projects, 
  filter, 
  sortBy, 
  sortOrder, 
  isLoading, 
  onEdit,
  onDelete,
  onAdd
}: ProjectListProps) {
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter projects based on search term
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(filter.toLowerCase()) ||
    (project.client?.toLowerCase().includes(filter.toLowerCase()) || false)
  );

  // Sort the projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "name") {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? comparison : -comparison;
    } else {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
  });

  const handleDeleteProject = async (id: string) => {
    setIsDeleting(true);
    setProjectToDelete(id);
    try {
      await onDelete(id);
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
    setProjectToDelete(null);
    setIsDeleting(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  if (sortedProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <FolderKanban className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No projects found</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          {filter ? 
            `No projects match "${filter}". Try a different search term.` : 
            "You haven't created any projects yet. Create your first project to get started."}
        </p>
        {!filter && (
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Your First Project
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedProjects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          onEdit={onEdit}
          onDelete={handleDeleteProject}
          isDeleting={isDeleting}
          projectToDelete={projectToDelete}
          setProjectToDelete={setProjectToDelete}
        />
      ))}
    </div>
  );
}
