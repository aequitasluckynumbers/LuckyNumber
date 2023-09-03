import React, { useEffect, useState } from "react";

const AnalyticsButton = ({ active, handleDuration, chart }) => {
  const [activeBtn, setActiveBtn] = useState("annually");
  const [duration, setDuration] = useState();

  const handleSubmit = (timeDuration) => {
    setActiveBtn(timeDuration);
    active(timeDuration);
    if (timeDuration === "daily") {
      const now = new Date();
      if ((chart == "gender") | (chart == "country")) {
        const d = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1
        );

        setDuration(d.getTime());
        handleDuration(d.getTime());
      } else {
        const d = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7
        );

        setDuration(d.getTime());
        handleDuration(d.getTime());
      }
    }
    if (timeDuration === "weekly") {
      const now = new Date();
      if ((chart == "gender") | (chart == "country")) {
        const d = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7
        );

        setDuration(d.getTime());
        handleDuration(d.getTime());
      } else {
        const d = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7 * 6
        );

        setDuration(d.getTime());
        handleDuration(d.getTime());
      }
    }
    if (timeDuration === "annually") {
      const now = new Date();
      const d = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 365 * 6
      );
      setDuration(d.getTime());
      handleDuration(d.getTime());
    }
  };

  useEffect(() => {
    if (activeBtn === "annually" && handleDuration) {
      handleSubmit("annually");
    }
  });

  return (
    <div className="flex gap-2">
      {activeBtn === "daily" ? (
        <button className="secondaryButtonActive">Daily</button>
      ) : (
        <button
          className="secondaryButton"
          onClick={() => handleSubmit("daily")}
        >
          Daily
        </button>
      )}
      {activeBtn === "weekly" ? (
        <button className="secondaryButtonActive">Weekly</button>
      ) : (
        <button
          className="secondaryButton"
          onClick={() => handleSubmit("weekly")}
        >
          Weekly
        </button>
      )}
      {activeBtn === "annually" ? (
        <button className="secondaryButtonActive">Annually</button>
      ) : (
        <button
          className="secondaryButton"
          onClick={() => handleSubmit("annually")}
        >
          Annually
        </button>
      )}
    </div>
  );
};

export default AnalyticsButton;
