
import { useState } from "react";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Project = {
  id: string;
  name: string;
};

type ReceiptFormProps = {
  projects: Project[];
  isUploading: boolean;
  onUpload: (projectId: string, description: string) => void;
  onClose?: () => void;
  error?: string | null;
};

export function ReceiptForm({ projects, isUploading, onUpload, onClose, error }: ReceiptFormProps) {
  const [projectId, setProjectId] = useState<string>("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    onUpload(projectId, description);
  };

  return (
    <div className="space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-1">
        <Label htmlFor="project-select">Project</Label>
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger id="project-select">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          placeholder="Add a brief description of this receipt"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end">
        {onClose && (
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit} disabled={!projectId || isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Upload Receipt
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
