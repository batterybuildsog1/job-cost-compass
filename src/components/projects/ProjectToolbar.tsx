
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, Calendar } from "lucide-react";

interface ProjectToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  projectView: "grid" | "list";
  setProjectView: (view: "grid" | "list") => void;
}

export function ProjectToolbar({ 
  searchTerm, 
  setSearchTerm, 
  projectView, 
  setProjectView 
}: ProjectToolbarProps) {
  return (
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
  );
}
