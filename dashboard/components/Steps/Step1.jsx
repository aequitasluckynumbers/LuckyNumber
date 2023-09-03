import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Step1 = ({
  dateTime,
  setDateTime,
  duration,
  setDuration,
  setIsDisabled,
  user,
}) => {
  useEffect(() => {
    if (dateTime && dateTime.toString().length > 15) {
      setIsDisabled(false);
    }
    console.log(dateTime);
  }, [dateTime]);

  const handleDateChange = (date) => {
    setDateTime(date);
  };

  return (
    <>
      <div className="w-5/12 mx-auto py-6 px-9 bg-white border rounded-2xl">
        <h3 className="text-center mb-5">
          1. Date & Timing of Upcoming Episode
        </h3>

        <div className="flex justify-between my-5 items-center">
          <p className="font-semibold">Date & Time</p>
          <DatePicker
            selected={dateTime}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={1}
            timeCaption="time"
            dateFormat="yyyy-MM-dd hh:mm aa"
            className="input"
          />
        </div>

        <div className="flex justify-between my-5 items-center">
          <p className="font-semibold">Duration</p>
          <select
            className="btn w-2/3 !text-primary input"
            name="duration"
            placeholder="Minute"
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
            }}
          >
            <option value={60}>60 Mins</option>
            <option value={30}>30 Mins</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default Step1;
