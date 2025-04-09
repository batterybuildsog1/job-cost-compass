
import { Project } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Clipboard, Car, Receipt, Edit, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ProjectListItemProps {
  project: Project;
  onDelete: (id: string) => Promise<void>;
}

export function ProjectListItem({ project, onDelete }: ProjectListItemProps) {
  return (
    <div className="grid grid-cols-12 items-center p-4 border-t">
      <div className="col-span-4">
        <div className="font-medium">{project.name}</div>
        <div className="text-sm text-muted-foreground">{project.client}</div>
      </div>
      <div className="col-span-2">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          project.status === "Completed" 
            ? "bg-green-100 text-green-800" 
            : project.status === "In Progress" 
            ? "bg-blue-100 text-blue-800" 
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {project.status}
        </span>
      </div>
      <div className="col-span-2">
        {new Date(project.start_date).toLocaleDateString()}
      </div>
      <div className="col-span-2">
        ${project.expenses?.toFixed(2) || "0.00"}
      </div>
      <div className="col-span-1">
        {project.mileage || 0} mi
      </div>
      <div className="col-span-1 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Receipt className="mr-2 h-4 w-4" /> Add Expense
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Car className="mr-2 h-4 w-4" /> Add Trip
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the project "{project.name}" and all associated data including expenses and mileage records.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => onDelete(project.id)}
                  >
                    Delete Project
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
