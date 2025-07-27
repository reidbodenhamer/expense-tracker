import { render, screen } from '@testing-library/react';
import ExpenseTracker from '../components/ExpenseTracker';
import { describe, expect, it } from 'vitest';

describe('ExpenseTracker Component', () => {
  it('renders without crashing', () => {
    render(<ExpenseTracker />);
    expect(screen.getByText(/Expense Tracker/i)).toBeInTheDocument();
  });

  it('shows the upload button', () => {
    render(<ExpenseTracker />);
    const uploadButton = screen.getByText(/Choose File/i);
    expect(uploadButton).toBeInTheDocument();
  });

  it('lists the csv format instructions', () => {
    render(<ExpenseTracker />);
    expect(screen.getByText(/Your CSV file should contain columns for/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Date/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Amount/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Description/i)[0]).toBeInTheDocument();
  });

  it('does not render the results section before data is uploaded', () => {
    render(<ExpenseTracker />);
    expect(screen.queryByText(/Monthly Spending Summary/i)).not.toBeInTheDocument();
  });
});
