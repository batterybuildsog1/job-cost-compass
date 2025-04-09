
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Filter, ArrowUpDown } from "lucide-react";

interface ExpenseToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function ExpenseToolbar({ searchTerm, setSearchTerm }: ExpenseToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Date Range
        </Button>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort
        </Button>
      </div>
    </div>
  );
}
