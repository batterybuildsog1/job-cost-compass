
export interface ReceiptItem {
  id: string;
  item_name: string;
  quantity: number | null;
  unit_price: number | null;
  total_price: number | null;
  item_category: string | null;
  notes?: string | null;
}

export interface ReceiptAnalysis {
  id: string;
  receipt_id: string;
  status: string;
  analysis_date: string;
  raw_response: any;
  error_message: string | null;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  vendor: string;
  category: string;
  project: string;
  project_id?: string;
  receipt?: string;
  receipt_items?: ReceiptItem[];
}

export interface HoursEntry {
  id: string;
  project_id: string;
  date: string;
  hours: number;
  description: string;
  created_at: string;
}

export interface MileageEntry {
  id: string;
  project_id: string;
  date: string;
  miles: number;
  purpose: string;
  created_at: string;
}
