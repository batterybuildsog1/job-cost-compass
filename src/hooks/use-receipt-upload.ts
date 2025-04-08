
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type UseReceiptUploadProps = {
  userId?: string;
};

export function useReceiptUpload({ userId }: UseReceiptUploadProps = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file input click programmatically
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const selectedFile = e.target.files[0];
    
    // Check if the file is an image
    if (!selectedFile.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    // Check if the file appears to be a HEIC file
    const isHeic = 
      selectedFile.name.toLowerCase().endsWith('.heic') || 
      selectedFile.name.toLowerCase().endsWith('.heif') ||
      selectedFile.type === 'image/heic' || 
      selectedFile.type === 'image/heif';
    
    if (isHeic) {
      toast({
        title: "HEIC files not supported in browser",
        description: "Please convert your HEIC file to JPEG or PNG before uploading.",
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
  const uploadReceipt = async (projectId: string, description: string) => {
    if (!file || !projectId || !userId) {
      toast({
        title: "Missing information",
        description: "Please select a file and project before uploading",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsUploading(true);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
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
      const { error: metadataError } = await supabase
        .from('receipt_uploads')
        .insert({
          user_id: userId,
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
      
      return publicUrlData.publicUrl;
      
    } catch (error: any) {
      console.error("Error uploading receipt:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your receipt",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    file,
    preview,
    isUploading,
    fileInputRef,
    triggerFileInput,
    handleFileChange,
    clearFile,
    uploadReceipt
  };
}
