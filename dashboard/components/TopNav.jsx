import { supabase } from "@/lib/supabase";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const TopNav = ({ title, user }) => {
  return (
    <>
      <div className="flex justify-between">
        <h1>{title}</h1>

        <div className="profile flex gap-2 items-center">
          <Image
            src={"/images/profile.png"}
            className="w-10"
            width={50}
            height={50}
            alt=""
          />
          <div className="">
            <p className="font-bold text-xs text-primary">
              Hi {user ? user.name : "Rishabh"}
            </p>
            <p className="uppercase text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNav;
