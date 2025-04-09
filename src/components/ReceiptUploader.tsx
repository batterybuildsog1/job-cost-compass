
import { useState } from "react";
import { useReceiptUpload } from "@/hooks/use-receipt-upload";
import { UploadArea } from "@/components/receipt/UploadArea";
import { FilePreview } from "@/components/receipt/FilePreview";
import { ReceiptForm } from "@/components/receipt/ReceiptForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Project } from "@/hooks/use-projects";

type ReceiptUploaderProps = {
  projects: Project[];
  onSuccess?: (filePath: string, receiptData?: ReceiptData) => void;
  onClose?: () => void;
};

export type ReceiptData = {
  receiptId: string;
  vendorName?: string;
  receiptDate?: string;
  receiptTotal?: number;
  itemCount?: number;
};

export function ReceiptUploader({ projects, onSuccess, onClose }: ReceiptUploaderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const {
    file,
    preview,
    isUploading,
    isHeicFile,
    fileInputRef,
    triggerFileInput,
    handleFileChange,
    clearFile,
    uploadReceipt
  } = useReceiptUpload({ userId: user?.id });

  const handleUpload = async (projectId: string, description: string) => {
    try {
      // First upload the receipt to get the fileUrl and receiptId
      const { fileUrl, receiptId } = await uploadReceipt(projectId, description);
      
      if (!fileUrl || !receiptId) {
        throw new Error("Failed to upload receipt");
      }
      
      setIsAnalyzing(true);
      setAnalysisError(null);
      
      // Call the analyze-receipt edge function
      const { data, error } = await supabase.functions.invoke('analyze-receipt', {
        body: { receiptId }
      });
      
      if (error) throw error;
      
      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }
      
      // Extract receipt data for auto-filling form
      const receiptData: ReceiptData = {
        receiptId,
        vendorName: data.vendorName,
        receiptDate: data.receiptDate,
        receiptTotal: data.receiptTotal,
        itemCount: data.itemCount
      };
      
      // Call onSuccess with both the file path and receipt data
      if (onSuccess) {
        onSuccess(fileUrl, receiptData);
      }
      
      // Close the dialog if needed
      if (onClose) {
        onClose();
      }
      
      toast({
        title: "Receipt analyzed",
        description: `Successfully extracted ${data.itemCount} items from your receipt.`,
      });
      
    } catch (error: any) {
      console.error("Error analyzing receipt:", error);
      setAnalysisError(error.message || "Failed to analyze receipt");
      
      toast({
        title: "Analysis failed",
        description: error.message || "There was an error analyzing your receipt",
        variant: "destructive",
      });
      
      // If upload succeeded but analysis failed, still return the URL
      if (onSuccess && file) {
        onSuccess(URL.createObjectURL(file));
      }
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <UploadArea
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          triggerFileInput={triggerFileInput}
        />
      ) : (
        <FilePreview
          file={file}
          preview={preview}
          onClear={clearFile}
          isHeicFile={isHeicFile}
        />
      )}

      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="font-medium">Analyzing receipt with AI...</p>
          <p className="text-sm text-muted-foreground mt-2">
            This may take a few moments
          </p>
        </div>
      ) : (
        <ReceiptForm
          projects={projects}
          isUploading={isUploading}
          onUpload={handleUpload}
          onClose={onClose}
          error={analysisError}
        />
      )}
    </div>
  );
}
