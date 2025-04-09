
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { FolderKanban } from "./icons";
import { Project } from "@/hooks/use-projects";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProjectForm, ProjectFormData } from "./ProjectForm";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isDeleting?: boolean;
  projectToDelete?: string | null;
  setProjectToDelete?: (id: string | null) => void;
}

export function ProjectCard({ 
  project, 
  onEdit, 
  onDelete, 
  isDeleting = false, 
  projectToDelete = null, 
  setProjectToDelete = () => {}
}: ProjectCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const getStatusIcon = () => {
    switch (project.status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'at risk':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-slate-500" />;
    }
  };

  const handleDelete = async () => {
    setProjectToDelete(project.id);
    try {
      await onDelete(project.id);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
    setIsDeleteOpen(false);
  };

  const handleSubmit = async (values: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      await onEdit({
        ...project,
        ...values
      });
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-primary/10 p-2 h-8 w-8 flex items-center justify-center">
            <FolderKanban className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-center gap-1 text-xs font-medium">
            {getStatusIcon()}
            <span>{project.status}</span>
          </div>
        </div>
        <CardTitle className="mt-2 text-xl">{project.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {project.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Client:</span>
            <span className="font-medium">{project.client || "Not specified"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Start Date:</span>
            <span className="font-medium">{new Date(project.start_date).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t flex justify-between">
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
          <DialogContent className="sm:max-w-[550px]">
            <ProjectForm 
              title="Edit Project" 
              description="Update your project details." 
              defaultValues={project}
              onSubmit={handleSubmit}
              submitLabel="Save Changes"
            />
          </DialogContent>
        </Dialog>
        
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive border-destructive/50 hover:bg-destructive/10">
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the project "{project.name}" and all associated data.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                disabled={isDeleting && projectToDelete === project.id}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting && projectToDelete === project.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Project"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
