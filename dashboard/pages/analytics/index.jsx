import TopNav from "@/components/TopNav";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import AnalyticsButton from "@/components/AnalyticsButton";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";
import GenderChart from "@/components/Charts/GenderChart";
import CountryChart from "@/components/Charts/CountryChart";
import NoAccess from "@/components/NoAccess";
import { useRouter } from "next/router";
import { checkServerSideRouteAccess } from "@/utils/user/checkRouteAccess";
import TotalCardsChart from "@/components/Charts/TotalCardsChart";
import WinnersChart from "@/components/Charts/WinnersChart";

const AnalyticsPage = ({ user, error }) => {
  const router = useRouter();

  // checks the data and error status and renders UI conditionally
  useEffect(() => {
    if (!router.isReady) return;

    if (error && error.status === 500) {
      router.push("/");
      toast.error("Unknown Error Occured");
      return;
    }
  }, [router]);

  if (error && error.status === 401) return <NoAccess />;

  return (
    <>
      <div className="pt-10 px-12 ">
        <TopNav title="Analytics" user={user} />

        <div className="mt-5 h-[50vh] flex gap-6">
          <div className="w-1/2 rounded-2xl  bg-white border">
            <GenderChart user={user} />
          </div>
          <div className="w-1/2 rounded-2xl  bg-white border">
            <TotalCardsChart user={user} />
          </div>
        </div>
        <div className="mt-5 h-[50vh] flex gap-6">
          <div className="w-1/2 rounded-2xl  bg-white border">
            <WinnersChart user={user} />
          </div>
          <div className="w-1/2 rounded-2xl  bg-white border">
            <CountryChart user={user} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;

// export async function getServerSideProps(context) {
//   return await checkServerSideRouteAccess(
//     context,
//     [ADMIN, BROADCASTER],
//     [ADMIN, EDITOR]
//   );
// }
