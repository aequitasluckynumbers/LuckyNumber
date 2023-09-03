import TopNav from "@/components/TopNav";
import Image from "next/image";
import CountryChart from "@/components/Charts/CountryChart";
import { USER, CARD, GAME, BROADCASTER, USERS } from "@/utils/constants";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import TotalCardsChart from "@/components/Charts/TotalCardsChart";

export default function Home({ user }) {
  const [cardData, setCardData] = useState();
  const [gameData, setGameData] = useState();
  const [winnersData, setWinnersData] = useState();
  const [male, setMale] = useState();
  const [female, setFemale] = useState();

  const handleFetchData = async () => {
    const card = supabase
      .from(CARD)
      .select("*", { head: true, count: "exact" });

    const winners = supabase
      .from(CARD)
      .select("*", { head: true, count: "exact" })
      .eq("is_winner", true);

    const games = supabase
      .from(GAME)
      .select("*", { head: true, count: "exact" });

    const male = supabase
      .from(USERS)
      .select("*", { head: true, count: "exact" })
      .eq("gender", "Male");

    const female = supabase
      .from(USERS)
      .select("*", { head: true, count: "exact" })
      .eq("gender", "Female");

    // if (user?.role === BROADCASTER) {
    //   card.eq("country", user.country);
    //   winners.eq("country", user.country);
    //   games.eq("country", user.country);
    //   male.eq("country", user.country);
    //   female.eq("country", user.country);
    // }

    const promises = [card, winners, games, male, female];

    const res = await Promise.all(promises);

    setCardData(res[0].count);
    setWinnersData(res[1].count);
    setGameData(res[2].count);
    setMale(res[3].count);
    setFemale(res[4].count);
  };

  useEffect(() => {
    handleFetchData();
    const interval = setInterval(() => {
      handleFetchData();
    }, 12000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <>
      <div className="pt-10 px-12 ">
        <TopNav title="Dashboard" user={user} />

        <div className="mt-5">
          <div className="flex gap-2">
            <div className="h-[50vh] w-3/4 border rounded-2xl bg-white p-6">
              <TotalCardsChart user={user} />
            </div>
            <div className="min-h-[50vh] w-1/4 flex flex-col gap-1">
              <div className="card h-1/3 relative rounded-2xl border bg-white p-4 pb-0">
                <p>Card Downloads - Total</p>
                <h1 className="py-2">{cardData}</h1>
                <Image
                  src={"/images/downloads.png"}
                  className="object-contain absolute bottom-5 right-5"
                  width={50}
                  height={50}
                  alt=""
                />
              </div>
              <div className="card h-1/3 relative rounded-2xl border bg-white p-4 pb-0">
                <p>Games - Total</p>
                <h1 className="py-2">{gameData}</h1>
                {/* <p className="text-red-500">2.29%</p> */}
                <Image
                  src={"/images/app.png"}
                  className="object-contain absolute bottom-5 right-5"
                  width={50}
                  height={50}
                  alt=""
                />
              </div>
              <div className="card h-1/3 relative rounded-2xl border bg-white p-4 pb-0">
                <p>No of Winners - Total</p>
                <h1 className="py-2">{winnersData}</h1>
                <Image
                  src={"/images/winners.png"}
                  className="object-contain absolute bottom-5 right-5"
                  width={50}
                  height={50}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex gap-2">
            <div className="h-[60vh] w-2/3 flex flex-col gap-2">
              <div className="h-1/2 rounded-2xl bg-white border p-6">
                <h3 className="pb-4">Current Show Statistics</h3>
                <div className="flex gap-2">
                  <div className="card border rounded-2xl p-3">
                    <p>Card Downloads</p>
                    <h1 className="pb-4 pt-1 ">{cardData}</h1>
                    {/* <p className="text-green-700 font-medium">
                      2.29 % from preview show
                    </p> */}
                  </div>
                  <div className="card border rounded-2xl p-3">
                    <p>No. of Winners</p>
                    <h1 className="pb-4 pt-1 ">{winnersData}</h1>
                    {/* <p className="text-green-700 font-medium">
                      2.29 % from preview show
                    </p> */}
                  </div>
                  <div className="card w-2/4 border rounded-2xl p-3">
                    <p>Users by Gender</p>
                    <p className="text-green-700 py-5 font-medium">
                      Male {male}
                    </p>
                    <p className="text-red-700 font-medium">Female {female}</p>
                  </div>
                </div>
              </div>
              {/* <div className="h-1/2 rounded-2xl bg-white border p-6">
                <h3>Sponsors</h3>
              </div> */}
            </div>
            <div className="h-[60vh] w-1/3 border bg-white rounded-2xl p-6">
              <CountryChart user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
