import { IntelligenceForecastChart } from "../IntelligenceForecastChart";

export function ForecastSection({
  data,
  yearData,
  allTimeData,
}: {
  data: any;
  yearData: any;
  allTimeData: any;
}) {
  return (
    <section>
      <IntelligenceForecastChart
        data={data}
        yearData={yearData}
        allTimeData={allTimeData}
      />
    </section>
  );
}
