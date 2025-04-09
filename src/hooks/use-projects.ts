
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export type Project = {
  id: string;
  name: string;
  client: string | null;
  status: string;
  description: string | null;
  start_date: string;
  created_at: string;
  updated_at: string;
  // Derived values for UI (not in database)
  expenses?: number;
  mileage?: number;
};

export function useProjects() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all projects for the current user
  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Use any to overcome the TypeScript error for now
      // In a production app, you would define proper types for your database schema
      const { data, error } = await (supabase as any)
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Add placeholder values for expenses and mileage
      // In a real app, these would come from aggregated queries
      const projectsWithStats = data.map((project: any) => ({
        ...project,
        expenses: Math.floor(Math.random() * 5000), // Placeholder
        mileage: Math.floor(Math.random() * 200),  // Placeholder
      }));

      setProjects(projectsWithStats);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      setError(error.message || "Failed to load projects");
      toast({
        title: "Error loading projects",
        description: error.message || "There was a problem loading your projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new project
  const createProject = async (projectData: {
    name: string;
    client?: string;
    description?: string;
    status?: string;
  }) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a project",
        variant: "destructive",
      });
      return null;
    }

    try {
      setError(null);
      
      const { data, error } = await (supabase as any)
        .from("projects")
        .insert({
          name: projectData.name,
          client: projectData.client || null,
          description: projectData.description || null,
          status: projectData.status || "Pending",
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Add the new project to the list
      setProjects(prev => [
        {
          ...data,
          expenses: 0,
          mileage: 0
        } as Project,
        ...prev
      ]);
      
      toast({
        title: "Project created",
        description: `${projectData.name} has been created successfully`,
      });
      
      return data;
    } catch (error: any) {
      console.error("Error creating project:", error);
      setError(error.message || "Failed to create project");
      toast({
        title: "Error creating project",
        description: error.message || "There was a problem creating your project",
        variant: "destructive",
      });
      return null;
    }
  };

  // Update an existing project
  const updateProject = async (id: string, updates: Partial<Omit<Project, 'id'>>) => {
    if (!user) return null;

    try {
      setError(null);
      
      const { data, error } = await (supabase as any)
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      
      // Update the project in the list
      setProjects(prev => 
        prev.map(project => 
          project.id === id ? { ...project, ...data } : project
        )
      );
      
      toast({
        title: "Project updated",
        description: "The project has been updated successfully",
      });
      
      return data;
    } catch (error: any) {
      console.error("Error updating project:", error);
      setError(error.message || "Failed to update project");
      toast({
        title: "Error updating project",
        description: error.message || "There was a problem updating the project",
        variant: "destructive",
      });
      return null;
    }
  };

  // Delete a project
  const deleteProject = async (id: string) => {
    if (!user) return false;

    try {
      setError(null);
      
      const { error } = await (supabase as any)
        .from("projects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      // Remove the project from the list
      setProjects(prev => prev.filter(project => project.id !== id));
      
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error deleting project:", error);
      setError(error.message || "Failed to delete project");
      toast({
        title: "Error deleting project",
        description: error.message || "There was a problem deleting the project",
        variant: "destructive",
      });
      return false;
    }
  };

  // Load projects when the component mounts or user changes
  useEffect(() => {
    fetchProjects();
  }, [user?.id]);

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  };
}
