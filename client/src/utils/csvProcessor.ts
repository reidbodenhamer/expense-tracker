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

interface ColumnMapping {
  dateIndex: number;
  amountIndex: number;
  descriptionIndex: number;
  transactionTypeIndex: number;
}

/**
 * Finds column indices based on header patterns
 * 
 * @param headers - Array of header strings from the CSV
 * @returns Object mapping column names to their indices
 * @throws Error if required columns are not found
 */
const findColumnIndices = (headers: string[]): ColumnMapping => {
  const normalizedHeaders = headers.map(header => header.trim().toLowerCase());
  
  const findColumnIndex = (patterns: string[]) =>
    normalizedHeaders.findIndex(header => 
      patterns.some(pattern => header.includes(pattern))
    );

  return {
    dateIndex: findColumnIndex(DATE_PATTERNS),
    amountIndex: findColumnIndex(AMOUNT_PATTERNS),
    descriptionIndex: findColumnIndex(DESCRIPTION_PATTERNS),
    transactionTypeIndex: findColumnIndex(TRANSACTION_TYPE_PATTERNS)
  };
};

/**
 * Determines if a transaction should be treated as an expense by
 * checking its type. If the type is empty, it defaults based on the flag
 * 
 * @param transactionType - Type of the transaction
 * @returns True if the transaction is an expense, false otherwise
 */
const isExpenseTransaction = (transactionType: string): boolean => {
  const normalizedType = transactionType.toLowerCase();
  return normalizedType === TRANSACTION_TYPE_DEBIT || 
         (normalizedType === '' && DEFAULT_EXPENSE_FLAG);
};

/**
 * Parses and validates a single row of CSV data.
 * 
 * @param row - Array of strings representing a CSV row
 * @param columnMapping - Object containing indices of relevant columns
 * @returns Expense object or null if row is invalid
 */
const parseExpenseRow = (row: string[], columnMapping: ColumnMapping): Expense | null => {
  const { dateIndex, amountIndex, descriptionIndex, transactionTypeIndex } = columnMapping;
  
  // date and amount are required fields
  if (!row[dateIndex] || !row[amountIndex]) {
    return null;
  }

  const transactionType = transactionTypeIndex !== -1 && row[transactionTypeIndex] ? 
    row[transactionTypeIndex] : '';
  if (!isExpenseTransaction(transactionType)) {
    return null;
  }

  const date = new Date(row[dateIndex]);
  if (isNaN(date.getTime())) {
    return null;
  }

  const amount = parseFloat(row[amountIndex].replace(/[$,]/g, ''));
  if (isNaN(amount)) {
    return null;
  }

  const description = descriptionIndex !== -1 && row[descriptionIndex] ? 
    row[descriptionIndex] : DEFAULT_DESCRIPTION;

  return {
    date: date.toISOString().split('T')[0], // 'YYYY-MM-DD' format
    amount: amount,
    description: description
  };
};

/**
 * Processes CSV text with Papa Parse and converts it to expense data
 * 
 * @param csvText - Raw CSV file content
 * @returns Array of expense objects with date, amount, and description
 * @throws Error if CSV doesn't contain required 'date' and 'amount' columns
 */
export const processCSV = (csvText: string): Expense[] => {
  // Papa Parse library puts CSV data into a 2D array
  const parseResult = Papa.parse<string[]>(csvText, {
    header: false,
    skipEmptyLines: true,
    delimiter: CSV_DELIMITER
  });

  if (parseResult.errors.length > 0) {
    throw new Error(`CSV parsing error: ${parseResult.errors[0].message}`);
  }

  const rows = parseResult.data;
  if (rows.length < 2) {
    throw new Error('CSV must contain at least a header row and one data row');
  }

  const columnMapping = findColumnIndices(rows[0]);  
  if (columnMapping.dateIndex === -1 || columnMapping.amountIndex === -1) {
    throw new Error('CSV must contain date and amount columns');
  }

  const expenseData: Expense[] = [];
  for (let i = 1; i < rows.length; i++) {
    const expense = parseExpenseRow(rows[i], columnMapping);
    if (expense) {
      expenseData.push(expense);
    }
  }

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
