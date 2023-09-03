import React, { useState } from "react";
import { Formik } from "formik";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { ADMIN, BROADCASTER, EDITOR, VIEWER } from "@/utils/constants";
import { EditBroadcasterSchema } from "@/utils/validation/broadcasterSchema";

const TeamMemberPopup = ({ setPopup, member, handleFetchBroadcaster }) => {
  const [password, setPassword] = useState();

  const generatePassword = () => {
    // Create a random password
    const randomPassword =
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

    setPassword(randomPassword);
  };

  const handleAccountUpdate = async (values) => {
    try {
      const user = {
        name: values.name,
        email: values.email,
        role: BROADCASTER,
        subrole: values.subrole,
        designation: values.designation,
        access: values.access,
      };

      const { data, error } = await supabase.functions.invoke(
        "update-account",
        {
          body: { user: user, member: member, password: password },
        }
      );

      if (error) {
        toast.error("Failed to update user");
      } else {
        console.log(data);
        toast("User updated!");
        handleFetchBroadcaster();
      }
    } catch (error) {
      toast.error(error.details);
    }
  };

  const handleRemoveAccount = async () => {
    const { data, error } = await supabase.functions.invoke("delete-account", {
      body: { id: member.id },
    });

    if (error) {
      console.log(error);
      toast.error("Failed to delete account");
      return;
    }

    if (data) {
      toast("User deleted");
      setPopup(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          name: member.name,
          email: member.email,
          subrole: member.subrole,
          designation: member.designation,
          access: member.access,
          password: null,
        }}
        onSubmit={async (values) => {
          handleAccountUpdate(values);
        }}
        validationSchema={EditBroadcasterSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <div className="h-screen fixed w-1/3 bg-white top-0 right-0 p-10 shadow-xl">
            <div
              onClick={() => setPopup(false)}
              className="absolute top-5 right-5 text-2xl font-semibold cursor-pointer"
            >
              X
            </div>

            <h2 className="mb-14 mt-4">User Profile</h2>
            <div className="max-w-sm">
              <div className="flex flex-col gap-2 my-3">
                <div className="flex justify-between">
                  <label>Name</label>
                  {errors.name && touched.name && (
                    <label className="text-red-500">{errors.name}</label>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Jess Jones"
                  className="input"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="flex flex-col gap-2 my-3">
                <div className="flex justify-between">
                  <label>Email</label>
                  {errors.email && touched.email && (
                    <label className="text-red-500">{errors.email}</label>
                  )}
                </div>
                <input
                  type="email"
                  placeholder="jess@mail.com"
                  className="input"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="flex flex-col gap-2 my-3">
                <label>Password</label>
                <input
                  type="text"
                  // placeholder="*******"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="input"
                />
                <button
                  className="btn border w-fit border-primary !text-primary"
                  onClick={generatePassword}
                >
                  Regenerate New Password
                </button>
              </div>

              <div className="flex flex-col gap-2 my-3">
                <label>Sub Role</label>
                <select
                  className="input"
                  name="subrole"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.subrole}
                >
                  <option value={ADMIN}>Admin</option>
                  <option value={EDITOR}>Editor</option>
                  <option value={VIEWER}>Viewer</option>
                </select>
              </div>
            </div>
            <div className="flex mt-10 gap-3">
              <button className="btn bg-primary" onClick={handleSubmit}>
                Update Details
              </button>
              <button className="btn bg-danger" onClick={handleRemoveAccount}>
                Delete Member
              </button>
            </div>
          </div>
        )}
      </Formik>
    </>
  );
};

export default TeamMemberPopup;
