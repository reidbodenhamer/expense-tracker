import React from "react";
import { ChartData } from "../../types";
import { 
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Bar,
    Cell,
    Tooltip,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const CustomBarChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
    const getBarColor = (index: number): string => {
        return index % 2 === 0 ? "#875cf5" : "#cfbefb";
    }
  return (
    <div className="bg-white mt-6">
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid stroke="none" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
                <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill="#ff8042"
                  radius={[10, 10, 0, 0]}
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={getBarColor(index)} />
                  ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
};

export default CustomBarChart;
