import React, { useState } from "react";
import { Formik } from "formik";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const TeamMemberPopup = ({ setPopup, member, handleUpdate }) => {
  const [role, setRole] = useState(["broadcaster", "editor"]);
  const [subRole, setSubRole] = useState(["admin", "editor", "viewer"]);
  const router = useRouter();
  const [password, setPassword] = useState();

  const generatePassword = () => {
    // Create a random password
    const randomPassword =
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

    setPassword(randomPassword);
  };

  const handleAccountUpdate = async (values) => {
    try {
      console.log("Function running");
      const user = {
        name: values.name,
        email: values.email,
        role: values.role,
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

      if (data.error) {
        console.log(data.error);
        throw data.error;
      } else {
        console.log(data);
        toast("User updated!");

        handleUpdate();
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
      return;
    }

    if (data) {
      toast("User deleted");
      router.reload(window.location.pathname);
    }
    // alert("User Deleted");
  };

  return (
    <>
      <Formik
        initialValues={{
          name: member.name,
          email: member.email,
          role: member.role,
          subrole: member.subrole,
          designation: member.designation,
          access: member.access,
          password: null,
        }}
        onSubmit={async (values) => {
          handleAccountUpdate(values);
        }}
      >
        {({
          handleChange,
          handleBlur,
          setFieldValue,
          handleSubmit,
          values,
          touched,
          errors,
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
                <label>Full Name</label>
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
                <label>Email</label>
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
                <label>Role</label>
                <select
                  className="input"
                  name="role"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {role &&
                    role.map((e, i) => {
                      if (e === values.role) {
                        return (
                          <option value={e} selected>
                            {e}
                          </option>
                        );
                      } else {
                        return <option value={e}>{e}</option>;
                      }
                    })}
                </select>
              </div>
              <div className="flex flex-col gap-2 my-3">
                <label>Sub Role</label>
                <select
                  className="input"
                  name="subrole"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {subRole &&
                    subRole.map((e, i) => {
                      if (e === values.subrole) {
                        return (
                          <option value={e} selected>
                            {e}
                          </option>
                        );
                      } else {
                        return <option value={e}>{e}</option>;
                      }
                    })}
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
