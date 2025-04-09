
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UploadAreaProps = {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileInput: () => void;
};

export function UploadArea({ fileInputRef, onFileChange, triggerFileInput }: UploadAreaProps) {
  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop a receipt image, or click to browse
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        Supports JPEG, PNG, and HEIC formats
      </p>
      <Input
        id="receipt-upload"
        type="file"
        accept="image/*,.heic,.heif"
        onChange={onFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <Button 
        variant="secondary" 
        size="sm" 
        type="button" 
        onClick={triggerFileInput}
      >
        <Upload className="mr-2 h-4 w-4" />
        Select File
      </Button>
    </div>
  );
}
