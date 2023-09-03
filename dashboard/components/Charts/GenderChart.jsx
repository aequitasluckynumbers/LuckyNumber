import React, { useEffect, useState } from "react";
import AnalyticsButton from "../AnalyticsButton";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { ADMIN, USERS } from "@/utils/constants";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const GenderChart = ({ user }) => {
  const [genderArr, setGenderArr] = useState([0, 0, 0]);
  const [activeBtn, setActiveBtn] = useState("annually");
  const [duration, setDuration] = useState();
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

    const male = supabase
      .from(USERS)
      .select("id, gender", { count: "exact", head: true })
      .in("gender", ["male", "Male"])
      .gte("created_at", date);

    // if (user && user.role != ADMIN) {
    //   male.eq("country", user.country);
    // }

    promises.push(male);

    const female = supabase
      .from(USERS)
      .select("id, gender", { count: "exact", head: true })
      .in("gender", ["female", "Female"])
      .gte("created_at", date);

    // if (user && user.role != ADMIN) {
    //   female.eq("country", user.country);
    // }

    promises.push(female);

    const others = supabase
      .from(USERS)
      .select("id, gender", { count: "exact", head: true })
      .eq("gender", "others")
      .gte("created_at", date);

    // if (user && user.role != ADMIN) {
    //   others.eq("country", user.country);
    // }

    promises.push(others);

    const genderdata = await Promise.all(promises);

    const newArr = genderdata.map((obj) => {
      return obj.count;
    });
    setGenderArr(newArr);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    // const interval = setInterval(fetchDate, 1000);

    // return clearInterval(interval);
    fetchData();
  }, [activeBtn]);

  const Gender = {
    options: {
      plotOptions: {
        bar: {
          distributed: true,
        },
      },
      chart: {
        id: "bar",
        toolbar: {
          show: false,
        },
        stacked: true,
      },
      xaxis: {
        categories: ["Male", "Female", "Others"],
      },
      legend: {
        position: "top",
        offsetX: 260,
      },
    },
    series: [
      {
        name: "Count",
        data: genderArr,
      },
    ],
  };

  return (
    <>
      <div className="w-11/12 m-auto mt-2 profile flex gap-2 items-center justify-between content-center ,">
        <h3>Gender</h3>
        <AnalyticsButton
          handleDuration={(e) => setDuration(e)}
          active={(active) => setActiveBtn(active)}
          chart="gender"
        />
      </div>
      <Chart options={Gender.options} series={Gender.series} type="bar" />
    </>
  );
};

export default GenderChart;
