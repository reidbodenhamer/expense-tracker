import { Expense } from './transactions';

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
