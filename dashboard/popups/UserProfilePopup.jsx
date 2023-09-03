import React from "react";

const UserProfilePopup = ({ setPopup }) => {
  return (
    <div className="h-screen fixed w-1/3 bg-white top-0 right-0 p-10 shadow-xl">
      <div
        onClick={() => setPopup(false)}
        className="absolute top-5 right-5 text-2xl font-semibold cursor-pointer"
      >
        X
      </div>

      <h2 className="mb-14 mt-4">User Profile</h2>

      <div className="flex flex-col gap-2 my-3">
        <label>Full Name</label>
        <input
          type="text"
          id="fname"
          className="border rounded-lg outline-none px-4 py-3"
        />
      </div>
      <div className="flex flex-col gap-2 my-3">
        <label>Email</label>
        <input
          type="text"
          id="fname"
          className="border rounded-lg outline-none px-4 py-3"
        />
      </div>
      <div className="flex flex-col gap-2 my-3">
        <label>Phone Number</label>
        <input
          type="text"
          className="border rounded-lg outline-none px-4 py-3"
        />
      </div>

      <div className="flex mt-10 gap-3">
        <button className="btn bg-primary">Update Profile</button>
        <button className="btn bg-danger">Delete Account</button>
      </div>
    </div>
  );
};

export default UserProfilePopup;
