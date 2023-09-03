import NoAccess from "@/components/NoAccess";
import { Search } from "@/components/Search";
import TopNav from "@/components/TopNav";
import { checkServerSideRouteAccess } from "@/lib/serverSideAuth";
import { supabase } from "@/lib/supabase";
import UserProfilePopup from "@/popups/UserProfilePopup";
import { ADMIN, BROADCASTER, EDITOR, USERS } from "@/utils/constants";
import { getAge } from "@/utils/date";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserInfoPage = ({ data, user, error }) => {
  const router = useRouter();

  const [popup, setPopup] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");

  const [totalCount, setTotalCount] = useState(0);

  const fetchUserList = async () => {
    const query = supabase.from(USERS).select("*", {
      count: "exact",
    });

    if (age !== "") {
      let start = parseInt(age.split("-")[0]);
      let end = parseInt(age.split("-")[1]);
      const today1 = new Date();
      const today2 = new Date();

      const startDate = new Date(
        today1.setFullYear(today1.getFullYear() - end)
      ).toLocaleDateString();
      console.log(startDate);

      const endDate = new Date(
        today2.setFullYear(today2.getFullYear() - start)
      ).toLocaleDateString();

      query.gte("dob", startDate).lte("dob", endDate);
    }

    // if (user?.role == BROADCASTER) {
    //   query.eq("country", user.country);
    // } else
    if (country !== "") {
      query.eq("country", country);
    }

    if (gender !== "") {
      query.eq("gender", gender);
    }

    const { data, error, count } = await query;

    if (error) {
      console.log(error);
      toast.error("Failed to Fetch User List");
      return;
    }
    console.log(count);
    setUsersList(data);
    setTotalCount(count);
  };

  useEffect(() => {
    fetchUserList();
  }, [user]);

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
      {popup && <UserProfilePopup setPopup={setPopup} />}
      <div className="pt-10 px-12 ">
        <TopNav title="User Info" user={user} />

        <Search
          age={age}
          setAge={setAge}
          user={user}
          country={country}
          setCountry={setCountry}
          gender={gender}
          setGender={setGender}
          fetchUserList={fetchUserList}
        />

        <p className="text-right mt-6 mb-2">Total Count: {totalCount}</p>
        <table className="table-auto w-full ">
          <thead className=" bg-primary text-white font-semibold">
            <tr className="p-4 ">
              <td className="p-4 rounded-l-md !rounded-b-none">Name</td>
              <td>Email</td>
              <td>Phone</td>
              <td>Country</td>
              <td>Age</td>
              <td>Gender</td>
              <td>Account Created</td>
              <td className="p-4 rounded-r-md !rounded-b-none "> Complete</td>
            </tr>
          </thead>
          <tbody>
            {usersList.map((user, i) => (
              <tr
                className="cursor-pointer"
                // onClick={() => setPopup(true)}
                key={i}
              >
                <td className="text-secondary p-4 text-sm font-medium">
                  {user.fname} {user.lname}
                </td>
                <td className="">{user.email ? user.email : "-"}</td>
                <td>{user.phone ? user.phone : "-"}</td>
                <td>{user.country}</td>
                <td>{getAge(user.dob)}</td>
                <td>{user.gender}</td>
                <td>{user.created_at.slice(0, 10)}</td>
                <td className=" p-4">
                  {user.is_complete ? "Complete" : "Incomplete"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserInfoPage;

export async function getServerSideProps(context) {
  return await checkServerSideRouteAccess(
    context,
    [ADMIN, BROADCASTER],
    [ADMIN, EDITOR]
  );
}
