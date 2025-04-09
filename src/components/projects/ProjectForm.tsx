
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel?: () => void;
  defaultValues?: ProjectFormData;
  title?: string;
  description?: string;
  submitLabel?: string;
}

export interface ProjectFormData {
  name: string;
  client?: string;
  status?: string;
  description?: string;
}

export function ProjectForm({ 
  onSubmit, 
  onCancel, 
  defaultValues,
  title,
  description,
  submitLabel = "Save Project"
}: ProjectFormProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { isSubmitting } 
  } = useForm<ProjectFormData>({
    defaultValues: defaultValues || {
      name: "",
      client: "",
      status: "Pending",
      description: ""
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {description && <p className="text-sm text-muted-foreground mt-2 mb-4">{description}</p>}
      
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input 
            id="name" 
            className="col-span-3" 
            {...register("name", { required: true })}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="client" className="text-right">
            Client
          </Label>
          <Input 
            id="client" 
            className="col-span-3"
            {...register("client")}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Input 
            id="status" 
            className="col-span-3" 
            defaultValue="Pending"
            {...register("status")}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Input 
            id="description" 
            className="col-span-3"
            {...register("description")}
          />
        </div>
      </div>
      <DialogFooter>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
