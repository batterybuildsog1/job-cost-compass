
import { useState } from "react";
import { Plus } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useProjects } from "@/hooks/use-projects";
import { useAuth } from "@/contexts/AuthContext";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectToolbar } from "@/components/projects/ProjectToolbar";
import { ProjectForm, ProjectFormData } from "@/components/projects/ProjectForm";

export default function Projects() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [projectView, setProjectView] = useState<"grid" | "list">("grid");
  
  const { 
    projects, 
    isLoading, 
    error, 
    createProject, 
    deleteProject 
  } = useProjects();
  
  const handleSubmit = async (data: ProjectFormData) => {
    await createProject(data);
    setAddProjectOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-1 container py-10">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Projects</h1>
            <Dialog open={addProjectOpen} onOpenChange={setAddProjectOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                  <DialogDescription>
                    Create a new project to track expenses and mileage.
                  </DialogDescription>
                </DialogHeader>
                <ProjectForm onSubmit={handleSubmit} />
              </DialogContent>
            </Dialog>
          </div>

          <ProjectToolbar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            projectView={projectView}
            setProjectView={setProjectView}
          />

          <ProjectList 
            projects={projects}
            searchTerm={searchTerm}
            projectView={projectView}
            isLoading={isLoading}
            deleteProject={deleteProject}
            setAddProjectOpen={setAddProjectOpen}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
