
import { X, FileImage, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type FilePreviewProps = {
  file: File;
  preview: string | null;
  onClear: () => void;
  isHeicFile?: boolean;
};

export function FilePreview({ file, preview, onClear, isHeicFile = false }: FilePreviewProps) {
  return (
    <div className="relative border rounded-lg overflow-hidden">
      <div className="aspect-[4/3] bg-gray-100 relative">
        {preview ? (
          <img
            src={preview}
            alt="Receipt preview"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <FileImage className="h-16 w-16 text-muted-foreground" />
            {isHeicFile && (
              <div className="mt-2 flex items-center gap-1">
                <span className="text-sm text-muted-foreground">HEIC file</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>HEIC files don't display a preview</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        )}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 rounded-full bg-white"
          onClick={onClear}
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
  );
}
