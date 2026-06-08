
import BarChartView from "./BarChartView";
import LineChartView from "./LineChartView";
import PieChartView from "./PieChartView";
import ScatterChartView from "./ScatterChartView";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";


export default function ChartRenderer({
  chart,
  data
}: any) {

  switch (chart?.type.toLowerCase()) {

    case "table":
      return (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                {Object.keys(data[0]).map((col) => (
                  <th
                    key={col}
                    className="
                      border
                      border-gray-200
                      px-3
                      py-2
                      bg-gray-50
                      text-left
                      font-semibold
                    "
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map(
                (row: any, idx: number) => (
                  <tr key={idx}>
                    {Object.values(row).map(
                      (value: any, i) => (
                        <td
                          key={i}
                          className="
                            border
                            border-gray-200
                            px-3
                            py-2
                          "
                        >
                          {String(value)}
                        </td>
                      )
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      );

    case "barchart":
      return (
        <BarChartView
          chart={chart}
          data={data}
        />
      );

    case "linechart":
      return (
        <LineChartView
          chart={chart}
          data={data}
        />
      );

    case "piechart":
      return (
        <PieChartView
          chart={chart}
          data={data}
        />
      );

    case "scatterplot":
      return (
        <ScatterChartView
          chart={chart}
          data={data}
        />
      );
    case "multibarchart":

  return (
    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <BarChart
        data={data}
      >
        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey={chart.x}
        />

        <YAxis />

        <Tooltip />

        <Legend />

        {chart.y?.map(
          (
            key: string
          ) => (
            <Bar
              key={key}
              dataKey={key}
              name={key}
            />
          )
        )}

      </BarChart>
    </ResponsiveContainer>
  );

    default:
      return null;
  }
}