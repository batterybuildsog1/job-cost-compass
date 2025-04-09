
import { useState } from "react";
import { 
  Plus, 
  Search, 
  Calendar, 
  ArrowUpDown, 
  MoreHorizontal,
  Edit,
  Trash,
  Receipt,
  Car,
  Loader2
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects, Project } from "@/hooks/use-projects";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function Projects() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [projectView, setProjectView] = useState<"grid" | "list">("grid");
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { 
    projects, 
    isLoading, 
    error, 
    createProject, 
    deleteProject 
  } = useProjects();
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { isSubmitting } 
  } = useForm({
    defaultValues: {
      name: "",
      client: "",
      status: "Pending",
      description: ""
    }
  });
  
  // Filter projects based on search term
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.client?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  const onSubmit = async (data: any) => {
    await createProject(data);
    reset();
    setAddProjectOpen(false);
  };
  
  const handleDeleteProject = async (id: string) => {
    setIsDeleting(true);
    await deleteProject(id);
    setProjectToDelete(null);
    setIsDeleting(false);
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
                <form onSubmit={handleSubmit(onSubmit)}>
                  <DialogHeader>
                    <DialogTitle>Add New Project</DialogTitle>
                    <DialogDescription>
                      Create a new project to track expenses and mileage.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input 
                        id="name" 
                        className="col-span-3" 
                        {...register("name", { required: true })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="client" className="text-right">
                        Client
                      </Label>
                      <Input 
                        id="client" 
                        className="col-span-3"
                        {...register("client")}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status
                      </Label>
                      <Input 
                        id="status" 
                        className="col-span-3" 
                        defaultValue="Pending"
                        {...register("status")}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input 
                        id="description" 
                        className="col-span-3"
                        {...register("description")}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Project'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={projectView === "grid" ? "default" : "outline"} 
                size="icon"
                onClick={() => setProjectView("grid")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
                <span className="sr-only">Grid view</span>
              </Button>
              <Button 
                variant={projectView === "list" ? "default" : "outline"} 
                size="icon"
                onClick={() => setProjectView("list")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                <span className="sr-only">List view</span>
              </Button>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
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
          ) : projectView === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
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
                                  onClick={() => handleDeleteProject(project.id)}
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
              ))}
            </div>
          ) : (
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
                <div key={project.id} className="grid grid-cols-12 items-center p-4 border-t">
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Add Expense</DropdownMenuItem>
                        <DropdownMenuItem>Add Trip</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                              Delete
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
                                onClick={() => deleteProject(project.id)}
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
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function FolderKanban(props: { className?: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      <path d="M8 10v4" />
      <path d="M12 10v2" />
      <path d="M16 10v6" />
    </svg>
  )
}
