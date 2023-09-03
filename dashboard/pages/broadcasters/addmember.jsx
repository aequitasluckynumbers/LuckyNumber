import TopNav from "@/components/TopNav";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { checkServerSideRouteAccess } from "@/lib/serverSideAuth";
import { ADMIN, BROADCASTER, EDITOR } from "@/utils/constants";
import NoAccess from "@/components/NoAccess";
import { CreateBroadcasterSchema } from "@/utils/validation/broadcasterSchema";

const AddTeamMember = ({ data, user, error }) => {
  const [created, setCreated] = useState(false);
  const [password, setPassword] = useState();
  const router = useRouter();

  const handleGoBack = () => {
    if (created) {
      router.push("/broadcasters");
    }
    setCreated(true);
  };

  const handleAccountCreation = async (values) => {
    const randomPassword =
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    setPassword(randomPassword);

    const { data, error } = await supabase.functions.invoke("create-account", {
      body: {
        email: values.email,
        password: randomPassword,
        role: BROADCASTER,
        subrole: values.subrole,
        designation: values.designation,
        country: values.country,
        name: values.name,
      },
    });

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      toast.success("Broadcaster Added Succesfully");
    }

    handleGoBack();
  };

  // checks the data and error status and renders UI conditionally
  useEffect(() => {
    if (!router.isReady) return;

    if (error && error.status === 500) {
      router.push("/");
      toast.error("Unknown Error Occured");
      return;
    }

    // handleFetchData();
  }, [router]);

  if (error && error.status === 401) return <NoAccess />;

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          email: "",
          role: "admin",
          subrole: "admin",
          designation: "",
          access: [],
        }}
        onSubmit={async (values) => {
          handleAccountCreation(values);
        }}
        validationSchema={CreateBroadcasterSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
        }) => (
          <div className="pt-10 px-12 ">
            <TopNav title="Admin Settings" user={user} />
            <div className="flex justify-between my-10">
              <h2>Add New Team Member</h2>
              {created ? (
                <button onClick={handleGoBack} className="btn bg-primary">
                  Back to Dashboard
                </button>
              ) : (
                <button onClick={handleSubmit} className="btn bg-primary">
                  Create Member
                </button>
              )}
            </div>

            {!created && (
              <div className="bg-white rounded-2xl border px-8 py-9 max-w-lg mx-auto">
                <h3>New Member Details</h3>
                <div className="flex flex-col gap-2 my-3">
                  <div className="flex justify-between">
                    <label>Full Name</label>
                    {errors.name && touched.name && (
                      <label className="text-red-500">{errors.name}</label>
                    )}
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Jess Jones"
                    className="input"
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
                    name="email"
                    className="input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="flex flex-col gap-2 my-3">
                  <label>Role</label>

                  <select
                    className="input"
                    name="role"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="broadcaster">Broadcaster</option>
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
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 my-3">
                  <label>Designation(Optional)</label>
                  <input
                    type="text"
                    name="designation"
                    placeholder="Developer"
                    className="input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            )}

            {created && (
              <div className="bg-white rounded-2xl border px-8 py-9 max-w-md mx-auto">
                <div className="circle w-24 h-24 rounded-full bg-green-300 mx-auto my-5"></div>

                <h3 className="text-center mb-5">
                  New Member Created. They can log in using the below details{" "}
                </h3>

                <div className="flex flex-col gap-2 my-3">
                  <label>Email</label>
                  <input type="text" value={values.email} className="input" />
                </div>
                <div className="flex flex-col gap-2 my-3">
                  <label>Password</label>
                  <input type="text" value={password} className="input" />
                </div>
              </div>
            )}
          </div>
        )}
      </Formik>
    </>
  );
};

export default AddTeamMember;

export async function getServerSideProps(context) {
  return await checkServerSideRouteAccess(
    context,
    [ADMIN, BROADCASTER],
    [ADMIN, EDITOR]
  );
}
