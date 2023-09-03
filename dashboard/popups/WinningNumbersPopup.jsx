import { getTimeStringBySeconds } from "@/utils/date";
import React from "react";

const WinningNumbersPopup = ({ numbers, setNumbers, user }) => {
  return (
    <>
      <div className="h-screen fixed w-1/3 bg-white top-0 right-0 p-10 shadow-xl overflow-y-scroll">
        <div
          onClick={() => setNumbers(null)}
          className="absolute top-5 right-5 text-2xl font-semibold cursor-pointer"
        >
          X
        </div>
        <div className="p-1 border m-1 px-5 mt-10 flex rounded border-primary">
          <p className="flex-1">Number</p>
          <p className="flex-1">Timing</p>
        </div>
        <div className="numlist ">
          {numbers.numbers.map((num, i) => (
            <div key={num} className="p-1 m-1 px-5 flex rounded border">
              <p className="flex-1">{num}</p>
              <p className="flex-1">
                {getTimeStringBySeconds(numbers.time[i])}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WinningNumbersPopup;
