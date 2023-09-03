import Steps from "@/components/Steps";
import Step1 from "@/components/Steps/Step1";
import Step2 from "@/components/Steps/Step2";
import Step3 from "@/components/Steps/Step3";
import TopNav from "@/components/TopNav";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { getUser } from "@/utils/user/getUser";
import { ADMIN, BROADCASTER, EDITOR, VIEWER } from "@/utils/constants";
import { checkPermission } from "@/utils/user/access";
import NoAccess from "@/components/NoAccess";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { checkServerSideRouteAccess } from "@/lib/serverSideAuth";
import Step4 from "@/components/Steps/Step4";
import Step5 from "@/components/Steps/Step5";

const AddShow = ({ data, error, user }) => {
  const router = useRouter();

  const [step, setStep] = useState(0);

  const [dateTime, setDateTime] = useState(new Date());
  const [duration, setDuration] = useState(60);
  const [winningNumbers, setWinningNumbers] = useState([]);
  const [arrivalTime, setArrivalTime] = useState([]);
  const [odd, setOdd] = useState(10);
  const [pool, setPool] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const [prizes, setPrizes] = useState([]);

  const checkIsComplete = () => {
    console.log({ winningNumbers });
    let isError = false;
    const row1 = [2, 3, 4, 7, 8, 9, 12, 13, 14];
    const row2 = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    const row3 = [32, 33, 34, 37, 38, 39, 42, 43, 44];
    const corner_row_1 = [1, 5, 6, 10, 11, 15];
    const corner_row_3 = [31, 35, 36, 40, 41, 45];

    const winning_row1 = row1.filter((val) => winningNumbers.includes(val));
    const winning_row2 = row2.filter((val) => winningNumbers.includes(val));
    const winning_row3 = row3.filter((val) => winningNumbers.includes(val));
    const winning_corner_row_1 = corner_row_1.filter((val) =>
      winningNumbers.includes(val)
    );
    const winning_corner_row_3 = corner_row_3.filter((val) =>
      winningNumbers.includes(val)
    );

    if (winning_corner_row_1.length < 2) {
      toast.error("Missing numbers for top corners");
      isError = true;
    }

    if (winning_corner_row_3.length < 2) {
      toast.error("Missing numbers for bottom corners");
      isError = true;
    }

    if (winning_row1.length < 3) {
      toast.error("Missing numbers for top row except corners");
      isError = true;
    }

    if (winning_row3.length < 3) {
      toast.error("Missing numbers for bottom row except corners");
      isError = true;
    }

    if (winning_row2.length < 5) {
      toast.error("Missing numbers for middle row");
      isError = true;
    }

    if (!isError) {
      setStep(step + 1);
    }
  };

  const handleGoNext = async () => {
    if (step === 4) {
      router.back();
    } else if (step === 1) {
      checkIsComplete();
    } else if (step === 3) {
      handleSaveGame();
    } else {
      setStep(step + 1);
    }
    if (step !== 1) {
      setIsDisabled(true);
    }
  };

  const handleGoBack = () => {
    if (step == 0) {
      router.back();
    } else {
      setStep(step - 1);
    }
  };

  const handleSaveGame = async () => {
    // check user permissions
    const { error: accessError } = await checkPermission(
      "cards",
      [ADMIN, BROADCASTER],
      [ADMIN, EDITOR]
    );

    // no permission
    if (accessError) {
      console.log(accessError);
      toast.error("Access Denied");
      return;
    }

    // have permission to add or update card
    const gameData = {
      starts_at: dateTime,
      duration: duration,
      winning_numbers: winningNumbers,
      time_arr: arrivalTime,
      odds: odd,
      pool: pool,
      country: user.country,
      prizes: prizes,
    };

    if (isUpdate) {
      const { error } = await supabase
        .from("game")
        .update(gameData)
        .eq("id::text", data.id);

      if (error) {
        toast.error("Failed to Update the game");
        return;
      }

      toast.success("Game Updated Successfully");
      router.push("/cards");
    } else {
      const { data, error } = await supabase.from("game").insert([gameData]);
      if (error) {
        toast.error("Failed to Save the game");
        return;
      }

      toast.success("Game Added Successfully");
      router.push("/cards");
    }
  };

  // checks the data and error status and renders UI conditionally
  useEffect(() => {
    if (!router.isReady) return;

    if (error && error.status === 404) {
      console.log(error);
      router.push("/cards");
      toast.error("No Game Found");
      return;
    }

    if (error && error.status === 500) {
      router.push("/cards");
      toast.error("Unknown Error Occured");
      return;
    }

    if (data) {
      setDateTime(new Date(data.starts_at));
      setDuration(data.duration);
      setWinningNumbers(data.winning_numbers);
      setArrivalTime(data.time_arr);
      setOdd(data.odds);
      setPool(data.pool);
      setPrizes(data.prizes);
      setIsUpdate(true);
      console.log(data, error);
    } else {
      setIsUpdate(false);
    }
  }, [router]);

  if (error && error.status === 401) return <NoAccess />;

  return (
    <>
      <div className="pt-10 px-12 ">
        <TopNav title="Lucky Numbers Card" user={user} />

        <div className="flex justify-between mt-10">
          <div className="flex gap-6">
            <Image
              onClick={handleGoBack}
              src={"/icons/back.png"}
              className="h-7 object-contain cursor-pointer"
              width={30}
              height={30}
              alt=""
            />
            <h2>Add New Show</h2>
          </div>
          <button
            disabled={isDisabled}
            onClick={handleGoNext}
            className="btn bg-primary disabled:bg-opacity-40 "
          >
            {step < 4 && "Save & Next"}
            {step == 4 && "Back To Dashboard"}
          </button>
        </div>
        <Steps step={step} />

        <div>
          {step === 0 && (
            <Step1
              dateTime={dateTime}
              setDateTime={setDateTime}
              duration={duration}
              setDuration={setDuration}
              setIsDisabled={setIsDisabled}
              user={user}
            />
          )}
          {step === 1 && (
            <Step2
              duration={duration}
              winningNumbers={winningNumbers}
              setWinningNumbers={setWinningNumbers}
              arrivalTime={arrivalTime}
              setArrivalTime={setArrivalTime}
              setIsDisabled={setIsDisabled}
            />
          )}
          {step === 2 && (
            <Step3
              odd={odd}
              setOdd={setOdd}
              pool={pool}
              setPool={setPool}
              setIsDisabled={setIsDisabled}
            />
          )}
          {step === 3 && (
            <Step4
              setIsDisabled={setIsDisabled}
              prizes={prizes}
              setPrizes={setPrizes}
            />
          )}
          {step === 4 && <Step5 />}
        </div>
      </div>
    </>
  );
};

export default AddShow;

export async function getServerSideProps(context) {
  async function fetchData() {
    // check if id is add show if yes send null data
    const id = context.query.id;
    if (id === "addshow") {
      return null;
    }

    // fetch game
    const { data, error } = await supabase
      .from("game")
      .select("*")
      .eq("id::text", id);

    if (error) {
      return null;
    }
    return data[0];
  }

  return await checkServerSideRouteAccess(
    context,
    [ADMIN, BROADCASTER],
    [ADMIN, EDITOR],
    fetchData
  );
}
