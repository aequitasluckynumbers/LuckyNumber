import { supabase } from "@/lib/supabase";
import { IMAGE_BASE_URL } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Step4 = ({ setIsDisabled, prizes, setPrizes }) => {
  const [media, setMedia] = useState(null);

  const addPrizes = async () => {
    if (media == null) {
      return toast.error("Please Select Prize image");
    }

    const timestamp = Date.now();

    const { data, error } = await supabase.storage
      .from("prizes")
      .upload(`${timestamp}-${media.name}`, media);

    if (error) {
      return toast.error("Failed to upload Image");
    }

    setPrizes([...prizes, data.path]);
    toast.success("Image Uploaded Successfully");
  };

  const handleDeletePrize = (index) => {
    const newPrizes = [...prizes];
    newPrizes.splice(index, 1);
    setPrizes(newPrizes);
  };

  useEffect(() => {
    setIsDisabled(false);
  }, []);
  return (
    <div className="">
      <h2 className="text-center">Add Prizes</h2>
      <div className="flex gap-6">
        <div className="card w-1/3 mx-auto mt-10 border rounded-2xl px-6 py-8">
          {prizes.map((prize, i) => (
            <div key={prize} className="flex gap-2 mt-2">
              <img
                className="h-14  w-full object-contain my-2"
                src={`${IMAGE_BASE_URL}/prizes/${prize}`}
                alt=""
              />
              <div
                onClick={() => handleDeletePrize(i)}
                className="input w-11 text-center cursor-pointer h-11 mt-2"
              >
                X
              </div>
            </div>
          ))}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMedia(e.target.files[0])}
            className="input w-full mt-5"
          />
          <button onClick={addPrizes} className="btn bg-primary my-5 w-full">
            Add Prize
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4;
