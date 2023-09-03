import React from "react";
import AnalyticsButton from "../AnalyticsButton";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const LiveUserChart = ({ Users }) => {
  return (
    <div className="w-1/2 rounded-2xl  bg-white border">
      <div className="w-11/12 m-auto mt-2 profile flex gap-2 items-center justify-between content-center ,">
        <h3>Live User</h3>
        <AnalyticsButton active="anually" />
      </div>
      <Chart options={Users.options} series={Users.series} type="area" />
    </div>
  );
};

export default LiveUserChart;
