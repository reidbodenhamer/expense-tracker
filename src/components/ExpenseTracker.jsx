import { useState } from 'react'
import { processCSV, generateMonthlyData, validateCSVFile } from '../utils/csvProcessor'
import '../ExpenseTracker.css'

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // CSV Processing
  const handleCSVProcessing = (csvText) => {
    try {
      setIsLoading(true)
      setError(null)

      const expenseData = processCSV(csvText)
      setExpenses(expenseData)
      setMonthlyData(generateMonthlyData(expenseData))
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const processFile = (file) => {
    clearError()
    const { isValid, error } = validateCSVFile(file)
    if (!isValid) {
      handleFileError(error)
      return
    }

    setIsLoading(true)
    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      handleCSVProcessing(loadEvent.target.result)
    }
    reader.onerror = () => {
      handleFileError('Error reading file. Please try again.')
    }
    reader.readAsText(file)
  }

  // Event Handlers
  const handleFileUpload = (fileUploadEvent) => {
    const file = fileUploadEvent.target.files[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDrop = (dropEvent) => {
    dropEvent.preventDefault() // default browser behavior opens file in new tab
    dropEvent.stopPropagation()
    setDragActive(false)
    
    const file = dropEvent.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (dragOverEvent) => {
    dragOverEvent.preventDefault()
    dragOverEvent.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (dragLeaveEvent) => {
    dragLeaveEvent.preventDefault()
    dragLeaveEvent.stopPropagation()
    setDragActive(false)
  }

  // Error Management
  const handleFileError = (errorMessage) => {
    setError(errorMessage)
    setIsLoading(false)
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <div className="expense-tracker">
      <header className="expense-tracker__header">
        <h1>Personal Expense Tracker</h1>
        <p>Upload your CSV file to track your monthly spending</p>
      </header>

      <main className="expense-tracker__main">

        {/* CSV Upload Section */}
        <section className="expense-tracker__file-upload-section">
          {/* Error Message */}
          {error && (
            <div className="expense-tracker__error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <span>{error}</span>
              <button onClick={clearError} className="expense-tracker__error-close">&times;</button>
            </div>
          )}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="expense-tracker__loading">
              <div className="expense-tracker__spinner"></div>
              <span>Processing CSV file...</span>
            </div>
          )}
          
          <div
            className={`expense-tracker__upload-area${
              dragActive ? ' expense-tracker__upload-area--active' : ''
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="expense-tracker__upload-area-content">
              <svg
                className="expense-tracker__upload-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <h3>Upload CSV File</h3>
              <p>Drag and drop your expense CSV file here, or click to browse</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="expense-tracker__file-input"
                id="csvFile"
              />
              <label
                htmlFor="csvFile"
                className="expense-tracker__upload-button"
              >
                Choose File
              </label>
            </div>
          </div>
          {expenses.length > 0 && (
            <div className="expense-tracker__upload-success">
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
              <span>Successfully loaded {expenses.length} expenses</span>
            </div>
          )}
          
          {/* CSV Format Instructions - only show when no data loaded */}
          {monthlyData.length === 0 && (
            <div className="expense-tracker__format-instructions">
              <h4>CSV Format Requirements</h4>
              <p>Your CSV file should contain columns for:</p>
              <ul>
                <li><strong>Date</strong> - in any standard date format (MM/DD/YYYY, YYYY-MM-DD, etc.)</li>
                <li><strong>Amount</strong> - numerical value (with or without $ symbol)</li>
                <li><strong>Description</strong> - optional description of the expense</li>
              </ul>
            </div>
          )}
        </section>

        {/* Monthly Spending Table */}
        {monthlyData.length > 0 && (
          <section className="expense-tracker__results-section">
            <div className="expense-tracker__table-container">
              <h2>Monthly Spending Summary</h2>
              <table className="expense-tracker__spending-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Total Spent</th>
                    <th>Transactions</th>
                    <th>Average per Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((month, index) => (
                    <tr key={index}>
                      <td className="month-cell">{month.month}</td>
                      <td className="amount-cell">${month.total.toFixed(2)}</td>
                      <td className="count-cell">{month.count}</td>
                      <td className="average-cell">${(month.total / month.count).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="expense-tracker__summary-stats">
                <div className="expense-tracker__stat">
                  <span className="expense-tracker__stat-label">Total Expenses:</span>
                  <span className="expense-tracker__stat-value">
                    ${monthlyData.reduce((sum, month) => sum + month.total, 0).toFixed(2)}
                  </span>
                </div>
                <div className="expense-tracker__stat">
                  <span className="expense-tracker__stat-label">Average Monthly:</span>
                  <span className="expense-tracker__stat-value">
                    ${(monthlyData.reduce((sum, month) => sum + month.total, 0) / monthlyData.length).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default ExpenseTracker
