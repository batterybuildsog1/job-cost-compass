
import { useReceiptUpload } from "@/hooks/use-receipt-upload";
import { UploadArea } from "@/components/receipt/UploadArea";
import { FilePreview } from "@/components/receipt/FilePreview";
import { ReceiptForm } from "@/components/receipt/ReceiptForm";
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
  const { user } = useAuth();
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
    const fileUrl = await uploadReceipt(projectId, description);
    
    if (fileUrl && onSuccess) {
      onSuccess(fileUrl);
    }
    
    if (onClose) {
      onClose();
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

      <ReceiptForm
        projects={projects}
        isUploading={isUploading}
        onUpload={handleUpload}
        onClose={onClose}
      />
    </div>
  );
}
