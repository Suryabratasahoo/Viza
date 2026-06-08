import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";



export default function LineChartView({
  chart,
  data
}: any) {

  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <LineChart data={data}>
        <XAxis dataKey={chart.x} />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey={chart.y[0]}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}