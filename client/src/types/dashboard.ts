import { Expense, Income, RecentTransaction } from './transactions';

export interface DashboardData {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  last30DaysExpenses: {
    total: number;
    transactions: Expense[];
  };
  last60DaysIncome: {
    total: number;
    transactions: Income[];
  };
  recentTransactions: RecentTransaction[];
}

export interface FinanceOverviewProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface RecentTransactionsProps {
  transactions: RecentTransaction[];
  onSeeMore: () => void;
}

export interface ExpenseTransactionsProps {
  transactions: Expense[];
  onSeeMore: () => void;
}

export interface IncomePieChartProps {
  data: Income[];
  totalIncome: number;
}

export interface RecentIncomeProps {
  transactions: Income[];
  onSeeMore: () => void;
}