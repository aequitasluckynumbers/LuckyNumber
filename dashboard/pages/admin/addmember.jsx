import TopNav from "@/components/TopNav";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { supabase } from "@/lib/supabase";
import { ADMIN, BROADCASTER, EDITOR, SPONSOR, VIEWER } from "@/utils/constants";
import { toast } from "react-toastify";
import NoAccess from "@/components/NoAccess";
import { getUser } from "@/utils/user/getUser";
import { checkRouteAccess } from "@/utils/user/checkRouteAccess";
import { checkServerSideRouteAccess } from "@/lib/serverSideAuth";
import { CreateAdminSchema } from "@/utils/validation/adminSchema";

const AddTeamMember = ({ data, user, error }) => {
  const router = useRouter();

  const [created, setCreated] = useState(false);
  const [password, setPassword] = useState();
  const [email, setEmail] = useState("");

  const handleGoBack = () => {
    if (created) {
      router.push("/admin");
    }
  };

  const handleAccountCreation = async (values) => {
    const randomPassword =
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    setPassword(randomPassword);

    const { data, error } = await supabase.functions.invoke("create-account", {
      body: {
        email: values.email,
        password: randomPassword,
        role: values.role,
        subrole: values.subrole,
        designation: values.designation,
        country: values.country,
        name: values.name,
      },
    });
    setEmail(values.email);

    if (error || data.error) {
      toast.error("Failed to Create a member");
      console.log(error);
      console.log(data);
      return;
    }

    console.log(data);

    setCreated(true);
  };

  // checks the data and error status and renders UI conditionally
  useEffect(() => {
    if (!router.isReady) return;
    console.log(user);
    if (error && error.status === 500) {
      router.push("/");
      toast.error("Unknown Error Occured");
      return;
    }
  }, [router, error]);

  if (error && error.status === 401) return <NoAccess />;

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          email: "",
          role: user?.role,
          subrole: ADMIN,
          designation: "",
          country: user?.country,
        }}
        onSubmit={async (values) => {
          handleAccountCreation(values);
        }}
        validationSchema={CreateAdminSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, errors, touched }) => (
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
                    <label>Name</label>
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
                    {user?.role === ADMIN && (
                      <option value={ADMIN}>Admin</option>
                    )}
                    {user?.role === BROADCASTER && (
                      <option value={BROADCASTER}>Broadcaster</option>
                    )}
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
                    <option value={ADMIN}>Admin</option>
                    <option value={EDITOR}>Editor</option>
                    <option value={VIEWER}>Viewer</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 my-3">
                  <select
                    className="input"
                    name="country"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value={"india"}>India</option>
                    <option value={"uk"}>UK</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 my-3">
                  <label>Designation (Optional)</label>
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
                  <input type="text" value={email} className="input" />
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
