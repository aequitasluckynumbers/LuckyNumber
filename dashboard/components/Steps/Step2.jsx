import { getTimeStringBySeconds } from "@/utils/date";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Step2 = ({
  winningNumbers,
  setWinningNumbers,
  arrivalTime,
  setArrivalTime,
  duration,
  setIsDisabled,
}) => {
  const [number, setNumber] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const min = duration == 60 ? new Array(60).fill(0) : new Array(30).fill(0);
  const sec = new Array(60).fill(0);
  const numbersList = new Array(45).fill(0);

  useEffect(() => {
    if (winningNumbers.length >= 15) {
      setIsDisabled(false);
    }
  }, []);

  const handleAddNumber = () => {
    console.log(number, minutes, seconds);

    // number should be selected
    if (number == 0) {
      toast.error("Please Select a Number");
      return;
    }
    // number should be unique
    if (winningNumbers.includes(number)) {
      toast.error("Number Already added");
      return;
    }

    const currSec = minutes * 60 + parseInt(seconds);

    // if there is no winning number add without validations
    if (winningNumbers.length === 0) {
      setWinningNumbers([number]);
      setArrivalTime([currSec]);
      return;
    }

    // check if time is incremented or not
    const lastTime = arrivalTime[arrivalTime.length - 1];
    if (currSec <= lastTime) {
      toast.error("Time Should be greater than previous number arrival time");
      return;
    }

    // check if time is less than duration
    if (currSec > duration * 60) {
      toast.error("time should be less than duration" + typeof currSec);
      return;
    }

    setWinningNumbers([...winningNumbers, number]);
    setArrivalTime([...arrivalTime, currSec]);
  };

  const handleDeleteNumber = (index) => {
    const newNumArr = [...winningNumbers];
    newNumArr.splice(index, 1);
    setWinningNumbers(newNumArr);

    const newTimeArr = [...arrivalTime];
    newTimeArr.splice(index, 1);
    setArrivalTime(newTimeArr);
  };

  useEffect(() => {
    if (winningNumbers.length >= 15) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [winningNumbers]);

  return (
    <>
      <div className="max-w-fit mx-auto py-6 px-9 bg-white border rounded-2xl">
        <h3 className="text-center mb-5 s">
          2. Add number of predetermined winning cards & release time
        </h3>

        <div className="flex gap-10">
          <div className="w-1/3">
            <p className="font-semibold my-2">Add Number</p>

            {winningNumbers &&
              winningNumbers.map((number, i) => (
                <div key={number} className="flex mt-2">
                  <div className="py-2 w-1/6 !border-none my-0.5 text-left">
                    {i + 1}
                  </div>
                  <div className="input w-3/4 text-center">{number}</div>
                </div>
              ))}

            <div className="flex mt-2">
              <div className="py-2 w-1/6 !border-none my-0.5 text-left"></div>
              <select
                value={number}
                onChange={(e) => setNumber(e.target.value * 1)}
                className="input w-3/4 h-12"
              >
                <option value={0}></option>
                {numbersList.map((num, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-2/3">
            <p className="font-semibold my-2">Add Time(MM:SS)</p>

            {arrivalTime &&
              arrivalTime.map((time, i) => (
                <div key={time} className="flex gap-2 mt-2">
                  <div className="input w-3/4 text-center">
                    {getTimeStringBySeconds(time)}
                  </div>
                  <div
                    onClick={() => handleDeleteNumber(i)}
                    className="input w-1/4 text-center cursor-pointer"
                  >
                    X
                  </div>
                </div>
              ))}
            <div className="flex gap-3 w-3/4 mt-2">
              <select
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="input w-3/4 h-12"
              >
                {min.map((num, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              <select
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                className="input w-3/4 h-12"
              >
                {sec.map((num, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-center my-4">
          <button onClick={handleAddNumber} className="btn w-1/2  bg-primary">
            Add
          </button>
        </div>
      </div>
    </>
  );
};

export default Step2;
