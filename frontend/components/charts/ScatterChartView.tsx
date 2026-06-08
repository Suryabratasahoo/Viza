"use client";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export default function ScatterChartView({
  chart,
  data
}: any) {

  if (!chart?.x || !chart?.y) {
    return null;
  }

  const yKey = Array.isArray(chart.y)
    ? chart.y[0]
    : chart.y;

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />

          <XAxis
            type="number"
            dataKey={chart.x}
            name={chart.x}
          />

          <YAxis
            type="number"
            dataKey={yKey}
            name={yKey}
          />

          <Tooltip />

          <Scatter
            data={data}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}