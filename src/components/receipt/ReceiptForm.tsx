
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Project = {
  id: string;
  name: string;
};

type ReceiptFormProps = {
  projects: Project[];
  isUploading: boolean;
  onUpload: (projectId: string, description: string) => void;
  onCancel?: () => void;
};

export function ReceiptForm({ projects, isUploading, onUpload, onCancel }: ReceiptFormProps) {
  const [projectId, setProjectId] = useState<string>("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    onUpload(projectId, description);
  };

  return (
    <div className="space-y-3">
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
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isUploading}>
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
