import TopNav from "@/components/TopNav";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { checkPermission } from "@/utils/user/access";
import WinningNumbersPopup from "@/popups/WinningNumbersPopup";
import { ADMIN, BROADCASTER, EDITOR, VIEWER } from "@/utils/constants";
import NoAccess from "@/components/NoAccess";
import { useRouter } from "next/router";
import { getUser } from "@/utils/user/getUser";
import { checkRouteAccess } from "@/utils/user/checkRouteAccess";
import { checkServerSideRouteAccess } from "@/lib/serverSideAuth";
import { getLocalDate, getLocalTime } from "@/utils/date";
import ShowWinnersPopup from "@/popups/ShowWinnersPopup";

const CardsPage = ({ data, user, error }) => {
  const [showArr, setShowArr] = useState([]);
  // const [fetchShow, setFetchShow] = useState(0);
  const [numbers, setNumbers] = useState(null);

  const [isClient, setIsClient] = useState(false);
  const [winnerArr, setWinnerArr] = useState([]);
  const [showWinners, setShowWinners] = useState(false);

  const router = useRouter();

  const handleFetchShow = async () => {
    let showsPromise = supabase
      .from("game")
      .select()
      .order("episode_no", { ascending: false });

    if (user?.role === BROADCASTER) {
      showsPromise.eq("country", user.country);
    }

    const shows = await showsPromise;

    if (shows.error) {
      console.log(shows.error);
      toast.error("Failed to fetch the shows");
      return;
    }
    setShowArr(shows.data);
  };

  const getWinners = async (id) => {
    const { data, error } = await supabase.rpc(
      "get_players_with_winning_status",
      { gameid: id }
    );

    if (error) {
      console.error("Error getting winning player details:", error);
      return;
    }

    setWinnerArr(data);
    setShowWinners(true);
  };

  const handleRemoveShow = async (id) => {
    // const { data: accessData, error: accessError } = await checkPermission(
    //   [ADMIN, BROADCASTER],
    //   [ADMIN, EDITOR]
    // );

    if (user.subrole === VIEWER || user.role === ADMIN) {
      toast.error("Access Denied");
      return;
    }

    const { error } = await supabase.from("game").delete().eq("id", id);

    if (error) {
      console.log(error);
      toast.error("Failed to Delete Show");
      return;
    }
    toast.success("Card deleted");
    handleFetchShow();
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  // checks the data and error status and renders UI conditionally
  useEffect(() => {
    if (!router.isReady) return;

    if (error && error.status === 500) {
      router.push("/");
      toast.error("Unknown Error Occured");
      return;
    }
    handleFetchShow();
  }, [router]);

  if (error && error.status === 401) return <NoAccess />;

  if (isClient)
    return (
      <>
        <div suppressHydrationWarning className="pt-10 px-12 ">
          <TopNav title="Lucky Numbers Card" user={user} />
          {numbers && (
            <WinningNumbersPopup
              numbers={numbers}
              setNumbers={setNumbers}
              user={user}
            />
          )}

          {showWinners && (
            <ShowWinnersPopup
              users={winnerArr}
              setShowWinners={setShowWinners}
            />
          )}

          <div className="flex justify-between mt-10">
            <h2>Saved Episode</h2>
            {user?.role === BROADCASTER && (
              <Link href={"/cards/addshow"}>
                <button className="btn bg-primary">Add New Show</button>
              </Link>
            )}
          </div>

          <table suppressHydrationWarning className="table-auto w-full mt-6">
            <thead className=" bg-primary text-white font-semibold ">
              <tr className="p-4 ">
                <td className="p-4  rounded-l-md !rounded-b-none">
                  <input type="checkbox" name="" id="" />
                </td>
                <td>Episode No</td>
                <td className="p-4">Date</td>
                <td className="p-4">Time</td>
                <td className="p-4">Winning Numbers</td>
                <td className="p-4">Show Winners</td>
                {user?.role === BROADCASTER && (
                  <td suppressHydrationWarning className="p-4">
                    Edit
                  </td>
                )}
                {user?.role === BROADCASTER && (
                  <td
                    suppressHydrationWarning
                    className="p-4 rounded-r-md !rounded-b-none "
                  >
                    Remove Show
                  </td>
                )}
              </tr>
            </thead>
            <div className="p-1"></div>
            <tbody>
              {showArr &&
                showArr.map((show, i) => (
                  <tr className="cursor-pointer" key={show.episode_no}>
                    <td className="p-4">
                      <input type="checkbox" name="" id="" />
                    </td>
                    <td className="text-secondary text-sm font-medium px-5">
                      {show.episode_no}
                    </td>
                    <td className="text-primary-varient px-4">
                      {getLocalDate(show.starts_at)}
                    </td>
                    <td className="px-4">{getLocalTime(show.starts_at)}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() =>
                          setNumbers({
                            numbers: show.winning_numbers,
                            time: show.time_arr,
                          })
                        }
                        className="btn !text-primary border border-primary"
                      >
                        View Numbers
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => getWinners(show.id)}
                        className="btn !text-primary border border-primary"
                      >
                        View Winners
                      </button>
                    </td>
                    {user?.role === BROADCASTER && (
                      <td className="px-4">
                        <Link href={`/cards/${show.id}`}>
                          <button className="btn !text-primary border border-primary">
                            Edit Show
                          </button>
                        </Link>
                      </td>
                    )}
                    {user?.role === BROADCASTER && (
                      <td className="flex px-4 py-2">
                        <button
                          className="btn !text-danger border border-danger"
                          onClick={() => handleRemoveShow(show.id)}
                        >
                          Remove Show
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </>
    );
};

export default CardsPage;

export async function getServerSideProps(context) {
  return await checkServerSideRouteAccess(
    context,
    [ADMIN, BROADCASTER],
    [ADMIN, EDITOR, VIEWER]
  );
}
