import { useState } from 'react'
import '../ExpenseTracker.css'

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [dragActive, setDragActive] = useState(false)

  const CSV_DELIMITER = ','
  const CSV_NEWLINE = '\n'

  const processCSV = (csvText) => {
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
      alert('CSV must contain date and amount columns')
      return
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

    setExpenses(expenseData)
    generateMonthlyData(expenseData)
  }

  const generateMonthlyData = (expenseData) => {
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
    
    setMonthlyData(sortedMonthly)
  }

  const handleFileUpload = (fileUploadEvent) => {
    const file = fileUploadEvent.target.files[0]

    if (file && file.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = (loadEvent) => processCSV(loadEvent.target.result)
      reader.readAsText(file)
    } else {
      alert('Please upload a CSV file')
    }
  }

  const handleDrop = (dropEvent) => {
    dropEvent.preventDefault() // default browser behavior opens file in new tab
    dropEvent.stopPropagation()
    setDragActive(false)
    
    const file = dropEvent.dataTransfer.files[0]
    if (file && file.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = (loadEvent) => processCSV(loadEvent.target.result)
      reader.readAsText(file)
    } else {
      alert('Please upload a CSV file')
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

  return (
    <div className="expense-tracker">
      <header className="expense-tracker__header">
        <h1>Personal Expense Tracker</h1>
        <p>Upload your CSV file to track your monthly spending</p>
      </header>

      <main className="expense-tracker__main">

        {/* CSV Upload Section */}
        <section className="expense-tracker__file-upload-section">
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
          
          {/* CSV Format Instructions */}
          <div className="expense-tracker__format-instructions">
            <h4>CSV Format Requirements</h4>
            <p>Your CSV file should contain columns for:</p>
            <ul>
              <li><strong>Date</strong> - in any standard date format (MM/DD/YYYY, YYYY-MM-DD, etc.)</li>
              <li><strong>Amount</strong> - numerical value (with or without $ symbol)</li>
              <li><strong>Description</strong> - optional description of the expense</li>
            </ul>
          </div>
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
