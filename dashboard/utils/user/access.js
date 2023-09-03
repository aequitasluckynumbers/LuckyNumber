import { supabase } from "../../lib/supabase";
import { useState } from "react";

export const checkPermission = async (route, role, subrole) => {
  let roleAccess = false;
  let subroleAccess = false;

  const { data: sesssionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    return { error: sessionError };
  }

  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select()
    .eq("id", sesssionData.session.user.id);

  if (adminData.length === 0) {
    return { error: "Admin not found!" };
  }

  const admin = adminData[0];

  if (role.includes(admin.role)) {
    roleAccess = true;
  } else {
    return { error: "Access Denied" };
  }

  if (subrole.includes(admin.subrole)) {
    subroleAccess = true;
  } else {
    return { error: "Access Denied" };
  }

  if (roleAccess && subroleAccess) {
    return { data: adminData };
  }
};
