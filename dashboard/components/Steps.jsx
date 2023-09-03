import Image from "next/image";
import React from "react";

const Steps = ({ step }) => {
  //   const [step, setStep] = useState(0);

  return (
    <>
      <div className="my-10 flex justify-center items-center">
        <div
          className={`circle ${
            step >= 0 ? "border-primary" : ""
          } cursor-pointer border h-8 w-8 rounded-full flex justify-center items-center`}
        >
          {step == 0 && <div className="h-3 w-3 bg-primary rounded-full"></div>}
          {step > 0 && (
            <div className="w-full h-full bg-primary rounded-full flex justify-center items-center">
              <Image
                src={"/icons/check.png"}
                className="p-1 "
                width={25}
                height={25}
                alt=""
              />
            </div>
          )}
        </div>
        <div
          className={`line w-10 border ${step > 0 ? "border-primary" : ""}`}
        ></div>

        <div
          className={`circle ${
            step >= 1 ? "border-primary" : ""
          } cursor-pointer border h-8 w-8 rounded-full flex justify-center items-center`}
        >
          {step == 1 && <div className="h-3 w-3 bg-primary rounded-full"></div>}
          {step > 1 && (
            <div className="w-full h-full bg-primary rounded-full flex justify-center items-center">
              <Image
                src={"/icons/check.png"}
                className="p-1 "
                width={25}
                height={25}
                alt=""
              />
            </div>
          )}
        </div>

        <div
          className={`line w-10 border ${step > 1 ? "border-primary" : ""}`}
        ></div>
        <div
          className={`circle ${
            step >= 2 ? "border-primary" : ""
          } cursor-pointer border h-8 w-8 rounded-full flex justify-center items-center`}
        >
          {step == 2 && <div className="h-3 w-3 bg-primary rounded-full"></div>}
          {step > 2 && (
            <div className="w-full h-full bg-primary rounded-full flex justify-center items-center">
              <Image
                src={"/icons/check.png"}
                className="p-1 "
                width={25}
                height={25}
                alt=""
              />
            </div>
          )}
        </div>
        <div
          className={`line w-10 border ${step > 2 ? "border-primary" : ""}`}
        ></div>
        <div
          className={`circle ${
            step >= 3 ? "border-primary" : ""
          } cursor-pointer border h-8 w-8 rounded-full flex justify-center items-center`}
        >
          {step == 3 && <div className="h-3 w-3 bg-primary rounded-full"></div>}
          {step > 3 && (
            <div className="w-full h-full bg-primary rounded-full flex justify-center items-center">
              <Image
                src={"/icons/check.png"}
                className="p-1 "
                width={25}
                height={25}
                alt=""
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Steps;
