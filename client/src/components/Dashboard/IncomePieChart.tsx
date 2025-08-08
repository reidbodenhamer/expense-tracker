import React, { useEffect, useState } from 'react'
import { ChartData, Income, IncomePieChartProps } from "../../types"
import CustomPieChart from "../Charts/CustomPieChart"

const COLORS = [ "#875cf5", "#fa2c37", "#ff6900", "#4f39f6" ];

const IncomePieChart: React.FC<IncomePieChartProps> = ({ data, totalIncome }) => {
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        const result = prepareChartData(data);
        setChartData(result);
    }, [data]);

    const prepareChartData = (data: Income[]): ChartData[] => {
        const chartData = data
            .filter(
                (income): income is Income =>
                    income !== null && income !== undefined
            )
            .map((income) => ({
                label: income.source || "Uncategorized Income",
                value: income.amount || 0 
            }));
            return chartData;
    }
  return (
    <div className="card">
        <div className="flex items-center justify-between">
            <h5 className="text-lg">Last 60 Days Income</h5>
        </div>

        <CustomPieChart
          data={chartData}
          label="Total Income"
          totalAmount={`$${totalIncome}`}
          showTextAnchor
          colors={COLORS}
        />
    </div>
  )
}

export default IncomePieChart