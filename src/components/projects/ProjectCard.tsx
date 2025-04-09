
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MoreHorizontal, FolderOpen } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Project } from "@/hooks/use-projects";
import { ProjectForm, ProjectFormData } from "@/components/projects/ProjectForm";
import { ProjectDetail } from "@/components/projects/ProjectDetail";

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
  setProjectToDelete
}: ProjectCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const handleEdit = async (values: ProjectFormData) => {
    await onEdit({
      ...project,
      name: values.name,
      client: values.client || null,
      status: values.status || "Pending",
      description: values.description || null
    });
    setIsEditDialogOpen(false);
  };
  
  const handleDelete = async () => {
    if (setProjectToDelete) {
      setProjectToDelete(project.id);
    }
    
    await onDelete(project.id);
    
    if (setProjectToDelete) {
      setProjectToDelete(null);
    }
    
    setIsDeleteAlertOpen(false);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const isCurrentProjectDeleting = isDeleting && projectToDelete === project.id;

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold truncate">{project.name}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsDetailOpen(true)}>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteAlertOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-3">
            {project.client && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Client:</span>
                <span className="text-sm font-medium">{project.client}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className="text-sm font-medium">{project.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Created:</span>
              <span className="text-sm font-medium">{formatDate(project.created_at)}</span>
            </div>
            {project.description && (
              <div>
                <span className="text-sm text-muted-foreground">Description:</span>
                <p className="text-sm mt-1 line-clamp-2">{project.description}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => setIsDetailOpen(true)}
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            View Project Details
          </Button>
        </CardFooter>
      </Card>
      
      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogTitle>Edit Project</DialogTitle>
          <ProjectForm
            defaultValues={{
              name: project.name,
              client: project.client || undefined,
              status: project.status,
              description: project.description || undefined
            }}
            onSubmit={handleEdit}
            onCancel={() => setIsEditDialogOpen(false)}
            submitLabel="Save Changes"
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Project Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project "{project.name}" and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isCurrentProjectDeleting}
            >
              {isCurrentProjectDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Project Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <ProjectDetail 
            project={project} 
            onClose={() => setIsDetailOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
