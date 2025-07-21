import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ExpenseTracker from './components/ExpenseTracker.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExpenseTracker />
  </StrictMode>,
)
