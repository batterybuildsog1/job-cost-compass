
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { Expense, ReceiptItem } from "@/types/expense";

export function useExpenses(projectId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For now, since we don't have a real expenses table, we'll use mock data
  const mockExpenses: Expense[] = [
    {
      id: "1",
      title: "Building Materials",
      amount: 325.75,
      date: "2023-03-18",
      vendor: "Home Depot",
      category: "Materials",
      project: "Kitchen Renovation",
      project_id: "123",
      receipt: "/placeholder.svg",
    },
    {
      id: "2",
      title: "Electrical Supplies",
      amount: 189.99,
      date: "2023-03-20",
      vendor: "Electrical Warehouse",
      category: "Supplies",
      project: "Kitchen Renovation",
      project_id: "123",
      receipt: "/placeholder.svg",
    },
    {
      id: "3",
      title: "Plumbing Fixtures",
      amount: 210.50,
      date: "2023-01-15",
      vendor: "Plumbing Plus",
      category: "Fixtures",
      project: "Bathroom Remodel",
      project_id: "456",
      receipt: "/placeholder.svg",
    },
    {
      id: "4",
      title: "Tool Rental",
      amount: 75.00,
      date: "2023-03-01",
      vendor: "Tool Rental Co",
      category: "Equipment",
      project: "Deck Construction",
      project_id: "789",
      receipt: "/placeholder.svg",
    },
    {
      id: "5",
      title: "Painting Supplies",
      amount: 143.25,
      date: "2023-02-28",
      vendor: "Paint Supply Store",
      category: "Supplies",
      project: "Deck Construction",
      project_id: "789",
      receipt: "/placeholder.svg",
    },
  ];

  // Fetch expenses for a project or all expenses
  useEffect(() => {
    // This is just a placeholder for when we implement real expense tracking
    // In a real implementation, this would call the Supabase API
    const loadExpenses = () => {
      setIsLoading(true);
      setTimeout(() => {
        try {
          // Filter expenses by project ID if one is provided
          const filteredExpenses = projectId 
            ? mockExpenses.filter(expense => expense.project_id === projectId)
            : mockExpenses;
            
          setExpenses(filteredExpenses);
          setError(null);
        } catch (e) {
          setError("Failed to load expenses");
        } finally {
          setIsLoading(false);
        }
      }, 500); // Simulate network delay
    };
    
    loadExpenses();
  }, [projectId]);

  // Get receipt items for an expense
  const getReceiptItems = async (receiptId: string): Promise<ReceiptItem[]> => {
    try {
      // This would be a real API call in production
      return [
        {
          id: "item1",
          item_name: "Sample Item 1",
          quantity: 2,
          unit_price: 10.99,
          total_price: 21.98,
          item_category: "Materials"
        },
        {
          id: "item2",
          item_name: "Sample Item 2",
          quantity: 1,
          unit_price: 15.50,
          total_price: 15.50,
          item_category: "Supplies"
        }
      ];
    } catch (error) {
      console.error("Error fetching receipt items:", error);
      return [];
    }
  };

  return {
    expenses,
    isLoading,
    error,
    getReceiptItems
  };
}
