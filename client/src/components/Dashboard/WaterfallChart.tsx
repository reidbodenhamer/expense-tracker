import React from 'react'
import { ChartData } from "../../types"
import { BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const WaterfallChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default WaterfallChart