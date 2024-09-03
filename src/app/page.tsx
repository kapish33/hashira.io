"use client";
import CustomChart from "@/components/custom-chart";
import BlurIn from "@/components/magicui/blur-in";
import NumberTicker from "@/components/magicui/number-ticker";
import Tabs from "@/components/tabs";
import { tabs, TabType } from "@/types/tabs";
import { useState } from "react";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<TabType>('Chart');

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab);
  };
  return (
    <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-red-">
      {/* Price Section $$ */}
      <div className="flex">
        <BlurIn word={"63,179.71"} className="text-7xl text-primary" />
        <BlurIn
          word={"USD"}
          className="md:!text-2xl !text-lg text-primary ps-2 !opacity-40"
        />
      </div>
      {/* Increasing Stock Section */}
      <div className="!text-green-600">+ <NumberTicker className="!text-green-600"  value={2_161.42} /> (3.54%)</div>

      {/* Various Chart OPTIONS */}
      <Tabs tabs={[...tabs]} selectedTab={selectedTab} onTabChange={handleTabChange} />

      {/* Based On Selected Tab Show Chart */}
      <CustomChart selectedTab={selectedTab} />
    </section>
  );
}
