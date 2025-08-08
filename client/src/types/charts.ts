export interface ChartData {
  label: string;
  value: number;
  date?: Date;
}

export interface CustomPieChartProps {
  data: ChartData[];
  label?: string;
  totalAmount?: string;
  colors?: string[];
  showTextAnchor?: boolean;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

export interface CustomLegendProps {
    payload?: Array<{
        payload: ChartData;
        color: string;
        value: number;
    }>;
}
