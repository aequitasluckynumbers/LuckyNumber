import NoAccess from "@/components/NoAccess";
import TopNav from "@/components/TopNav";
import { checkServerSideRouteAccess } from "@/lib/serverSideAuth";
import { supabase } from "@/lib/supabase";
import SponsorPopup from "@/popups/SponsorPopup";
import {
  ADMIN,
  ADVERT,
  BROADCASTER,
  EDITOR,
  IMAGE_BASE_URL,
  SPONSOR,
  SPONSOR_ADVERT,
  VIEWER,
} from "@/utils/constants";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SponsorsPage = ({ data, user, error }) => {
  const router = useRouter();
  const [sponsors, setSponsors] = useState([]);
  const [adverts, setAdverts] = useState([]);
  const [media, setMedia] = useState(null);

  const [sponsorPopup, setSponsorPopup] = useState(false);

  const fetchSponsors = async () => {
    const { data, error } = await supabase
      .from(SPONSOR_ADVERT)
      .select("*")
      .eq("type", SPONSOR)
      .eq("country", user?.country ? user?.country : "india")
      .order("rank", { ascending: true });
    if (error) {
      console.log(error);
      return toast.error("Failed to fetch Sponsors");
    }
    console.log(data);
    setSponsors(data);
  };

  const fetchAdverts = async () => {
    // TODO: check if it is admin and bypass country

    console.log(user?.country);
    const { data, error } = await supabase
      .from(SPONSOR_ADVERT)
      .select("*")
      .eq("type", ADVERT)
      .eq("country", user?.country ? user?.country : "india");

    if (error) {
      console.log(error);
      return toast.error("Failed to fetch Adverts");
    }

    setAdverts(data);
  };

  const uploadAdvert = async () => {
    if (!media) {
      toast.error("Please Select an Image");
      return;
    }
    const timestamp = Date.now();
    console.log(media);
    const { data, error } = await supabase.storage
      .from("adverts")
      .upload(`${timestamp}-${media.name}`, media);

    if (error) {
      return toast.error("Failed to upload Image");
    }
    console.log(data);

    const advertRes = await supabase.from(SPONSOR_ADVERT).insert({
      rank: adverts.length + 1,
      image: data.path,
      country: user.country,
      type: ADVERT,
    });

    if (advertRes.error) {
      return toast.error("Failed to Add Advert");
    }

    console.log(advertRes.data);
    fetchAdverts();
    toast.success("Advert Added Successfully");
  };

  const removeAdvert = async (id) => {
    const { error } = await supabase.from(SPONSOR_ADVERT).delete().eq("id", id);

    if (error) {
      console.log(error);
      return toast.error("Failed To Delete Advert");
    }
    fetchAdverts();
    toast.success("Advert Deleted Successfully");
  };

  const removeSponsor = async (id) => {
    const { error } = await supabase.from(SPONSOR_ADVERT).delete().eq("id", id);

    if (error) {
      console.log(error);
      return toast.error("Failed To Delete Sponsor");
    }
    fetchSponsors();
    toast.success("Sponsor Deleted Successfully");
  };

  // checks the data and error status and renders UI conditionally
  useEffect(() => {
    if (!router.isReady) return;

    if (error && error.status === 500) {
      router.push("/");
      toast.error("Unknown Error Occured");
      return;
    }
    fetchAdverts();
    fetchSponsors();
  }, [router]);

  if (error && error.status === 401) return <NoAccess />;

  return (
    <>
      <div className="pt-10 px-12 ">
        <TopNav title="Sponsors & Adverts" user={user} />

        <div className="flex justify-between h-full my-10">
          <div className="w-1/2 relative  py-10 pr-10 ">
            {sponsorPopup && (
              <SponsorPopup
                user={user}
                fetchSponsors={fetchSponsors}
                setSponsorPopup={setSponsorPopup}
              />
            )}
            <div className="flex justify-between">
              <h2 className="mb-10">Current Sponsors</h2>
              <button
                onClick={() => setSponsorPopup(true)}
                className="bg-primary btn h-fit"
              >
                Add Sponsor
              </button>
            </div>
            <table className="table-auto w-full mt-6">
              <thead className="bg-primary text-white font-semibold">
                <tr className="p-4">
                  <td className="p-4 rounded-l-md !rounded-b-none">Rank</td>
                  <td className="">Name</td>
                  <td>Logo</td>
                  <td>Actions</td>
                </tr>
              </thead>
              <tbody>
                {sponsors.map((sponsor, i) => (
                  <tr key={sponsor.id} className="border-b">
                    <td className="text-secondary p-4 font-medium">
                      {sponsor.rank}
                    </td>
                    <td className="text-secondary font-medium">
                      {sponsor.name}
                    </td>
                    <td className="text-primary-varient ">
                      <img
                        className="h-12 w-20 object-contain"
                        src={`${IMAGE_BASE_URL}/sponsors/${sponsor.image}`}
                        alt=""
                      />
                    </td>
                    <td className="text-primary-varient ">
                      <div className="flex gap-2 cursor-pointer">
                        {/* <p>Edit</p> */}
                        <p
                          className="font-semibold text-danger"
                          onClick={() => removeSponsor(sponsor.id)}
                        >
                          Remove
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="max-h-screen w-0.5 bg-black"></div>
          <div className="w-1/2   p-10 ">
            <h2 className="mb-10">Live Adverts</h2>

            {adverts.map((advert) => (
              <div className="border my-1 p-2 rounded-md flex" key={advert.id}>
                <img
                  className="h-12 w-2/3 object-contain"
                  src={`${IMAGE_BASE_URL}/adverts/${advert.image}`}
                  alt=""
                />
                <button
                  onClick={() => removeAdvert(advert.id)}
                  className="w-1/3 btn border !border-danger !text-danger mx-5"
                >
                  Remove
                </button>
              </div>
            ))}

            <h3 className="my-10">Add Advert</h3>
            <input
              onChange={(e) => setMedia(e.target.files[0])}
              className="input"
              type="file"
              accept="image/png"
            />
            <br />
            <button onClick={uploadAdvert} className=" btn bg-primary my-3">
              Add Advert
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SponsorsPage;

export async function getServerSideProps(context) {
  return await checkServerSideRouteAccess(
    context,
    [ADMIN, BROADCASTER],
    [ADMIN, EDITOR]
  );
}
