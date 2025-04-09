
import { useState } from "react";
import { Plus, Camera, Receipt, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpenseCard } from "./ExpenseCard";

interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  vendor: string;
  category: string;
  project: string;
  receipt: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  searchTerm: string;
  activeTab: string;
  isLoading: boolean;
  onCapture: () => void;
  onAdd: () => void;
  onAnalyzeReceipt: (receipt: { id: string, url: string }) => void;
}

export function ExpenseList({ 
  expenses, 
  searchTerm, 
  activeTab, 
  isLoading,
  onCapture,
  onAdd,
  onAnalyzeReceipt
}: ExpenseListProps) {
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && expense.project.toLowerCase().includes(activeTab.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading expenses...</p>
      </div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Receipt className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No expenses found</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          {searchTerm ? 
            `No expenses match "${searchTerm}". Try a different search term.` : 
            "You haven't added any expenses yet. Capture a receipt or add an expense manually."}
        </p>
        {!searchTerm && (
          <div className="flex gap-2">
            <Button onClick={onCapture}>
              <Camera className="mr-2 h-4 w-4" /> Capture Receipt
            </Button>
            <Button variant="outline" onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add Manually
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredExpenses.map((expense) => (
        <ExpenseCard 
          key={expense.id} 
          expense={expense} 
          onAnalyzeReceipt={onAnalyzeReceipt}
        />
      ))}
    </div>
  );
}
