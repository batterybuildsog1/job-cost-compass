
import { MoreHorizontal, DollarSign, Calendar, Tag, Clipboard } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FolderKanban } from "@/components/projects/icons";

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

interface ExpenseCardProps {
  expense: Expense;
  onAnalyzeReceipt: (receipt: { id: string, url: string }) => void;
}

export function ExpenseCard({ expense, onAnalyzeReceipt }: ExpenseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{expense.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>View Receipt</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAnalyzeReceipt({
                id: expense.id,
                url: expense.receipt
              })}>
                Analyze Receipt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="aspect-[4/3] bg-gray-100 rounded-md mb-4 overflow-hidden">
          <img
            src={expense.receipt}
            alt={`Receipt for ${expense.title}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">${expense.amount.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(expense.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span>{expense.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clipboard className="h-4 w-4 text-muted-foreground" />
            <span>{expense.vendor}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{expense.project}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="default" className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );
}
