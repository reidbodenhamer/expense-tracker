/**
 * CSV Processing utilities for expense data
 */

import Papa from 'papaparse'

const CSV_DELIMITER = ','
const MAX_CSV_SIZE_MB = 10

const TRANSACTION_TYPE_DEBIT = 'debit'
const DEFAULT_TO_EXPENSE_WHEN_NO_TYPE = true

const DATE_COLUMN_PATTERNS = ['date']
const AMOUNT_COLUMN_PATTERNS = ['amount', 'price', 'cost']
const DESCRIPTION_COLUMN_PATTERNS = ['description', 'item', 'category']
const TRANSACTION_TYPE_COLUMN_PATTERNS = ['credit', 'debit', 'type']

const DEFAULT_DESCRIPTION = 'No description'

/**
 * Processes CSV text and converts it to expense data
 * 
 * @param {string} csvText - Raw CSV file content
 * @returns {Array} Array of expense objects with date, amount, and description
 * @throws {Error} If CSV doesn't contain required 'date' and 'amount' columns
 */
export const processCSV = (csvText) => {
  const HEADER_ROW_INDEX = 0
  const DATA_START_INDEX = 1

  const parseResult = Papa.parse(csvText, { // PapaParse library
    header: false,
    skipEmptyLines: true,
    delimiter: CSV_DELIMITER
  })

  if (parseResult.errors.length > 0) {
    throw new Error(`CSV parsing error: ${parseResult.errors[0].message}`)
  }

  const rows = parseResult.data
  const columns = rows[HEADER_ROW_INDEX].map(headerField => headerField.trim().toLowerCase())

  const dateIndex = columns.findIndex(columnName => 
    DATE_COLUMN_PATTERNS.some(pattern => columnName.includes(pattern)))
  const amountIndex = columns.findIndex(columnName => 
    AMOUNT_COLUMN_PATTERNS.some(pattern => columnName.includes(pattern)))
  const descriptionIndex = columns.findIndex(columnName => 
    DESCRIPTION_COLUMN_PATTERNS.some(pattern => columnName.includes(pattern)))
  const transactionTypeIndex = columns.findIndex(columnName => 
    TRANSACTION_TYPE_COLUMN_PATTERNS.some(pattern => columnName.includes(pattern)))

  if (dateIndex === -1 || amountIndex === -1) {
    throw new Error('CSV must contain date and amount columns')
  }

  const expenseData = []
  rows.slice(DATA_START_INDEX).forEach(row => { 
    const transactionType = transactionTypeIndex !== -1 ? row[transactionTypeIndex].toLowerCase() : ''
    const isExpense = transactionType === TRANSACTION_TYPE_DEBIT || 
      (transactionType === '' && DEFAULT_TO_EXPENSE_WHEN_NO_TYPE)
    if (!isExpense) return

    const date = new Date(row[dateIndex])
    const amount = parseFloat(row[amountIndex].replace(/[$,]/g, '')) // remove '$' and ','
    if (isNaN(date.getTime()) || isNaN(amount)) return

    const description = descriptionIndex !== -1 ? row[descriptionIndex] : DEFAULT_DESCRIPTION
    expenseData.push({
      date: date.toISOString().split('T')[0], // 'YYYY-MM-DD' format
      amount: amount,
      description: description
    })
  })

  return expenseData
}

/**
 * Generates monthly summary data from expense array
 * 
 * @param {Array} expenseData - Array of expense objects
 * @returns {Array} Array of monthly summary objects with month, total, and count
 */
export const generateMonthlyData = (expenseData) => {
  const monthlyTotals = {}
  
  expenseData.forEach(expense => {
    const date = new Date(expense.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` // 'YYYY-MM' format
    const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) // 'Month YYYY' format
    
    if (!monthlyTotals[monthKey]) {
      monthlyTotals[monthKey] = {
        month: monthName,
        total: 0,
        count: 0
      }
    }
    
    monthlyTotals[monthKey].total += expense.amount
    monthlyTotals[monthKey].count += 1
  })
  
  const sortedMonthly = Object.entries(monthlyTotals) // convert to [key, value] pairs
    .sort(([monthKeyA], [monthKeyB]) => monthKeyA.localeCompare(monthKeyB))
    .map(([, monthData]) => monthData) // extract just the month data objects
  
  return sortedMonthly
}

/**
 * Validates if a file is acceptable for CSV processing
 * @param {File} file - File object to validate
 * @returns {Object} - { isValid: boolean, error: string|null }
 */
export const validateCSVFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file detected. Please try again.' }
  }

  if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
    return { isValid: false, error: 'Please upload a CSV file' }
  }

  if (file.size > (MAX_CSV_SIZE_MB * 1024 * 1024)) {
    return { isValid: false, error: `File too large. Please upload a file smaller than ${MAX_CSV_SIZE_MB}MB.` }
  }

  return { isValid: true, error: null }
}
