
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { Project } from "@/hooks/use-projects";

interface ReceiptData {
  itemCount?: number;
  vendorName?: string;
  receiptDate?: string;
  receiptTotal?: number;
}

interface ExpenseFormProps {
  uploadedReceiptUrl: string | null;
  receiptData: ReceiptData | null;
  isAutoFilling: boolean;
  projects: Project[];
  onCancel: () => void;
  onSubmit: () => void;
  title: string;
  setTitle: (title: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  date: string;
  setDate: (date: string) => void;
  vendor: string;
  setVendor: (vendor: string) => void;
  category: string;
  setCategory: (category: string) => void;
  projectId: string;
  setProjectId: (projectId: string) => void;
}

export function ExpenseForm({
  uploadedReceiptUrl,
  receiptData,
  isAutoFilling,
  projects,
  onCancel,
  onSubmit,
  title,
  setTitle,
  amount,
  setAmount,
  date,
  setDate,
  vendor,
  setVendor,
  category,
  setCategory,
  projectId,
  setProjectId
}: ExpenseFormProps) {
  return (
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

      <DialogFooter className="md:col-span-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" onClick={onSubmit}>Save Expense</Button>
      </DialogFooter>
    </div>
  );
}
