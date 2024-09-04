'use client'
import { getNumberOfDataPoints, TabType, TimeIntervalsType } from "@/types/tabs";
import React, { useEffect, useState } from "react";
import StockChart from "./StockChart";
import { AreaChartWithVolume } from "./stock-tremor";
import  LineChart  from "./LineChart";
import { generateStockDataArray } from "@/utils/mockLineVolumeData";
import HireMe from "./hire-me";

interface TabsProps {
  selectedTab: TabType;
}


const CustomChart: React.FC<TabsProps> = ({ selectedTab }) => {
  // const data = generateStockDataArray(100);

  const [timeFrames,setTimeFrames] = useState<TimeIntervalsType>("1w");
  const [data, setData] = useState<any[]>(generateStockDataArray(100)); // Initial data generation


  // Handle Time change
  const handleTimeChange = (time:TimeIntervalsType ) => {
    setTimeFrames(time);
  };

   // Regenerate data whenever timeFrames changes
   useEffect(() => {
    const newData = generateStockDataArray(getNumberOfDataPoints(timeFrames));
    setData(newData);
  }, [timeFrames]);

  // console.log("timeFrames",timeFrames)

  const renderContent = () => {
    switch (selectedTab) {
      case "Summary":
        return <HireMe />;
      case "Analysis":
        return <div className="w-full p-2 relative"><StockChart /></div>;
      case "Statistics":
        return  <AreaChartWithVolume />;
      case "Chart":
        return <LineChart timeFrames={timeFrames} setTimeFrame={handleTimeChange} data={data} />;
      case "Settings":
        return <HireMe />;
      default:
        return <div>Select a tab to see content</div>;
    }
  };

  return (
    <div className="flex flex-wrap border-b-2 border-gray-200">
      {renderContent()}
    </div>
  );
};

export default CustomChart;


