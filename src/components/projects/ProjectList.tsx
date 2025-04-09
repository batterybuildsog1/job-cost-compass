
import { useState } from "react";
import { Project } from "@/hooks/use-projects";
import { FolderKanban } from "@/components/projects/icons";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectListItem } from "@/components/projects/ProjectListItem";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectListProps {
  projects: Project[];
  searchTerm: string;
  projectView: "grid" | "list";
  isLoading: boolean;
  deleteProject: (id: string) => Promise<void>;
  setAddProjectOpen: (open: boolean) => void;
}

export function ProjectList({ 
  projects, 
  searchTerm, 
  projectView, 
  isLoading, 
  deleteProject,
  setAddProjectOpen
}: ProjectListProps) {
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter projects based on search term
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.client?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  const handleDeleteProject = async (id: string) => {
    setIsDeleting(true);
    await deleteProject(id);
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

  if (filteredProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <FolderKanban className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No projects found</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          {searchTerm ? 
            `No projects match "${searchTerm}". Try a different search term.` : 
            "You haven't created any projects yet. Create your first project to get started."}
        </p>
        {!searchTerm && (
          <Button onClick={() => setAddProjectOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Your First Project
          </Button>
        )}
      </div>
    );
  }

  if (projectView === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onDelete={handleDeleteProject}
            isDeleting={isDeleting}
            projectToDelete={projectToDelete}
            setProjectToDelete={setProjectToDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 p-4 text-sm font-medium text-muted-foreground bg-muted">
        <div className="col-span-4">Project</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Start Date</div>
        <div className="col-span-2">Expenses</div>
        <div className="col-span-1">Mileage</div>
        <div className="col-span-1"></div>
      </div>
      {filteredProjects.map((project) => (
        <ProjectListItem 
          key={project.id} 
          project={project} 
          onDelete={deleteProject} 
        />
      ))}
    </div>
  );
}
