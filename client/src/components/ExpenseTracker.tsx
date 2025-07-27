import React, { useState, ChangeEvent, DragEvent } from 'react';
import { processCSV, generateMonthlyData, validateCSVFile, MonthlyData } from '../utils/csvProcessor';
import { Expense } from '../types';

function ExpenseTracker(): React.JSX.Element {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCSVProcessing = (csvText: string): void => {
    try {
      setIsLoading(true);
      setError(null);

      const expenseData = processCSV(csvText);
      setExpenses(expenseData);
      setMonthlyData(generateMonthlyData(expenseData));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const processFile = (file: File): void => {
    clearError();
    const { isValid, error } = validateCSVFile(file);
    if (!isValid) {
      handleFileError(error || 'Unknown validation error');
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (loadEvent: ProgressEvent<FileReader>): void => {
      if (loadEvent.target?.result && typeof loadEvent.target.result === 'string') {
        handleCSVProcessing(loadEvent.target.result);
      }
    };
    reader.onerror = (): void => {
      handleFileError('Error reading file. Please try again.');
    };
    reader.readAsText(file);
  };

  // Event Handlers
  const handleFileUpload = (fileUploadEvent: ChangeEvent<HTMLInputElement>): void => {
    const file = fileUploadEvent.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (dropEvent: DragEvent<HTMLDivElement>): void => {
    dropEvent.preventDefault(); // default browser behavior opens file in new tab
    dropEvent.stopPropagation();
    setDragActive(false);
    
    const file = dropEvent.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (dragOverEvent: DragEvent<HTMLDivElement>): void => {
    dragOverEvent.preventDefault();
    dragOverEvent.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (dragLeaveEvent: DragEvent<HTMLDivElement>): void => {
    dragLeaveEvent.preventDefault();
    dragLeaveEvent.stopPropagation();
    setDragActive(false);
  };

  // Error Management
  const handleFileError = (errorMessage: string): void => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const clearError = (): void => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Personal Expense Tracker</h1>
        <p className="text-lg text-gray-600">Upload your CSV file to track your monthly spending</p>
      </header>

      <main className="w-full flex flex-col items-center max-w-6xl">

        {/* CSV Upload Section */}
        <section className="w-full mb-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3 text-red-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <span className="flex-1">{error}</span>
              <button 
                onClick={clearError} 
                className="text-red-500 hover:text-red-700 text-xl leading-none"
              >
                &times;
              </button>
            </div>
          )}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3 text-blue-700">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Processing CSV file...</span>
            </div>
          )}
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900">Upload CSV File</h3>
              <p className="text-gray-600">Drag and drop your expense CSV file here, or click to browse</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csvFile"
              />
              <label
                htmlFor="csvFile"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Choose File
              </label>
            </div>
          </div>
          {expenses.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4 flex items-center gap-3 text-green-700">
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className="flex-shrink-0"
              >
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
              <span>Successfully loaded {expenses.length} expenses</span>
            </div>
          )}
          
          {/* CSV Format Instructions - only show when no data loaded */}
          {monthlyData.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">CSV Format Requirements</h4>
              <p className="text-gray-600 mb-3">Your CSV file should contain columns for:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-gray-900">Date</span>
                  <span>- in any standard date format (MM/DD/YYYY, YYYY-MM-DD, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-gray-900">Amount</span>
                  <span>- numerical value (with or without $ symbol)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-gray-900">Description</span>
                  <span>- optional description of the expense</span>
                </li>
              </ul>
            </div>
          )}
        </section>

        {/* Monthly Spending Table */}
        {monthlyData.length > 0 && (
          <section className="w-full">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Monthly Spending Summary</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average per Transaction</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {monthlyData.map((month: MonthlyData, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{month.month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">${month.total.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{month.count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${(month.total / month.count).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Total Expenses:</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${monthlyData.reduce((sum: number, month: MonthlyData) => sum + month.total, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Average Monthly:</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${(monthlyData.reduce((sum: number, month: MonthlyData) => sum + month.total, 0) / monthlyData.length).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ExpenseTracker;
