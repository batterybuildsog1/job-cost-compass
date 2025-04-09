
import { useState } from "react";
import { format } from "date-fns";

// Import the ReceiptData type without making a circular reference
export interface ReceiptData {
  itemCount?: number;
  vendorName?: string;
  receiptDate?: string;
  receiptTotal?: number;
}

export function useExpenseForm() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("");
  const [projectId, setProjectId] = useState("");
  const [uploadedReceiptUrl, setUploadedReceiptUrl] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const handleReceiptUploadSuccess = (filePath: string, extractedData?: ReceiptData) => {
    setUploadedReceiptUrl(filePath);
    
    if (extractedData) {
      setReceiptData(extractedData);
      setIsAutoFilling(true);
      
      setTimeout(() => {
        if (extractedData.vendorName) setVendor(extractedData.vendorName);
        if (extractedData.receiptTotal) setAmount(extractedData.receiptTotal.toString());
        if (extractedData.receiptDate) {
          try {
            const parsedDate = new Date(extractedData.receiptDate);
            setDate(format(parsedDate, 'yyyy-MM-dd'));
          } catch (e) {
            console.error("Error parsing date:", e);
            setDate("");
          }
        }
        setIsAutoFilling(false);
      }, 1500);
    }
  };

  const resetFormState = () => {
    setUploadedReceiptUrl(null);
    setReceiptData(null);
    setTitle("");
    setAmount("");
    setDate("");
    setVendor("");
    setCategory("");
    setProjectId("");
  };

  return {
    title, setTitle,
    amount, setAmount,
    date, setDate,
    vendor, setVendor,
    category, setCategory,
    projectId, setProjectId,
    uploadedReceiptUrl, setUploadedReceiptUrl,
    receiptData, setReceiptData,
    isAutoFilling, setIsAutoFilling,
    handleReceiptUploadSuccess,
    resetFormState
  };
}
