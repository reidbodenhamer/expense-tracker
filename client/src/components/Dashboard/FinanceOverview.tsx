import React from "react";
import CustomPieChart from "../Charts/CustomPieChart";
import { ChartData, FinanceOverviewProps } from "../../types";

const FINANCE_COLORS = {
  balance: "#875cf5",    // Purple
  expenses: "#ef4444",   // Red
  income: "#22c55e",     // Green
} as const;

const FinanceOverview: React.FC<FinanceOverviewProps> = ({ 
  totalBalance, 
  totalIncome, 
  totalExpenses 
}) => {
  const balanceData: ChartData[] = [
    { label: "Balance", value: totalBalance },
    { label: "Expenses", value: totalExpenses },
    { label: "Income", value: totalIncome },
  ];

  const colors = [
    FINANCE_COLORS.balance,
    FINANCE_COLORS.expenses,
    FINANCE_COLORS.income,
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Financial Overview</h5>
      </div>

      <CustomPieChart
        data={balanceData}
        label="Total Balance"
        totalAmount={`$${totalBalance}`}
        colors={colors}
        showTextAnchor
      />
    </div>
  );
};

export default FinanceOverview;
