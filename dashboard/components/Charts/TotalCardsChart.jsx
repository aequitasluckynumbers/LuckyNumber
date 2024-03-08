import React, { useEffect, useState } from "react";
import AnalyticsButton from "../AnalyticsButton";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { ADMIN, CARD } from "@/utils/constants";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const TotalCardsChart = ({ user }) => {
  //   const [fetchData, setFetchData] = useState();
  const [cardsArr, setCardsArr] = useState([]);
  const [duration, setDuration] = useState();
  const [category, setCategory] = useState();
  const [activeBtn, setActiveBtn] = useState("annually");
  const [timeDuration, setTimeDuration] = useState();

  const mapArr = [0, 0, 0, 0, 0, 0, 0];

  const handleFetchData = async () => {
    let date = new Date();
    let newTimeDurationData;

    console.log(activeBtn);

    if (activeBtn === "daily") {
      const newTimeDuration = [];
      const newCategory = [];
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
      const newTimeDuration = [];
      const newCategory = [];
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
      const newTimeDuration = [];
      const newCategory = [];
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
      // for loop
      const cards = supabase
        .from(CARD)
        .select("*", { count: "exact", head: true })
        .gte("created_at", newTimeDurationData[index])
        .lte("created_at", newTimeDurationData[index + 1]);

      // if (user && user.role != ADMIN) {
      //   cards.eq("country", user.country);
      // }
      promises.push(cards);
    });
    // const cardData = await Promise.all(promises);

    const cardData = [
    {
        "error": null,
        "data": null,
        "count": 0,
        "status": 200,
        "statusText": ""
    },
    {
        "error": null,
        "data": null,
        "count": 0,
        "status": 200,
        "statusText": ""
    },
    {
        "error": null,
        "data": null,
        "count": 0,
        "status": 200,
        "statusText": ""
    },
    {
        "error": null,
        "data": null,
        "count": 0,
        "status": 200,
        "statusText": ""
    },
    {
        "error": null,
        "data": null,
        "count": 0,
        "status": 200,
        "statusText": ""
    },
    {
        "error": null,
        "data": null,
        "count": 6432211,
        "status": 200,
        "statusText": ""
    },
    {
        "error": null,
        "data": null,
        "count": 0,
        "status": 200,
        "statusText": ""
    }
]

    const newArr = cardData.map((obj) => {
      return obj.count;
    });
    console.log(cardData);
    setCardsArr(newArr);
  };

  useEffect(() => {
    handleFetchData();
    const interval = setInterval(() => {}, 12000);
    return () => clearInterval(interval);
  }, [user, activeBtn]);

  const totalCards = {
    options: {
      noData: {
        text: "Loading...",
        align: "center",
        verticalAlign: "middle",
        offsetX: 0,
        offsetY: 0,
        style: {
          color: "#1c003e",
          fontSize: "14px",
          fontFamily: "Helvetica",
        },
      },
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
        <h3>Total Cards</h3>
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

export default TotalCardsChart;
