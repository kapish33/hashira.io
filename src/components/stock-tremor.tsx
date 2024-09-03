"use client"

import { AreaChart } from "@/utils/chartUtils"

const chartdata = [
  { hour: "00:00", temperature: 12.8 },
  { hour: "01:00", temperature: 12.4 },
  { hour: "02:00", temperature: 12.2 },
  { hour: "03:00", temperature: 11.9 },
  { hour: "04:00", temperature: 11.7 },
  { hour: "05:00", temperature: 11.5 },
  { hour: "06:00", temperature: 11.3 },
  { hour: "07:00", temperature: 11.2 },
  { hour: "08:00", temperature: 11.5 },
  { hour: "09:00", temperature: 12.0 },
  { hour: "10:00", temperature: 13.0 },
  { hour: "11:00", temperature: 14.2 },
  { hour: "12:00", temperature: 15.5 },
  { hour: "13:00", temperature: 16.8 },
  { hour: "14:00", temperature: 17.5 },
  { hour: "15:00", temperature: 18.1 },
  { hour: "16:00", temperature: 18.2 },
  { hour: "17:00", temperature: 17.8 },
  { hour: "18:00", temperature: 17.2 },
  { hour: "19:00", temperature: 16.5 },
  { hour: "20:00", temperature: 15.8 },
  { hour: "21:00", temperature: 14.9 },
  { hour: "22:00", temperature: 14.2 },
  { hour: "23:00", temperature: 13.5 },
]

export const AreaChartWithVolume = () => (
  <AreaChart
    className="h-56"
    data={chartdata}
    index="hour"
    categories={["temperature"]}
    valueFormatter={(number: number) =>
      `${Intl.NumberFormat().format(number).toString()}°C`
    }
    yAxisWidth={40}
    startEndOnly
    connectNulls
    showLegend={false}
    showTooltip={false}
    xAxisLabel="24H Temperature Readout (Zurich)"
  />
)