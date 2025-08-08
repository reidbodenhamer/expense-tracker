import React, { useState, useEffect } from "react";
import { Expense, ChartData } from "../../types";
import CustomBarChart from "../Charts/CustomBarChart";

const Last30DaysExpenses: React.FC<{ data: Expense[] }> = ({ data }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const result = prepareChartData(data);
    setChartData(result);
  }, [data]);

  const prepareChartData = (data: Expense[]): ChartData[] => {
    const chartData = data
      .filter(
        (expense): expense is Expense =>
          expense !== null && expense !== undefined
      )
      .map((expense) => ({
        label: expense.category || "Uncategorized Expense",
        value: expense.amount || 0,
      }));

    return chartData;
  };

  return (
    <div className="card col-span-1">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 30 Days Expenses</h5>
      </div>

      <CustomBarChart data={chartData} />
    </div>
  );
};

export default Last30DaysExpenses;
