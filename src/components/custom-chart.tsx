'use client'
import { TabType } from "@/types/tabs";
import React from "react";
import StockChart from "./StockChart";
import { AreaChartWithVolume } from "./stock-tremor";

interface TabsProps {
  selectedTab: TabType;
}

const CustomChart: React.FC<TabsProps> = ({ selectedTab }) => {
  const renderContent = () => {
    switch (selectedTab) {
      case "Summary":
        return <div>Summary Chart Content</div>;
      case "Chart":
        return <div className="w-full p-2 relative"><StockChart /></div>;
      case "Statistics":
        return  <AreaChartWithVolume />;
      case "Analysis":
        return <div>Analysis Chart Content</div>;
      case "Settings":
        return <div>Settings Chart Content</div>;
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
