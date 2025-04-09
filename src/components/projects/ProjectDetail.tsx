
import { useState } from "react";
import { Project } from "@/hooks/use-projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Receipt, Clock, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReceiptItemsBreakdown } from "@/components/receipt/ReceiptItemsBreakdown";

// Mock expense data - in reality this would come from an API
interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  vendor: string;
  category: string;
  project: string;
  receipt: string;
  receipt_items?: {
    id: string;
    item_name: string;
    quantity: number | null;
    unit_price: number | null;
    total_price: number | null;
    item_category: string | null;
  }[];
}

// Hours entry type
interface HoursEntry {
  id: string;
  date: string;
  hours: number;
  description: string;
}

// Mileage entry type
interface MileageEntry {
  id: string;
  date: string;
  miles: number;
  purpose: string;
}

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("summary");
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showExpenseDetails, setShowExpenseDetails] = useState(false);
  
  // Mock data - in a real app, you would fetch this from your backend
  const expenses: Expense[] = [
    {
      id: "1",
      title: "Building Materials",
      amount: 325.75,
      date: "2023-03-18",
      vendor: "Home Depot",
      category: "Materials",
      project: project.name,
      receipt: "/placeholder.svg",
      receipt_items: [
        {
          id: "item1",
          item_name: "Drywall Sheets (4x8)",
          quantity: 10,
          unit_price: 12.99,
          total_price: 129.90,
          item_category: "Materials"
        },
        {
          id: "item2",
          item_name: "Joint Compound",
          quantity: 2,
          unit_price: 15.95,
          total_price: 31.90,
          item_category: "Materials"
        },
        {
          id: "item3",
          item_name: "Drywall Screws",
          quantity: 1,
          unit_price: 8.99,
          total_price: 8.99,
          item_category: "Supplies"
        }
      ]
    },
    {
      id: "2",
      title: "Electrical Supplies",
      amount: 189.99,
      date: "2023-03-20",
      vendor: "Electrical Warehouse",
      category: "Supplies",
      project: project.name,
      receipt: "/placeholder.svg",
      receipt_items: [
        {
          id: "item4",
          item_name: "Outlet Box",
          quantity: 15,
          unit_price: 4.99,
          total_price: 74.85,
          item_category: "Electrical"
        },
        {
          id: "item5",
          item_name: "14/2 Romex Wire (100ft)",
          quantity: 2,
          unit_price: 45.99,
          total_price: 91.98,
          item_category: "Electrical"
        }
      ]
    }
  ];
  
  const hoursEntries: HoursEntry[] = [
    {
      id: "h1",
      date: "2023-03-19",
      hours: 8.5,
      description: "Framing and drywall installation"
    },
    {
      id: "h2",
      date: "2023-03-20",
      hours: 6,
      description: "Electrical rough-in"
    }
  ];
  
  const mileageEntries: MileageEntry[] = [
    {
      id: "m1",
      date: "2023-03-18",
      miles: 28,
      purpose: "Material pickup from Home Depot"
    },
    {
      id: "m2",
      date: "2023-03-20",
      miles: 32,
      purpose: "Client meeting and material pickup"
    }
  ];
  
  // Calculate totals
  const expensesTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const hoursTotal = hoursEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const mileageTotal = mileageEntries.reduce((sum, entry) => sum + entry.miles, 0);
  
  const handleViewExpenseDetails = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowExpenseDetails(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{project.name}</h2>
        <Button onClick={onClose} variant="ghost">Close</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${expensesTotal.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Hours Logged</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{hoursTotal} hrs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Mileage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mileageTotal} miles</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>
            {project.client ? `Client: ${project.client}` : "No client specified"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Status:</span> {project.status}
            </div>
            {project.description && (
              <div>
                <span className="font-medium">Description:</span> {project.description}
              </div>
            )}
            <div>
              <span className="font-medium">Created:</span> {new Date(project.created_at).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="mileage">Mileage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <h3 className="text-lg font-medium">Project Overview</h3>
          <p>{project.description || "No description provided."}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Recent Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {expenses.slice(0, 3).map(expense => (
                    <li key={expense.id} className="flex justify-between">
                      <span className="truncate">{expense.title}</span>
                      <span className="font-medium">${expense.amount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Recent Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {hoursEntries.slice(0, 3).map(entry => (
                    <li key={entry.id} className="flex justify-between">
                      <span className="truncate">{entry.description}</span>
                      <span className="font-medium">{entry.hours} hrs</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Recent Mileage</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mileageEntries.slice(0, 3).map(entry => (
                    <li key={entry.id} className="flex justify-between">
                      <span className="truncate">{entry.purpose}</span>
                      <span className="font-medium">{entry.miles} mi</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="expenses">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Expenses</h3>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </div>
          
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map(expense => (
                  <TableRow key={expense.id}>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{expense.vendor}</TableCell>
                    <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewExpenseDetails(expense)}
                      >
                        <Receipt className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        
        <TabsContent value="hours">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Hours</h3>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Hours
            </Button>
          </div>
          
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hoursEntries.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell className="text-right">{entry.hours}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="font-medium">Total Hours</TableCell>
                  <TableCell className="text-right font-medium">{hoursTotal}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        
        <TabsContent value="mileage">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Mileage</h3>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Mileage
            </Button>
          </div>
          
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead className="text-right">Miles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mileageEntries.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                    <TableCell>{entry.purpose}</TableCell>
                    <TableCell className="text-right">{entry.miles}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="font-medium">Total Mileage</TableCell>
                  <TableCell className="text-right font-medium">{mileageTotal}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Expense details dialog */}
      <Dialog open={showExpenseDetails} onOpenChange={setShowExpenseDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
          </DialogHeader>
          
          {selectedExpense && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{selectedExpense.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">${selectedExpense.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vendor</p>
                  <p className="font-medium">{selectedExpense.vendor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedExpense.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedExpense.category}</p>
                </div>
              </div>
              
              {selectedExpense.receipt_items && selectedExpense.receipt_items.length > 0 && (
                <ReceiptItemsBreakdown 
                  items={selectedExpense.receipt_items} 
                  receiptTotal={selectedExpense.amount}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
