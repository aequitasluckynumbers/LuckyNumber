import { getTimeStringBySeconds } from "@/utils/date";
import React, { useState, useEffect } from "react";
import CSVReader from "react-csv-reader";
import { toast } from "react-toastify";
import Modal from "../Modal";

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
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(null);
  const [type, setType] = useState("1");
  const [csvUploaded, setCsvUploaded] = useState(false);

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

  const confirmDelete = (deletingIndex) => {
    setIsOpen(true);
    setIndex(deletingIndex);
  };
  const uploadFromCSV = (data = []) => {
    try {
      // Clone the state variables
      let numbers = [...winningNumbers];
      let newArray = [...arrivalTime];
      let failedUpload = false;

      if (!data.length) toast.error("Seems like your CSV is empty");
      // Process the CSV data and update the cloned arrays
      data?.forEach((item) => {
        const currSec = item.minutes * 60 + parseInt(item.seconds);

        if (numbers.includes(item.number)) {
          failedUpload = true;
          return;
        }

        if (item.number == 0) {
          failedUpload = true;
          return;
        }

        // check if time is incremented or not
        const lastTime = newArray[newArray.length - 1];
        if (currSec <= lastTime) {
          failedUpload = true;
          return;
        }

        // check if time is less than duration
        if (currSec > duration * 60) {
          failedUpload = true;
          return;
        }

        numbers.push(item.number);
        newArray.push(currSec);
      });

      if (failedUpload) {
        toast.error("Not a valid CSV file, Please check");
        failedUpload = false;
        return;
      }

      // Update the state variables with the cloned arrays
      setCsvUploaded(true);
      setWinningNumbers([...numbers]);
      setArrivalTime([...newArray]);
    } catch (error) {
      toast.error("Error uploading CSV:");
      console.error("Error uploading CSV:", error);
    }
  };

  const clearNumbers = () => {
    setWinningNumbers([]);
    setArrivalTime([]);
    if (csvUploaded) setCsvUploaded(false);
  };

  useEffect(() => {
    if (winningNumbers.length >= 15) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [winningNumbers]);

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().replace(/\W/g, "_"),
  };

  const disabledSelect = type === "2";
  const disabledClass = disabledSelect ? "disabled-select" : "";
  return (
    <>
      <Modal
        title="Do you want to delete ?"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="max-w-fit mx-auto py-6">
          <div className="flex gap-10">
            <button
              className="btn w-1/2  bg-primary"
              onClick={() => {
                handleDeleteNumber(index);
                setIndex(null);
                setIsOpen(false);
              }}
            >
              Confirm
            </button>
            <button
              className="btn w-1/2  bg-danger"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <div className="max-w-fit mx-auto py-6 px-9 bg-white border rounded-2xl">
        <h3 className="text-center mb-5 s">
          2. Add number of predetermined winning cards & release time
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex justify-start items-center">
            <div class="hdg-label-info">
              <span>Rules</span>
              <svg
                className="icon"
                height="20"
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"
                  fill="#1C274C"
                />
              </svg>
              <div class="hdg-label-popup">
                <ul>
                  <li>
                    <span>1. </span>
                    <span>The number should start from 0</span>
                  </li>
                  <li>
                    <span>2. </span>
                    <span>The numbers should be unique</span>
                  </li>
                  <li>
                    <span>3. </span>
                    <span>The time should be greater than the previous</span>
                  </li>
                  <li>
                    <span>4. </span>
                    <span>The time should be less than the duration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end	">
            <div class="flex items-center  pl-4">
              <input
                id="bordered-radio-1"
                type="radio"
                value="1"
                checked={type === "1"}
                onClick={(_) => {
                  setType("1");
                }}
                name="bordered-radio"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 accent-violet-900	"
              />
              <label
                for="bordered-radio-1"
                class="w-full py-4 ml-2 text-sm font-medium"
              >
                Add through table
              </label>
            </div>
            <div class="flex items-center  pl-4">
              <input
                onClick={(_) => {
                  setType("2");
                }}
                checked={type === "2"}
                id="bordered-radio-2"
                type="radio"
                value="2"
                name="bordered-radio"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 accent-violet-900	"
              />
              <label
                for="bordered-radio-2"
                class="w-full py-4 ml-2 text-sm font-medium"
              >
                Add from CSV
              </label>
            </div>
          </div>
        </div>

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
                className={"input w-3/4 h-12" + ` ${disabledClass}`}
                disabled={disabledSelect}
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
                    onClick={() => confirmDelete(i)}
                    className="input w-1/4 text-center cursor-pointer"
                  >
                    &#10134;
                  </div>
                </div>
              ))}
            <div className="flex gap-3 w-3/4 mt-2">
              <select
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className={"input w-3/4 h-12" + ` ${disabledClass}`}
                disabled={disabledSelect}
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
                className={"input w-3/4 h-12" + ` ${disabledClass}`}
                disabled={disabledSelect}
              >
                {sec.map((_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              {type === "1" ? (
                <div
                  onClick={handleAddNumber}
                  className="input w-1/4 text-center cursor-pointer"
                >
                  &#10133;
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {type === "2" && !csvUploaded ? (
          <div className="flex justify-center my-4 loadFiles-item">
            <CSVReader
              label="Upload from CSV"
              onFileLoaded={uploadFromCSV}
              parserOptions={papaparseOptions}
              cssClass="btn w-1/2  bg-primary"
            />
          </div>
        ) : null}
        {winningNumbers.length ? (
          <div className="flex justify-center my-4 loadFiles-item">
            <button onClick={clearNumbers} className="btn w-1/2  bg-primary">
              Clear
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Step2;
