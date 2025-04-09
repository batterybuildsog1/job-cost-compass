
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, Calendar } from "lucide-react";

interface ProjectToolbarProps {
  filter: string;
  setFilter: (term: string) => void;
  sortBy: "name" | "date";
  setSortBy: (sortBy: "name" | "date") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
}

export function ProjectToolbar({ 
  filter, 
  setFilter, 
  sortBy,
  setSortBy,
  sortOrder, 
  setSortOrder 
}: ProjectToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder="Search projects..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSortBy(sortBy === "name" ? "date" : "name")}
        >
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort by: {sortBy === "name" ? "Name" : "Date"}
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Order: {sortOrder === "asc" ? "Ascending" : "Descending"}
        </Button>
      </div>
    </div>
  );
}
