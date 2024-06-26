import TopNav from "@/components/TopNav";
import TeamMemberPopup from "@/popups/TeamMemberPopup";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import NoAccess from "@/components/NoAccess";
import { useRouter } from "next/router";
import { ADMIN, BROADCASTER, EDITOR, SPONSOR } from "@/utils/constants";
import { checkServerSideRouteAccess } from "@/lib/serverSideAuth";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";

const AdminPage = ({ data, user, error }) => {
  const router = useRouter();

  const [members, setMemebers] = useState([]);
  const [memberEdit, setMemberEdit] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [userID, setUserID] = useState(null);
  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    setLoading(true);
    const query = supabase.from("admin").select();

    if (user?.role === BROADCASTER) {
      query.eq("country", user.country).eq("role", BROADCASTER);
    } else {
      query.eq("role", ADMIN);
    }

    const { data, error } = await query;

    if (error) {
      console.log(error);
      toast.error("Failed to fetch Admins ");
      return;
    }
    setMemebers(data);
    setLoading(false);
  };

  const handleRemoveAccount = async (id) => {
    const { data, error } = await supabase.functions.invoke("delete-account", {
      body: { id: id },
    });
    if (error) {
      toast.error("Failed to delete Admin");
      console.log(error);
      return;
    }
    if (data) {
      toast.success("User deleted");
      fetchAdmins();
    }
  };

  const confirmRemoveAccount = (deletingId) => {
    setIsOpen(true);
    setUserID(deletingId);
  };

  // checks the data and error status and renders UI conditionally
  useEffect(() => {
    if (!router.isReady) return;

    if (error && error.status === 500) {
      router.push("/");
      toast.error("Unknown Error Occured");
      return;
    }

    fetchAdmins();
  }, [router]);
  if (loading) return <Loader />;

  if (error && error.status === 401) return <NoAccess />;

  return (
    <>
      {popup && (
        <TeamMemberPopup
          setPopup={setPopup}
          member={memberEdit}
          fetchAdmins={fetchAdmins}
        />
      )}
      <div className="pt-10 px-12 ">
        <TopNav title="Admin Settings" user={user} />

        <div className="flex justify-between my-10">
          <h2>Team Members</h2>
          <Link href={"/admin/addmember"}>
            <button className="btn bg-primary">Add New Team Member</button>
          </Link>
        </div>

        <table className="table-auto w-full mt-6">
          <thead className=" bg-primary text-white font-semibold">
            <tr className="p-4 ">
              <td className="p-4  rounded-l-md !rounded-b-none">
                <input type="checkbox" name="" id="" />
              </td>
              <td>Name</td>
              <td>Email</td>
              <td>Designation</td>
              <td>Access Level</td>
              <td>Edit</td>
              <td className="p-4 rounded-r-md !rounded-b-none ">Remove</td>
            </tr>
          </thead>
          <tbody>
            {members.map((member, i) => (
              <tr className="cursor-pointer" key={i}>
                <td className="p-4">
                  <input type="checkbox" name="" id="" />
                </td>
                <td className="text-secondary  font-medium">{member.name}</td>
                <td className="text-primary-varient ">{member.email}</td>
                <td>{member.designation}</td>
                <td className="flex p-4">
                  <div className="input text-center">{member.subrole}</div>
                </td>

                <td>
                  <button
                    onClick={() => {
                      setPopup(true);
                      setMemberEdit(member);
                    }}
                    className="btn border !border-primary !text-primary"
                  >
                    Edit
                  </button>
                </td>
                <td className="flex p-4">
                  <button
                    className="btn border !border-danger !text-danger"
                    onClick={() => {
                      confirmRemoveAccount(member.id);
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title="Do you want to remove this user ?"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="max-w-fit mx-auto py-6">
          <div className="flex gap-10">
            <button
              className="btn w-1/2  bg-primary"
              onClick={() => {
                handleRemoveAccount(userID);
                setUserID(null);
                setIsOpen(false);
              }}
            >
              Confirm
            </button>
            <button
              className="btn w-1/2  bg-danger"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminPage;

export async function getServerSideProps(context) {
  return await checkServerSideRouteAccess(
    context,
    [ADMIN, BROADCASTER],
    [ADMIN, EDITOR]
  );
}
