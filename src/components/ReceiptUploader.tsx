
import { useState } from "react";
import { Upload, File, Image, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Project = {
  id: string;
  name: string;
};

type ReceiptUploaderProps = {
  projects: Project[];
  onSuccess?: (filePath: string) => void;
  onClose?: () => void;
};

export function ReceiptUploader({ projects, onSuccess, onClose }: ReceiptUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const selectedFile = e.target.files[0];
    if (!selectedFile.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
  };

  // Clear the selected file
  const clearFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
  };

  // Upload the receipt to Supabase
  const uploadReceipt = async () => {
    if (!file || !projectId || !user) {
      toast({
        title: "Missing information",
        description: "Please select a file and project before uploading",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);
        
      // Save metadata to the receipt_uploads table
      // Using a raw insert query instead of the typed API to bypass TypeScript issues
      const { error: metadataError } = await supabase
        .from('receipt_uploads')
        .insert({
          user_id: user.id,
          project_id: projectId,
          file_path: filePath,
          file_name: file.name,
          description: description || null
        } as any); // Using 'as any' to bypass TypeScript checking for now
        
      if (metadataError) {
        throw metadataError;
      }
      
      toast({
        title: "Receipt uploaded",
        description: "Your receipt has been successfully uploaded",
      });
      
      // Call the success callback with the public URL
      if (onSuccess) {
        onSuccess(publicUrlData.publicUrl);
      }
      
      // Call the close callback
      if (onClose) {
        onClose();
      }
      
    } catch (error: any) {
      console.error("Error uploading receipt:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your receipt",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop a receipt image, or click to browse
          </p>
          <Label htmlFor="receipt-upload" className="cursor-pointer">
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" type="button">
                <Upload className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </div>
            <Input
              id="receipt-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </Label>
        </div>
      ) : (
        <div className="relative border rounded-lg overflow-hidden">
          <div className="aspect-[4/3] bg-gray-100 relative">
            <img
              src={preview || ""}
              alt="Receipt preview"
              className="w-full h-full object-contain"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-white"
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-3 bg-white">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
      )}

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
          {onClose && (
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
          )}
          <Button onClick={uploadReceipt} disabled={!file || !projectId || isUploading}>
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
    </div>
  );
}
