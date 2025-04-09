
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { HoursEntry } from "@/types/expense";

export function useHoursTracking(projectId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<HoursEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for now
  const mockHoursEntries: HoursEntry[] = [
    {
      id: "h1",
      project_id: "123",
      date: "2023-03-19",
      hours: 8.5,
      description: "Framing and drywall installation",
      created_at: "2023-03-19T18:00:00Z"
    },
    {
      id: "h2",
      project_id: "123",
      date: "2023-03-20",
      hours: 6,
      description: "Electrical rough-in",
      created_at: "2023-03-20T16:30:00Z"
    },
    {
      id: "h3",
      project_id: "456",
      date: "2023-03-21",
      hours: 4.5,
      description: "Plumbing installation",
      created_at: "2023-03-21T14:45:00Z"
    }
  ];

  // Fetch hours entries
  useEffect(() => {
    // This is just a placeholder
    const loadHoursEntries = () => {
      setIsLoading(true);
      setTimeout(() => {
        try {
          // Filter entries by project ID if provided
          const filteredEntries = projectId 
            ? mockHoursEntries.filter(entry => entry.project_id === projectId)
            : mockHoursEntries;
            
          setEntries(filteredEntries);
          setError(null);
        } catch (e) {
          setError("Failed to load hours entries");
        } finally {
          setIsLoading(false);
        }
      }, 300); // Simulate network delay
    };
    
    loadHoursEntries();
  }, [projectId]);

  // Calculate total hours
  const getTotalHours = (): number => {
    return entries.reduce((sum, entry) => sum + entry.hours, 0);
  };

  return {
    entries,
    isLoading,
    error,
    getTotalHours
  };
}
