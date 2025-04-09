
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectToolbar } from "@/components/projects/ProjectToolbar";
import { Plus } from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { Project } from "@/hooks/use-projects";
import { useToast } from "@/hooks/use-toast";

export default function Projects() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const { projects, isLoading, createProject, updateProject, deleteProject } = useProjects();
  const { toast } = useToast();
  
  const handleCreateProject = async (data: Omit<Project, "id" | "created_at" | "updated_at">) => {
    try {
      await createProject(data);
      setIsAddOpen(false);
      toast({
        title: "Project created",
        description: "Your project has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateProject = async (project: Project) => {
    try {
      await updateProject(project.id, project);
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteProject = async (id: string): Promise<void> => {
    try {
      const success = await deleteProject(id);
      
      if (success) {
        toast({
          title: "Project deleted",
          description: "Your project has been deleted successfully.",
        });
      } else {
        throw new Error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 container py-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            <h1 className="text-3xl font-bold">Projects</h1>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Project
              </Button>
              <DialogContent className="sm:max-w-[550px]">
                <ProjectForm 
                  title="Create New Project" 
                  description="Add a new project to your dashboard."
                  onSubmit={handleCreateProject}
                  submitLabel="Create Project"
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <ProjectToolbar 
            filter={filter} 
            setFilter={setFilter}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          
          <ProjectList 
            projects={projects}
            isLoading={isLoading}
            filter={filter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onEdit={handleUpdateProject}
            onDelete={handleDeleteProject}
            onAdd={() => setIsAddOpen(true)}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
