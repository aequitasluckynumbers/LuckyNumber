import { data } from "autoprefixer";

export const getTimeStringBySeconds = (sec) => {
  let minutes = Math.floor(sec / 60);
  let seconds = sec % 60;
  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
};

export const getAge = (dob) => {
  const today = new Date().getFullYear();

  const dateOfBirth = new Date(Date.parse(dob)).getFullYear();

  const age = today - dateOfBirth;
  return age;
};

export const getLocalDate = (date) => {
  const newDate = new Date(date);

  return newDate.toLocaleDateString();
};

export const getLocalTime = (date) => {
  const newDate = new Date(date);
  return newDate.toLocaleTimeString();
};

export const getLocalDateTime = (date) => {
  if (!date) return;
  console.log(date);
  const newDate = new Date(date);
  const dateStr = newDate.toLocaleDateString();
  console.log(dateStr);
  const timeStr = newDate.toLocaleTimeString();
  console.log(timeStr);
  const dateArr = dateStr.split("/");
  const finalDate = `${dateArr[2]}-${dateArr[0].padStart(
    2,
    "0"
  )}-${dateArr[1].padStart(2, "0")}T${timeStr.slice(0, 5)}`;
  console.log(finalDate);
  return finalDate;
};
