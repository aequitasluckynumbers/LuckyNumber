import { supabase } from "@/lib/supabase";
import { ADMIN } from "@/utils/constants";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";

const Login = ({ setUser }) => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const cookies = new Cookies();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Failed To Login");
      console.log(error);
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from(ADMIN)
      .select()
      .eq("id::text", data.user.id);

    if (userError) {
      toast.error("Failed To Login");
      console.log(error);
      return;
    }

    setUser(userData[0]);

    console.log(data);
    cookies.set("authorization", data.session.access_token, { path: "/" });
    router.push("/");
  };

  return (
    <>
      <div className="flex flex-col gap-10 h-screen justify-center items-center gradient-background">
        <Image src={"/images/logo.png"} width={250} height={250} alt="" />

        <form onSubmit={(e) => handleLogin(e)} className="flex flex-col gap-2">
          <div className="flex gap-2 px-3 py-2 border rounded-lg">
            <Image
              src={"/icons/admin.png"}
              width={25}
              height={30}
              className="object-contain"
              alt=""
            />
            <input
              type="email"
              className="bg-transparent outline-none text-white"
              placeholder="Email"
              ref={emailRef}
            />
          </div>
          <div className="flex gap-2 px-3 py-2 border rounded-lg">
            <Image
              src={"/icons/admin.png"}
              width={25}
              height={30}
              className="object-contain"
              alt=""
            />
            <input
              type="password"
              className="bg-transparent outline-none text-white"
              placeholder="Password"
              ref={passwordRef}
            />
          </div>

          <button type="submit" className="btn blue-gradient">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
