import TopNav from "@/components/TopNav";
import BroadcastMemberPopup from "@/popups/BroadcastMemberPopup";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { ADMIN, BROADCASTER, EDITOR, VIEWER } from "@/utils/constants";
import { checkServerSideRouteAccess } from "@/lib/serverSideAuth";
import NoAccess from "@/components/NoAccess";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";

const BroadcasterPage = ({ data, user, error }) => {
  const [members, setMemebers] = useState([]);
  const [memberEdit, setMemberEdit] = useState();
  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(null);
  const router = useRouter();

  const confirmRemoveAccount = (deletingId) => {
    setIsOpen(true);
    setIndex(deletingId);
  };

  const handleFetchBroadcaster = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(ADMIN)
      .select()
      .eq("role", BROADCASTER);
    if (error) {
      console.log(error);
      return;
    }
    setMemebers(data);
    setLoading(false);
  };

  const handleRemoveAccount = async (i) => {
    const { data, error } = await supabase.functions.invoke("delete-account", {
      body: { id: members[i].id },
    });

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      toast("User deleted");
      handleFetchBroadcaster();
    }
    // alert("User Deleted");
  };

  // checks the data and error status and renders UI conditionally
  useEffect(() => {
    if (!router.isReady) return;

    if (error && error.status === 500) {
      router.push("/");
      toast.error("Unknown Error Occured");
      return;
    }

    handleFetchBroadcaster();
  }, [router]);
  if (loading) return <Loader />;

  if (error && error.status === 401) return <NoAccess />;

  return (
    <>
      {popup && (
        <BroadcastMemberPopup
          setPopup={setPopup}
          member={members[memberEdit]}
          handleFetchBroadcaster={handleFetchBroadcaster}
        />
      )}
      <div className="pt-10 px-12 ">
        <TopNav title="Broadcasters" user={user} />

        <div className="flex justify-between my-10">
          <h2></h2>
          <Link href={"/broadcasters/addmember"}>
            <button className="btn bg-primary">Add New Broadcaster</button>
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
              <td>Edit</td>
              <td className="p-4 rounded-r-md !rounded-b-none ">Remove</td>
            </tr>
          </thead>
          <tbody>
            {members.map((e, i) => (
              <tr className="cursor-pointer" key={i}>
                <td className="p-4">
                  <input type="checkbox" name="" id="" />
                </td>
                <td className="text-secondary  font-medium">{e.name}</td>
                <td className="text-primary-varient ">{e.email}</td>
                <td>
                  <button
                    onClick={() => {
                      setPopup(true);
                      setMemberEdit(i);
                    }}
                    className="btn border !border-primary !text-primary"
                  >
                    Edit
                  </button>
                </td>
                <td className="flex p-4">
                  <button
                    className="btn border !border-danger !text-danger"
                    onClick={() => confirmRemoveAccount(i)}
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
        title="Do you want to remove this account ?"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="max-w-fit mx-auto py-6">
          <div className="flex gap-10">
            <button
              className="btn w-1/2  bg-primary"
              onClick={() => {
                handleRemoveAccount(index);
                setIndex(null);
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

export default BroadcasterPage;

export async function getServerSideProps(context) {
  return await checkServerSideRouteAccess(
    context,
    [ADMIN],
    [ADMIN, EDITOR, VIEWER]
  );
}
