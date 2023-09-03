import React, { useEffect, useState } from "react";
import AnalyticsButton from "../AnalyticsButton";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { supabase } from "@/lib/supabase";
import { ADMIN, USERS } from "@/utils/constants";

export const CountryChart = ({ user }) => {
  const [countryArr, setCountryArr] = useState([0, 0, 0]);
  const [duration, setDuration] = useState();
  const [activeBtn, setActiveBtn] = useState();

  const fetchData = async () => {
    let date = new Date();

    if (activeBtn === "daily") {
      const newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 1
      );

      date = newDate.toISOString();
    } else if (activeBtn === "weekly") {
      const newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 7
      );

      date = newDate.toISOString();
    } else {
      const newDate = new Date(
        date.getFullYear() - 1,
        date.getMonth(),
        date.getDate()
      );

      date = newDate.toISOString();
    }

    const promises = [];

    const india = supabase
      .from(USERS)
      .select("id, country", { count: "exact", head: true })
      .eq("country", "india")
      .gte("created_at", date);

    // if (user && user.role != ADMIN) {
    //   india.eq("country", user.country);
    // }

    promises.push(india);

    const uk = supabase
      .from(USERS)
      .select("id, country", { count: "exact", head: true })
      .eq("country", "uk")
      .gte("created_at", date);

    // if (user && user.role != ADMIN) {
    //   uk.eq("country", user.country);
    // }

    promises.push(uk);

    const others = supabase
      .from(USERS)
      .select("id, country", { count: "exact", head: true })
      .eq("country", "others")
      .gte("created_at", date);

    // if (user && user.role != ADMIN) {
    //   others.eq("country", user.country);
    // }

    promises.push(others);

    const genderdata = await Promise.all(promises);

    const newArr = genderdata.map((obj) => {
      return obj.count;
    });
    setCountryArr(newArr);
  };
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {}, 12000);
    return () => clearInterval(interval);
  }, [user, activeBtn]);

  const Country = {
    options: {
      chart: {
        id: "donut",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        pie: {
          customScale: 0.8,
        },
      },
      legend: {
        position: "top",
        offsetX: 0,
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return Math.round(val) + "%";
        },
      },
      labels: ["India", "UK", "Other"],
    },
    series: countryArr,
  };

  return (
    <>
      <div className="w-11/12 m-auto my-2 profile flex gap-2 items-center justify-between content-center">
        <h3>Country</h3>
        <AnalyticsButton
          handleDuration={(e) => setDuration(e)}
          active={(active) => setActiveBtn(active)}
          chart="country"
        />
      </div>
      <Chart
        options={Country.options}
        series={Country.series}
        type="donut"
        height="100%"
      />
    </>
  );
};

export default CountryChart;
