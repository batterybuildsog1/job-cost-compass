
import { useState } from "react";
import { Edit, Trash, Receipt, Car, Loader2, MoreHorizontal } from "lucide-react";
import { Project } from "@/hooks/use-projects";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
  projectToDelete: string | null;
  setProjectToDelete: (id: string | null) => void;
}

export function ProjectCard({ project, onDelete, isDeleting, projectToDelete, setProjectToDelete }: ProjectCardProps) {
  return (
    <Card key={project.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>{project.client}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
              <AlertDialog open={projectToDelete === project.id} onOpenChange={(open) => {
                if (!open) setProjectToDelete(null);
              }}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => {
                    e.preventDefault();
                    setProjectToDelete(project.id);
                  }}>
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
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            project.status === "Completed" 
              ? "bg-green-100 text-green-800" 
              : project.status === "In Progress" 
              ? "bg-blue-100 text-blue-800" 
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {project.status}
          </span>
          <span className="text-xs text-muted-foreground">
            Started {new Date(project.start_date).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="expenses" className="flex-1">Expenses</TabsTrigger>
            <TabsTrigger value="trips" className="flex-1">Trips</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">{project.description || "No description provided."}</p>
          </TabsContent>
          <TabsContent value="expenses" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Expenses</span>
                <span className="text-sm font-semibold">${project.expenses?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-blue" style={{ width: `${Math.min((project.expenses || 0) / 50, 100)}%` }}></div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Receipt className="mr-2 h-4 w-4" /> View All Expenses
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="trips" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Mileage</span>
                <span className="text-sm font-semibold">{project.mileage || 0} miles</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-green" style={{ width: `${Math.min((project.mileage || 0) / 2, 100)}%` }}></div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Car className="mr-2 h-4 w-4" /> View All Trips
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="default" className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );
}
