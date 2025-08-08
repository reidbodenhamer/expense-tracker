import React from "react";
import { CustomTooltipProps } from "../../types";

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  if (!data) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-3 border border-gray-300">
      <p className="text-xs font-semibold text-purple-800 mb-1">{data.label}</p>
      <p className="text-sm text-gray-600">
        Amount:{" "}
        <span className="text-sm font-medium text-gray-900">${data.value}</span>
      </p>
    </div>
  );
};

export default CustomTooltip;
