import { supabase } from "@/lib/supabase";
import { ADMIN } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";

const Navbar = ({ user }) => {
  const router = useRouter();

  const path = router.asPath;

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed To Logout");
    }
    const cookies = new Cookies();
    cookies.remove("authorization");
    router.replace("/login");
  };

  // check user and render Navbar
  // console.log(user);
  return (
    <div className="gradient-background w-1/5 fixed h-screen text-white ">
      <Image
        src={"/images/logo.png"}
        className="w-3/5 mx-auto mt-8 mb-4"
        width={300}
        height={300}
        alt="Lucky Numbers Logo"
      />
      <div className="flex flex-col gap-2 overflow-y-scroll h-[60vh] noscroll">
        <NavLink
          link="/"
          path={path}
          name={"Dashboard"}
          icon={"/icons/dashboard.png"}
        />
        <NavLink
          link="/userinfo"
          path={path}
          name={"User Info"}
          icon={"/icons/user.png"}
        />
        {user?.role === ADMIN && (
          <NavLink
            link="/broadcasters"
            path={path}
            name={"Broadcasters"}
            icon={"/icons/broadcasters.png"}
          />
        )}
        <NavLink
          link="/analytics"
          path={path}
          name={"Analytics"}
          icon={"/icons/analytics.png"}
        />
        <NavLink
          link="/cards"
          path={path}
          name={"Lucky Numbers Card"}
          icon={"/icons/card.png"}
        />

        <NavLink
          link="/sponsors"
          path={path}
          name={"Sponsors & Adverts"}
          icon={"/icons/sponsor.png"}
        />
        <NavLink
          link="/admin"
          path={path}
          name={"Admin Settings"}
          icon={"/icons/admin.png"}
        />
      </div>

      <div className="absolute cursor-pointer bottom-6 w-full mx-auto flex-1">
        <div
          onClick={logOut}
          className=" w-10/12 h-14 flex gap-3 px-4 items-center text-white mx-auto border-0 rounded-md bg-primary"
        >
          <Image
            className="object-contain"
            src={"/icons/logout.png"}
            width={30}
            height={30}
            alt=""
          />
          <p>Log Out</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const NavLink = ({ path, name, icon, link }) => {
  return (
    <>
      <Link href={link}>
        <div
          className={`${
            (path.startsWith(link) && link != "/") ||
            (path == "/" && link == "/")
              ? "blue-gradient "
              : ""
          } w-10/12 h-14 flex gap-3 px-4 items-center text-white mx-auto border-0 rounded-md`}
        >
          <Image
            className="object-contain "
            src={icon}
            width={30}
            height={30}
            alt=""
          />
          <p className="text-base">{name}</p>
        </div>
      </Link>
    </>
  );
};
