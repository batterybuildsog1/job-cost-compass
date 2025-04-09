
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ReceiptItem {
  id: string;
  item_name: string;
  quantity: number | null;
  unit_price: number | null;
  total_price: number | null;
  item_category: string | null;
}

interface ReceiptItemsBreakdownProps {
  items: ReceiptItem[];
  receiptTotal?: number;
  isLoading?: boolean;
  className?: string;
}

export function ReceiptItemsBreakdown({ items, receiptTotal, isLoading, className }: ReceiptItemsBreakdownProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Receipt Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-4">
            <p className="text-muted-foreground">Loading items...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Receipt Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-4">
            <p className="text-muted-foreground">No items found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate total from items if not provided
  const calculatedTotal = items.reduce((sum, item) => {
    return sum + (item.total_price || 0);
  }, 0);

  const displayTotal = receiptTotal || calculatedTotal;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex justify-between items-center">
          <span>Receipt Items ({items.length})</span>
          <span>Total: ${displayTotal.toFixed(2)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="w-[80px] text-right">Qty</TableHead>
              <TableHead className="w-[100px] text-right">Unit Price</TableHead>
              <TableHead className="w-[100px] text-right">Total</TableHead>
              <TableHead className="w-[100px]">Category</TableHead>
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
    </Card>
  );
}
