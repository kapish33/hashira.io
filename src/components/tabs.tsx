import { cn } from "@/lib/utils";
import { TabType } from "@/types/tabs";
import React from "react";
import { FadeText } from "./magicui/fade-text";

interface TabsProps {
  tabs: TabType[];
  selectedTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, selectedTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap border-b-2 border-gray-200"> 
      {tabs.map((tab) => (
        <button
          key={tab}
          className={cn("py-2 px-4 text-sm font-medium border-b-2 border-gray-200", {
            "text-gray-900 border-b-2 border-purple-700": tab === selectedTab,
            "text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-gray-300":
              tab !== selectedTab,
          })}
          onClick={() => onTabChange(tab)}
        >
          <FadeText
            direction="right"
            framerProps={{
              show: { transition: { delay: 0.4 } },
            }}
            text={tab}
          />
        </button>
      ))}
    </div>
  );
};

export default Tabs;
