/**
 * CSV Processing utilities for expense data
 */

const CSV_DELIMITER = ','
const CSV_NEWLINE = '\n'

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
  const MINIMUM_REQUIRED_COLUMNS = 2 // need 'date' and 'amount' columns, 'description' optional

  const lines = csvText.trim().split(CSV_NEWLINE)
  const columns = lines[HEADER_ROW_INDEX].split(CSV_DELIMITER).map(h => h.trim().toLowerCase())

  const dateIndex = columns.findIndex(columnName => columnName.includes('date'))
  const amountIndex = columns.findIndex(columnName => 
    columnName.includes('amount') || columnName.includes('price') || columnName.includes('cost'))
  const descriptionIndex = columns.findIndex(columnName => 
    columnName.includes('description') || columnName.includes('item') || columnName.includes('category'))

  if (dateIndex === -1 || amountIndex === -1) {
    throw new Error('CSV must contain date and amount columns')
  }

  const expenseData = []
  for (let i = DATA_START_INDEX; i < lines.length; i++) {
    const row = lines[i].split(CSV_DELIMITER).map(value => value.trim())

    if (row.length >= MINIMUM_REQUIRED_COLUMNS) {
      const date = new Date(row[dateIndex])
      const amount = parseFloat(row[amountIndex].replace(/[$,]/g, '')) // remove '$' and ','
      const description = descriptionIndex !== -1 ? row[descriptionIndex] : 'No description'
      
      if (!isNaN(date.getTime()) && !isNaN(amount)) {
        expenseData.push({
          date: date.toISOString().split('T')[0], // 'YYYY-MM-DD' format
          amount: amount,
          description: description
        })
      }
    }
  }

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

  const maxSize = 10 * 1024 * 1024 // 10MB limit
  if (file.size > maxSize) {
    return { isValid: false, error: 'File too large. Please upload a file smaller than 10MB.' }
  }

  return { isValid: true, error: null }
}
