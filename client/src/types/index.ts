// TypeScript type definitions for the expense tracker
export interface User {
  _id: string;
  email: string;
  name: string;
}
export interface Expense {
  date: string;
  description: string;
  amount: number;
  category?: string;
}

export interface ProcessedData {
  transactions: Expense[];
  totalExpenses: number;
  totalTransactions: number;
}

export interface CSVProcessingResult {
  success: boolean;
  data?: ProcessedData;
  error?: string;
}
