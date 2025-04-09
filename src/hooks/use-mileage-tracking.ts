
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { MileageEntry } from "@/types/expense";

export function useMileageTracking(projectId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<MileageEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for now
  const mockMileageEntries: MileageEntry[] = [
    {
      id: "m1",
      project_id: "123",
      date: "2023-03-18",
      miles: 28,
      purpose: "Material pickup from Home Depot",
      created_at: "2023-03-18T10:30:00Z"
    },
    {
      id: "m2",
      project_id: "123",
      date: "2023-03-20",
      miles: 32,
      purpose: "Client meeting and material pickup",
      created_at: "2023-03-20T09:15:00Z"
    },
    {
      id: "m3",
      project_id: "456",
      date: "2023-03-22",
      miles: 18,
      purpose: "Site inspection",
      created_at: "2023-03-22T15:20:00Z"
    }
  ];

  // Fetch mileage entries
  useEffect(() => {
    // This is just a placeholder
    const loadMileageEntries = () => {
      setIsLoading(true);
      setTimeout(() => {
        try {
          // Filter entries by project ID if provided
          // For new projects (not in the mock data), return an empty array
          const filteredEntries = projectId 
            ? mockMileageEntries.filter(entry => entry.project_id === projectId)
            : mockMileageEntries;
            
          setEntries(filteredEntries);
          setError(null);
        } catch (e) {
          setError("Failed to load mileage entries");
        } finally {
          setIsLoading(false);
        }
      }, 300); // Simulate network delay
    };
    
    loadMileageEntries();
  }, [projectId]);

  // Calculate total mileage
  const getTotalMileage = (): number => {
    return entries.reduce((sum, entry) => sum + entry.miles, 0);
  };

  return {
    entries,
    isLoading,
    error,
    getTotalMileage
  };
}
