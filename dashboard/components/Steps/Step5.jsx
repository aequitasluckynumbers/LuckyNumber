import React from "react";

const Step5 = ({ values }) => {
  return (
    <>
      <div className="w-1/2 border rounded-2xl mx-auto p-10 flex flex-col gap-5 justify-center items-center">
        <div className="circle w-24 h-24 rounded-full bg-green-300 "></div>

        <h3>Winning Numbers Have Been Added!</h3>

        <div className=" border p-5 w-full rounded-lg flex justify-center flex-wrap gap-5 ">
          {values.winning_numbers &&
            values.winning_numbers.map((item, index) => {
              return (
                <span key={index} className="font-semibold">
                  {item}
                </span>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Step5;
