import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

import CustomTooltip from "./CustomTooltip";

const COLORS = [
  "#4F46E5",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6"
];

type ChartProps = {
  values: string;
  names: string;
};

export default function PieChartView({
  chart,
  data
}: {
  chart: ChartProps;
  data: Array<Record<string, unknown>>;
}) {

  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <PieChart>
        <Pie
          data={data}
          dataKey={chart.values}
          nameKey={chart.names}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                COLORS[
                  index % COLORS.length
                ]
              }
            />
          ))}
        </Pie>

        <Tooltip
          content={
            <CustomTooltip
              chart={chart}
            />
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
}