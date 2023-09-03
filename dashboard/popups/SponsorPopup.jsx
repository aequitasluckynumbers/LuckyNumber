import { supabase } from "@/lib/supabase";
import { SPONSOR, SPONSOR_ADVERT } from "@/utils/constants";
import React, { useState } from "react";
import { toast } from "react-toastify";

const SponsorPopup = ({ setSponsorPopup, fetchSponsors, user }) => {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [rank, setRank] = useState(undefined);

  const addSponsor = async (e) => {
    e.preventDefault();
    if (logo == null) {
      return toast.error("Please Select Sponsor Logo");
    }
    const timestamp = Date.now();
    const { data, error } = await supabase.storage
      .from("sponsors")
      .upload(`${timestamp}-${logo.name}`, logo);

    if (error) {
      return toast.error("Failed to upload Image");
    }
    console.log(data);

    const sponsorRes = await supabase.from(SPONSOR_ADVERT).insert({
      rank: rank,
      image: data.path,
      country: user.country,
      name: name,
      type: SPONSOR,
    });

    if (sponsorRes.error) {
      console.log(sponsorRes.error);
      return toast.error("Failed to add Sponsor");
    }

    fetchSponsors();
    toast.success("Sponsor Added Successfully");
    setSponsorPopup(false);
  };

  return (
    <>
      <div className="p-10  min-h-full bg-white w-full absolute">
        <h3 className="mb-5">Add Sponsor</h3>
        <form onSubmit={(e) => addSponsor(e)}>
          <p>Name</p>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Sponsor Name"
            className="input w-full mt-2"
          />
          <br />
          <br />

          <p>Sponsor Logo</p>
          <input
            type="file"
            required
            onChange={(e) => setLogo(e.target.files[0])}
            accept="image/png"
            placeholder="Logo"
            className="input w-full mt-2"
          />
          <br />
          <br />
          <p>Rank</p>
          <input
            type="number"
            min={1}
            max={3}
            required
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            placeholder="Rank (1-3)"
            className="input w-full mt-2"
          />
          <br />
          <br />
          <div className="flex gap-5">
            <button type="submit" className="btn bg-primary">
              Add Sponsor
            </button>
            <button
              onClick={() => setSponsorPopup(false)}
              className="btn bg-danger"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SponsorPopup;
