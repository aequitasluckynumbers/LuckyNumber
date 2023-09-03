import { corsHeaders } from "../_shared/cors.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
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
  // sponsor: {
  //   admin: ABS;
  //   editor: ABS;
  // };
};

/**
 *
 * admin admin => admin admin, admin editor, admin viewer, s/b admin
 * admin editor => admin editor, admin viewer, s/b admin
 * s/b admin => s/b admin, s/b editor, s/b viewer
 * s/b editor => s/b editor, s/b viewer
 */

const access: AccessType = {
  admin: {
    admin: {
      admin: ["admin", "editor", "viewer"], // permission
      broadcaster: ["admin"],
      sponsor: ["admin"],
    },
    editor: {
      admin: ["editor", "viewer"],
      broadcaster: ["admin"],
      sponsor: ["admin"],
    },
  },
  broadcaster: {
    admin: {
      admin: [],
      broadcaster: ["admin", "editor", "viewer"],
      sponsor: [],
    },
    editor: {
      admin: [],
      broadcaster: ["editor", "viewer"],
      sponsor: [],
    },
  },
};

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

const checkAccess = (admin: any, role: string, subrole: string) => {
  const adminRole = admin.role as keyof typeof access;
  const roleLevelAccess = access[adminRole];

  const adminSubrole = admin.subrole as keyof typeof roleLevelAccess;
  const subroleLevelAccess = roleLevelAccess[adminSubrole];

  const roleType = role as keyof typeof subroleLevelAccess;

  const subroleArr = subroleLevelAccess[roleType];

  if (!subroleArr.includes(subrole)) {
    return accessError(null, "Access Denied", 401);
  }
};

serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const {
    email,
    password,
    name,
    role,
    subrole,
    designation,
    country,
    id,
    update,
  }: {
    email: string;
    password: string;
    name: string;
    role: string;
    subrole: string;
    designation?: string;
    country?: string;
    id?: string;
    update: boolean;
  } = await req.json();

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
    //   Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    //   {
    //     global: {
    //       headers: { Authorization: req.headers.get("Authorization")! },
    //     },
    //   }
    // );

    // fetch user

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
      return accessError(null, "Viewers dont have access to Create User", 401);
    }

    //TODO: Check access
    checkAccess(admin, role, subrole);

    if (update) {
      const { data, error } = await supabaseClient
        .from("admin")
        .update({
          name: name,
          email: email,
          designation: designation,
          role: role,
          subrole: subrole,
          country: country ? country : admin.country,
        })
        .eq("id::text", id)
        .select();

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({
          data: data,
          msg: "User Updated Successfully",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // create auth user
    const { data: authAdmin, error } =
      await serviceClient.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
      });

    if (error) {
      throw error;
    }

    // for insert
    const newAdmin = await supabaseClient
      .from("admin")
      .insert({
        id: authAdmin.user.id,
        name: name,
        email: email,
        designation: designation,
        role: role,
        subrole: subrole,
        country: country ? country : admin.country,
      })
      .select();

    if (newAdmin.error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        data: newAdmin.data,
        msg: "User Created Successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const newErr = error.toString();
    console.log(error);
    return new Response(JSON.stringify({ error, newErr, msg: "error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
