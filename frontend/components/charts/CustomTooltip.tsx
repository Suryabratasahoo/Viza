const CustomTooltip = ({
  active,
  payload,
  chart
}: any) => {

  if (
    active &&
    payload &&
    payload.length
  ) {

    const row = payload[0].payload;

    const labelKey = chart.labels;
    const valueKey = chart.values;

    return (
      <div className="bg-white border rounded-lg shadow p-3">

        <p className="font-semibold">
          {String(row[labelKey])}
        </p>

        <p>
          {String(row[valueKey])}
        </p>

      </div>
    );
  }

  return null;
};

export default CustomTooltip;