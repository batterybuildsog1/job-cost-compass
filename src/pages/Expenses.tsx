
import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReceiptUploader, ReceiptData } from "@/components/ReceiptUploader";
import { ReceiptAnalyzer } from "@/components/ReceiptAnalyzer";
import { format } from "date-fns";
import { useProjects } from "@/hooks/use-projects";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseToolbar } from "@/components/expenses/ExpenseToolbar";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";

// Sample expenses data
const expenses = [
  {
    id: "1",
    title: "Building Materials",
    amount: 325.75,
    date: "2023-03-18",
    vendor: "Home Depot",
    category: "Materials",
    project: "Kitchen Renovation",
    receipt: "/placeholder.svg",
  },
  {
    id: "2",
    title: "Electrical Supplies",
    amount: 189.99,
    date: "2023-03-20",
    vendor: "Electrical Warehouse",
    category: "Supplies",
    project: "Kitchen Renovation",
    receipt: "/placeholder.svg",
  },
  {
    id: "3",
    title: "Plumbing Fixtures",
    amount: 210.50,
    date: "2023-01-15",
    vendor: "Plumbing Plus",
    category: "Fixtures",
    project: "Bathroom Remodel",
    receipt: "/placeholder.svg",
  },
  {
    id: "4",
    title: "Tool Rental",
    amount: 75.00,
    date: "2023-03-01",
    vendor: "Tool Rental Co",
    category: "Equipment",
    project: "Deck Construction",
    receipt: "/placeholder.svg",
  },
  {
    id: "5",
    title: "Painting Supplies",
    amount: 143.25,
    date: "2023-02-28",
    vendor: "Paint Supply Store",
    category: "Supplies",
    project: "Deck Construction",
    receipt: "/placeholder.svg",
  },
];

export default function Expenses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [captureReceiptOpen, setCaptureReceiptOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [uploadedReceiptUrl, setUploadedReceiptUrl] = useState<string | null>(null);
  const [analyzeReceiptOpen, setAnalyzeReceiptOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<{ id: string, url: string } | null>(null);
  
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("");
  const [projectId, setProjectId] = useState("");
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  
  const { projects, isLoading: projectsLoading } = useProjects();
  
  const handleReceiptUploadSuccess = (filePath: string, extractedData?: ReceiptData) => {
    setUploadedReceiptUrl(filePath);
    setCaptureReceiptOpen(false);
    setAddExpenseOpen(true);
    
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
  
  const handleAnalyzeReceipt = (receipt: { id: string, url: string }) => {
    setSelectedReceipt(receipt);
    setAnalyzeReceiptOpen(true);
  };

  const handleAddExpenseClose = () => {
    setAddExpenseOpen(false);
    setUploadedReceiptUrl(null);
    setReceiptData(null);
    setTitle("");
    setAmount("");
    setDate("");
    setVendor("");
    setCategory("");
    setProjectId("");
  };

  const handleSaveExpense = () => {
    // This would save the expense in a real app
    console.log("Saving expense:", { title, amount, date, vendor, category, projectId });
    handleAddExpenseClose();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-1 container py-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            <h1 className="text-3xl font-bold">Expenses</h1>
            <div className="flex gap-2">
              <Dialog open={captureReceiptOpen} onOpenChange={setCaptureReceiptOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" /> Upload Receipt
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Upload Receipt</DialogTitle>
                    <DialogDescription>
                      Upload a receipt image and tag it with a project.
                    </DialogDescription>
                  </DialogHeader>
                  {projectsLoading ? (
                    <div className="flex flex-col items-center justify-center p-6">
                      <Loader2 className="h-8 w-8 animate-spin mb-4" />
                      <p>Loading projects...</p>
                    </div>
                  ) : (
                    <ReceiptUploader 
                      projects={projects} 
                      onSuccess={handleReceiptUploadSuccess}
                      onClose={() => setCaptureReceiptOpen(false)}
                    />
                  )}
                </DialogContent>
              </Dialog>
              
              <Dialog open={addExpenseOpen} onOpenChange={handleAddExpenseClose}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Add Manually
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                    <DialogDescription>
                      {receiptData 
                        ? "We've analyzed your receipt. Review the details and make any needed adjustments."
                        : "Enter the expense details manually."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  <ExpenseForm 
                    uploadedReceiptUrl={uploadedReceiptUrl}
                    receiptData={receiptData}
                    isAutoFilling={isAutoFilling}
                    projects={projects}
                    onCancel={handleAddExpenseClose}
                    onSubmit={handleSaveExpense}
                    title={title}
                    setTitle={setTitle}
                    amount={amount}
                    setAmount={setAmount}
                    date={date}
                    setDate={setDate}
                    vendor={vendor}
                    setVendor={setVendor}
                    category={category}
                    setCategory={setCategory}
                    projectId={projectId}
                    setProjectId={setProjectId}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <ExpenseToolbar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Expenses</TabsTrigger>
              {projects.map(project => (
                <TabsTrigger key={project.id} value={project.name.toLowerCase()}>
                  {project.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <ExpenseList
                expenses={expenses}
                searchTerm={searchTerm}
                activeTab={activeTab}
                isLoading={projectsLoading}
                onCapture={() => setCaptureReceiptOpen(true)}
                onAdd={() => setAddExpenseOpen(true)}
                onAnalyzeReceipt={handleAnalyzeReceipt}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Dialog open={analyzeReceiptOpen} onOpenChange={setAnalyzeReceiptOpen}>
        <DialogContent className="max-w-4xl">
          {selectedReceipt && (
            <ReceiptAnalyzer 
              receiptId={selectedReceipt.id} 
              receiptUrl={selectedReceipt.url}
              onClose={() => setAnalyzeReceiptOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
