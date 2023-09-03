import Image from "next/image";
import React from "react";

const Custom404 = () => {
  return (
    <>
      <div className="gradient-background h-screen fixed w-screen left-0 top-0 flex flex-col justify-center items-center">
        <h1 className="text-[#FF00FF] text-9xl">404</h1>
        <p className="text-4xl text-sky-400">This page does not exist!</p>

        <Image className="absolute bottom-5" width={100} height={100} src={"/images/logo.png"} alt="" />
      </div>
    </>
  );
};

export default Custom404;
