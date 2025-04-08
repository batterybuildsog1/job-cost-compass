
import { useState, useEffect } from "react";
import { Check, Loader2, Ban, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define our own interfaces that match the database schema
interface ReceiptItem {
  id: string;
  item_name: string;
  quantity: number | null;
  unit_price: number | null;
  total_price: number | null;
  item_category: string | null;
  notes: string | null;
}

interface ReceiptAnalysis {
  id: string;
  receipt_id: string;
  status: string;
  analysis_date: string;
  raw_response: any;
  error_message: string | null;
}

type ReceiptAnalyzerProps = {
  receiptId: string;
  receiptUrl: string;
  onClose?: () => void;
};

export function ReceiptAnalyzer({ receiptId, receiptUrl, onClose }: ReceiptAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ReceiptAnalysis | null>(null);
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load any existing analysis on mount
  useEffect(() => {
    loadExistingAnalysis();
  }, [receiptId]);

  // Load any existing analysis for this receipt
  const loadExistingAnalysis = async () => {
    try {
      // First check if we already have an analysis for this receipt
      const { data: analysisData, error: analysisError } = await supabase
        .from('receipt_analysis')
        .select('*')
        .eq('receipt_id', receiptId)
        .order('analysis_date', { ascending: false })
        .limit(1)
        .single();

      if (analysisError && analysisError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw analysisError;
      }

      if (analysisData) {
        // Safely cast the data to our interface type
        setAnalysis(analysisData as unknown as ReceiptAnalysis);
        
        // Load the items for this analysis
        const { data: itemsData, error: itemsError } = await supabase
          .from('receipt_items')
          .select('*')
          .eq('receipt_analysis_id', analysisData.id)
          .order('id');

        if (itemsError) throw itemsError;
        
        setItems((itemsData || []) as unknown as ReceiptItem[]);
      }
    } catch (error: any) {
      console.error("Error loading existing analysis:", error);
      setError("Failed to load existing analysis");
    }
  };

  // Analyze the receipt
  const analyzeReceipt = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Call the Supabase Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('analyze-receipt', {
        body: { receiptId }
      });

      if (functionError) throw functionError;
      
      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }
      
      // Reload the analysis data
      await loadExistingAnalysis();
      
      toast({
        title: "Receipt analyzed",
        description: `Successfully extracted ${data.itemCount} items from the receipt.`,
      });
    } catch (error: any) {
      console.error("Error analyzing receipt:", error);
      setError(error.message || "Failed to analyze receipt");
      toast({
        title: "Analysis failed",
        description: error.message || "There was an error analyzing your receipt",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Receipt Analysis</h2>
          <p className="text-muted-foreground">Extract line items from your receipt image</p>
        </div>
        
        {!isAnalyzing && (analysis ? (
          <Button onClick={analyzeReceipt} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Re-analyze
          </Button>
        ) : (
          <Button onClick={analyzeReceipt} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Analyze Receipt
              </>
            )}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Receipt Image */}
        <Card>
          <CardHeader>
            <CardTitle>Receipt Image</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative border-t overflow-hidden">
              <img
                src={receiptUrl}
                alt="Receipt"
                className="w-full h-auto max-h-[500px] object-contain"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Analysis Status */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Status</CardTitle>
            {analysis && (
              <CardDescription>
                Last analyzed: {new Date(analysis.analysis_date).toLocaleString()}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="font-medium">Analyzing receipt with AI...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This may take a few moments depending on the complexity of the receipt
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Ban className="h-8 w-8 text-destructive mb-4" />
                <p className="font-medium text-destructive">Analysis Failed</p>
                <p className="text-sm text-muted-foreground mt-2">{error}</p>
              </div>
            ) : analysis ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span>Status:</span>
                  <Badge variant={
                    analysis.status === 'completed' ? 'default' : 
                    analysis.status === 'processing' ? 'outline' : 
                    'destructive'
                  }>
                    {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
                  </Badge>
                </div>
                
                {analysis.error_message && (
                  <div className="text-sm text-destructive">
                    Error: {analysis.error_message}
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium mb-1">Items Extracted:</p>
                  <p className="text-2xl font-bold">{items.length}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="font-medium">No Analysis Yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click "Analyze Receipt" to extract line items from this receipt
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Extracted Items */}
      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Items</CardTitle>
            <CardDescription>
              {items.length} item{items.length !== 1 ? 's' : ''} found on this receipt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="w-[100px] text-right">Quantity</TableHead>
                  <TableHead className="w-[120px] text-right">Unit Price</TableHead>
                  <TableHead className="w-[120px] text-right">Total</TableHead>
                  <TableHead className="w-[120px]">Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.item_name}</TableCell>
                    <TableCell className="text-right">{item.quantity !== null ? item.quantity : '-'}</TableCell>
                    <TableCell className="text-right">
                      {item.unit_price !== null ? `$${item.unit_price.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.total_price !== null ? `$${item.total_price.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell>
                      {item.item_category ? (
                        <Badge variant="outline">{item.item_category}</Badge>
                      ) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-end border-t p-4">
            <Button onClick={onClose}>Close</Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Footer Actions */}
      {items.length === 0 && !isAnalyzing && (
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      )}
    </div>
  );
}
