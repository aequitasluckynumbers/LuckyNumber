import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import "@/styles/globals.css";
import { ADMIN, USER, USERS } from "@/utils/constants";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  const path = useRouter().asPath;
  const [user, setUser] = useState(null);

  // Fetch User by sessions and pass it to Navbar
  const getUser = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || session === null) {
      return;
    }
    const { data, error } = await supabase
      .from(ADMIN)
      .select()
      .eq("id::text", session.user.id);
    if (error) {
      console.log(error);
      return;
    }
    setUser(data[0]);
  };

  useEffect(() => {
    getUser();
  }, []);

  if (path == "/login")
    return (
      <>
        <ToastContainer />
        <Component {...pageProps} setUser={setUser} />
      </>
    );

  return (
    <>
      <Head>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
        <meta name="viewport" content="viewport-fit=cover" />
      </Head>
      <ToastContainer />
      <div className="flex">
        <div className="w-1/5 relative h-full bg-red-50">
          <Navbar user={user} />
        </div>
        <div className="w-4/5 bg-background min-h-screen">
          <Component {...pageProps} user={user} />
        </div>
      </div>
    </>
  );
}
