// TypeScript type definitions for the expense tracker

export interface Expense {
  date: string;
  description: string;
  amount: number;
  category?: string;
}

export interface MonthlyData {
  month: string;
  total: number;
  count: number;
}

export interface CSVValidationResult {
  isValid: boolean;
  error: string | null;
}
