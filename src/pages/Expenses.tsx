import { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal,
  Camera,
  Upload,
  Receipt,
  Calendar,
  DollarSign,
  Tag,
  Clipboard,
  Loader2,
  Info
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReceiptUploader, ReceiptData } from "@/components/ReceiptUploader";
import { ReceiptAnalyzer } from "@/components/ReceiptAnalyzer";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { useProjects } from "@/hooks/use-projects";

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

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && expense.project.toLowerCase().includes(activeTab.toLowerCase());
  });

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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {uploadedReceiptUrl && (
                      <div className="space-y-4">
                        <h3 className="font-medium text-sm">Uploaded Receipt</h3>
                        <div className="border rounded-md overflow-hidden bg-muted/20">
                          <img 
                            src={uploadedReceiptUrl} 
                            alt="Uploaded receipt" 
                            className="w-full h-auto max-h-[400px] object-contain" 
                          />
                        </div>
                        
                        {receiptData && (
                          <Card>
                            <CardHeader className="py-3">
                              <CardTitle className="text-sm font-medium">AI Analysis Results</CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Items Found:</span>
                                <span className="font-medium">{receiptData.itemCount || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Vendor:</span>
                                <span className="font-medium">{receiptData.vendorName || "Unknown"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Date:</span>
                                <span className="font-medium">{receiptData.receiptDate || "Unknown"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Amount:</span>
                                <span className="font-medium">
                                  {receiptData.receiptTotal 
                                    ? `$${Number(receiptData.receiptTotal).toFixed(2)}`
                                    : "Unknown"
                                  }
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      {isAutoFilling && (
                        <div className="mb-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Auto-filling form...</span>
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                      )}
                      
                      <div className="space-y-1">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                          id="title" 
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Building Materials"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            $
                          </span>
                          <Input 
                            id="amount" 
                            className="pl-8" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="date">Date</Label>
                        <Input 
                          id="date" 
                          type="date" 
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="vendor">Vendor</Label>
                        <Input 
                          id="vendor" 
                          value={vendor}
                          onChange={(e) => setVendor(e.target.value)}
                          placeholder="e.g. Home Depot"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="category">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="materials">Materials</SelectItem>
                            <SelectItem value="supplies">Supplies</SelectItem>
                            <SelectItem value="equipment">Equipment</SelectItem>
                            <SelectItem value="fixtures">Fixtures</SelectItem>
                            <SelectItem value="labor">Labor</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="project">Project</Label>
                        <Select value={projectId} onValueChange={setProjectId}>
                          <SelectTrigger id="project">
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent>
                            {projects.map(project => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={handleAddExpenseClose}>Cancel</Button>
                    <Button type="submit">Save Expense</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Date Range
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Expenses</TabsTrigger>
              {projects.map(project => (
                <TabsTrigger key={project.id} value={project.name.toLowerCase()}>
                  {project.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {projectsLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Loading projects...</p>
              </div>
            ) : (
              <TabsContent value={activeTab} className="space-y-4">
                {filteredExpenses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-6 mb-4">
                      <Receipt className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No expenses found</h2>
                    <p className="text-muted-foreground max-w-md mb-6">
                      {searchTerm ? 
                        `No expenses match "${searchTerm}". Try a different search term.` : 
                        "You haven't added any expenses yet. Capture a receipt or add an expense manually."}
                    </p>
                    {!searchTerm && (
                      <div className="flex gap-2">
                        <Button onClick={() => setCaptureReceiptOpen(true)}>
                          <Camera className="mr-2 h-4 w-4" /> Capture Receipt
                        </Button>
                        <Button variant="outline" onClick={() => setAddExpenseOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" /> Add Manually
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredExpenses.map((expense) => (
                      <Card key={expense.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-0">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{expense.title}</CardTitle>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>View Receipt</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAnalyzeReceipt({
                                  id: expense.id,
                                  url: expense.receipt
                                })}>
                                  Analyze Receipt
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="aspect-[4/3] bg-gray-100 rounded-md mb-4 overflow-hidden">
                            <img
                              src={expense.receipt}
                              alt={`Receipt for ${expense.title}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">${expense.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{new Date(expense.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span>{expense.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clipboard className="h-4 w-4 text-muted-foreground" />
                              <span>{expense.vendor}</span>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center gap-2">
                            <FolderKanban className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{expense.project}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button variant="default" className="w-full">View Details</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
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

function FolderKanban(props: { className?: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      <path d="M8 10v4" />
      <path d="M12 10v2" />
      <path d="M16 10v6" />
    </svg>
  )
}
