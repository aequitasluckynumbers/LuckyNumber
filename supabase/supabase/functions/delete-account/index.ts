import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
// import { Database } from "../../../data/database.types";
// import { createClient } from "@supabase/supabase-js";

type ABS = { admin: string[]; broadcaster: string[]; sponsor: string[] };

type AccessType = {
  admin: {
    admin: ABS;
    editor: ABS;
  };
  broadcaster: {
    admin: ABS;
    editor: ABS;
  };
};

/**
 *
 * admin admin => admin admin, admin editor, admin viewer, s/b admin
 * admin editor => admin editor, admin viewer, s/b admin
 * s/b admin => s/b admin, s/b editor, s/b viewer
 * s/b editor => s/b editor, s/b viewer
 */

const accessError = (error: any, msg: string, status: number) => {
  return new Response(
    JSON.stringify({
      error: error,
      msg: msg,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: status ? status : 400,
    }
  );
};

// const checkAccess = (admin: any, role: string, subrole: string) => {
//   const adminRole = admin.role as keyof typeof access;
//   const roleLevelAccess = access[adminRole];

//   const adminSubrole = admin.subrole as keyof typeof roleLevelAccess;
//   const subroleLevelAccess = roleLevelAccess[adminSubrole];

//   const roleType = role as keyof typeof subroleLevelAccess;

//   const subroleArr = subroleLevelAccess[roleType];

//   if (!subroleArr.includes(subrole)) {
//     return accessError(null, "Access Denied", 401);
//   }
// };

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { id }: { id: string } = await req.json();

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZXFmeW56YWdtaGdwbndrYXZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NDc1ODQzNSwiZXhwIjoyMDAwMzM0NDM1fQ.B5aKtnmD39K7DAnSOg7OEjrTkgYNYhUXkGCrAiJiOrs",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZXFmeW56YWdtaGdwbndrYXZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NDc1ODQzNSwiZXhwIjoyMDAwMzM0NDM1fQ.B5aKtnmD39K7DAnSOg7OEjrTkgYNYhUXkGCrAiJiOrs"
    );

    // const supabaseClient = createClient<Database>(
    //   Deno.env.get("SUPABASE_URL") ?? "",
    //   Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    //   {
    //     global: {
    //       headers: { Authorization: req.headers.get("Authorization")! },
    //     },
    //   }
    // );

    const {
      data: { user: authUser },
    } = await supabaseClient.auth.getUser();

    const { data: admin, error: adminErr } = await supabaseClient
      .from("admin")
      .select()
      .eq("id::text", authUser?.id)
      .single();

    if (adminErr) {
      return accessError(adminErr, "Failed to fetch the admin", 401);
    }

    if (admin?.subrole === "viewer") {
      return accessError(null, "Viewers dont have access to Delete User", 401);
    }

    // fetch userby id
    const { data: userData, error: userError } = await supabaseClient
      .from("admin")
      .select()
      .eq("id::text", id)
      .single();
    if (userError) {
      throw userError;
    }
    // check permissions
    // checkAccess(admin, userData.role, userData.subrole);

    const { data: deleteData, error: deleteError } =
      await serviceClient.auth.admin.deleteUser(id);

    if (deleteError) {
      throw deleteError;
    }

    return new Response(JSON.stringify({ deleteData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error, msg: "error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
