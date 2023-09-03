import React, { useEffect, useState } from "react";
import AnalyticsButton from "../AnalyticsButton";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { ADMIN, CARD } from "@/utils/constants";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const WinnersChart = ({ user }) => {
  //   const [fetchData, setFetchData] = useState();
  const [cardsArr, setCardsArr] = useState();
  const [duration, setDuration] = useState();
  const [category, setCategory] = useState();
  const [activeBtn, setActiveBtn] = useState("annually");
  const [timeDuration, setTimeDuration] = useState();
  const mapArr = [0, 0, 0, 0, 0, 0, 0];

  const handleFetchData = async () => {
    let date = new Date();
    let newTimeDurationData;
    const newTimeDuration = [];
    const newCategory = [];

    if (activeBtn === "daily") {
      for (let i = 6; i >= 0; i--) {
        const newDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() - i + 1
        );
        newTimeDuration.push(newDate.toISOString());
        newCategory.push(newDate.toISOString().slice(6, 10));
      }
      newTimeDuration.push(date.toISOString());
      setTimeDuration(newTimeDuration);
      setCategory(newCategory);
      newTimeDurationData = newTimeDuration;
    } else if (activeBtn === "weekly") {
      for (let i = 6; i >= 0; i--) {
        const newDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() - i * 7 + 1
        );
        newTimeDuration.push(newDate.toISOString());
        newCategory.push(newDate.toISOString().slice(6, 10));
      }
      newTimeDuration.push(date.toISOString());
      setTimeDuration(newTimeDuration);
      setCategory(newCategory);
      newTimeDurationData = newTimeDuration;
    } else {
      for (let i = 6; i >= 0; i--) {
        const newDate = new Date(date.getFullYear() - i, 1, 1);
        newTimeDuration.push(newDate.toISOString());
        newCategory.push(newDate.toISOString().slice(0, 4));
      }
      newTimeDuration.push(date.toISOString());
      setTimeDuration(newTimeDuration);
      setCategory(newCategory);
      newTimeDurationData = newTimeDuration;
    }

    const promises = [];
    mapArr.map((item, index) => {
      const cards = supabase
        .from(CARD)
        .select("*", { count: "exact", head: true })
        .eq("is_winner", "true")
        .gte("created_at", newTimeDurationData[index])
        .lte("created_at", newTimeDurationData[index + 1]);

      // if (user && user.role != ADMIN) {
      //   cards.eq("country", user.country);
      // }
      promises.push(cards);
    });
    const cardData = await Promise.all(promises);

    const newArr = cardData.map((obj) => {
      return obj.count;
    });
    setCardsArr(newArr);
  };

  useEffect(() => {
    handleFetchData();
    const interval = setInterval(() => {}, 12000);
    return () => clearInterval(interval);
  }, [user, activeBtn]);

  const totalCards = {
    options: {
      chart: {
        id: "area",
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: category,
      },
    },
    series: [
      {
        name: "Cards",
        data: cardsArr,
      },
    ],
  };

  return (
    <>
      <div className="w-11/12 m-auto mt-2 profile flex gap-2 items-center justify-between content-center">
        <h3>Winners</h3>
        <AnalyticsButton
          handleDuration={(e) => setDuration(e)}
          active={(active) => setActiveBtn(active)}
        />
      </div>
      <Chart
        options={totalCards.options}
        series={totalCards.series}
        type="area"
        width="100%"
        height="90%"
      />
    </>
  );
};

export default WinnersChart;
