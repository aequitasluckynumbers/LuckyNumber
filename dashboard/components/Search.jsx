import React from "react";
import Image from "next/image";
import SearchIcon from "../public/icons/search.png";
import { ADMIN, BROADCASTER } from "@/utils/constants";

export const Search = ({
  age,
  setAge,
  country,
  setCountry,
  gender,
  setGender,
  fetchUserList,
  user,
}) => {
  return (
    <>
      <div className="border rounded-full flex p-2 mt-7 items-center">
        <div className="pl-8 border-r flex-1 ">
          <p className="text-black font-semibold text-sm">Main Search</p>
          <p className="text-black text-xs">Where are you want?</p>
        </div>
        <div className="pl-8 border-r flex-1 ">
          <p className="text-black font-semibold text-sm">Age</p>
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="input my-2"
          >
            <option value="">Any</option>
            <option value="16-18">16 to 18</option>
            <option value="18-24">18 to 24</option>
            <option value="24-30">24 to 30</option>
            <option value="30-40">30 to 40</option>
            <option value="40-50">40 to 50</option>
            <option value="50-60">50 to 60</option>
            <option value="61-100">61+</option>
          </select>
        </div>
        <div className="pl-8 border-r flex-1 ">
          <p className="text-black font-semibold text-sm">Country</p>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="input my-2"
          >
            <option value="">Any</option>
            <option value="india">India</option>
            <option value="america">America</option>
            <option value="uk">UK</option>
          </select>
        </div>
        <div className="pl-8  flex-1 ">
          <p className="text-black font-semibold text-sm">Gender</p>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="input my-2"
          >
            <option value="">Any</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* add search icon */}
        <div
          onClick={fetchUserList}
          className="p-6 bg-primary cursor-pointer rounded-full"
        >
          <Image src={SearchIcon} />
        </div>
      </div>
    </>
  );
};
