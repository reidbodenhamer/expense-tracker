/**
 * CSV Processing utilities for expense data
 */

import Papa from 'papaparse';
import { Expense } from '../types';

const CSV_DELIMITER = ',';
const MAX_CSV_SIZE_MB = 10;

const TRANSACTION_TYPE_DEBIT = 'debit';
const DEFAULT_EXPENSE_FLAG = true;

const DATE_PATTERNS = ['date'];
const AMOUNT_PATTERNS = ['amount', 'price', 'cost'];
const DESCRIPTION_PATTERNS = ['description', 'item', 'category'];
const TRANSACTION_TYPE_PATTERNS = ['credit', 'debit', 'type'];

const DEFAULT_DESCRIPTION = 'No description';

export interface MonthlyData {
  month: string;
  total: number;
  count: number;
}

export interface CSVValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Processes CSV text and converts it to expense data
 * 
 * @param csvText - Raw CSV file content
 * @returns Array of expense objects with date, amount, and description
 * @throws Error if CSV doesn't contain required 'date' and 'amount' columns
 */
export const processCSV = (csvText: string): Expense[] => {
  const HEADER_ROW_INDEX = 0;
  const DATA_START_INDEX = 1;

  // use PapaParse library to get 2D array of csv data
  const parseResult = Papa.parse<string[]>(csvText, {
    header: false,
    skipEmptyLines: true,
    delimiter: CSV_DELIMITER
  });

  if (parseResult.errors.length > 0) {
    throw new Error(`CSV parsing error: ${parseResult.errors[0].message}`);
  }

  const rows = parseResult.data; // rows is a 2D array of strings
  const columns = rows[HEADER_ROW_INDEX].map(
    (headerField: string) => headerField.trim().toLowerCase());

  const dateIndex = columns.findIndex((columnName: string) => 
    DATE_PATTERNS.some((pattern: string) => columnName.includes(pattern)));
  const amountIndex = columns.findIndex((columnName: string) => 
    AMOUNT_PATTERNS.some((pattern: string) => columnName.includes(pattern)));
  const descriptionIndex = columns.findIndex((columnName: string) => 
    DESCRIPTION_PATTERNS.some((pattern: string) => columnName.includes(pattern)));
  const transactionTypeIndex = columns.findIndex((columnName: string) => 
    TRANSACTION_TYPE_PATTERNS.some((pattern: string) => columnName.includes(pattern)));

  if (dateIndex === -1 || amountIndex === -1) {
    throw new Error('CSV must contain date and amount columns');
  }

  const expenseData: Expense[] = [];
  rows.slice(DATA_START_INDEX).forEach((row: string[]) => { 
    const transactionType = transactionTypeIndex !== -1 ? 
        row[transactionTypeIndex].toLowerCase() : '';

    const isExpense = transactionType === TRANSACTION_TYPE_DEBIT || 
        (transactionType === '' && DEFAULT_EXPENSE_FLAG);
    if (!isExpense) return; // skip non-expense transactions

    const date = new Date(row[dateIndex]);
    const amount = parseFloat(row[amountIndex].replace(/[$,]/g, '')); // remove '$' and ','
    if (isNaN(date.getTime()) || isNaN(amount)) return;

    const description = descriptionIndex !== -1 ? row[descriptionIndex] : DEFAULT_DESCRIPTION;
    expenseData.push({
      date: date.toISOString().split('T')[0], // 'YYYY-MM-DD' format
      amount: amount,
      description: description
    });
  });

  return expenseData;
};

/**
 * Generates monthly summary data from expense array
 * 
 * @param expenseData - Array of expense objects
 * @returns Array of monthly summary objects with month, total, and count
 */
export const generateMonthlyData = (expenseData: Expense[]): MonthlyData[] => {
  const monthlyTotals: Record<string, MonthlyData> = {};
  
  expenseData.forEach((expense: Expense) => {
    const date = new Date(expense.date);
    // 'YYYY-MM' format for sorting
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    // 'Month YYYY' format for display
    const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    
    if (!monthlyTotals[monthKey]) {
      monthlyTotals[monthKey] = {
        month: monthName,
        total: 0,
        count: 0
      };
    }
    
    monthlyTotals[monthKey].total += expense.amount;
    monthlyTotals[monthKey].count += 1;
  });
  
  // convert to [key, value] pairs for sorting
  const sortedMonthly = Object.entries(monthlyTotals) 
    .sort(([monthKeyA, ], [monthKeyB, ]) => monthKeyA.localeCompare(monthKeyB))
    .map(([, monthData]) => monthData); // ignore the keys when returning
  
  return sortedMonthly;
};

/**
 * Validates if a file is acceptable for CSV processing
 * @param file - File object to validate
 * @returns Object with validation result and error message
 */
export const validateCSVFile = (file: File | null): CSVValidationResult => {
  if (!file) {
    return { 
        isValid: false, 
        error: 'No file detected. Please try again.'
    };
  }
  if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
    return { 
        isValid: false, 
        error: 'Please upload a CSV file'
    };
  }
  if (file.size > (MAX_CSV_SIZE_MB * 1024 * 1024)) {
    return { 
        isValid: false, 
        error: `File too large. Please upload a file smaller than ${MAX_CSV_SIZE_MB}MB.` 
    };
  }

  return { isValid: true, error: null };
};
