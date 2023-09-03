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
  sponsor: {
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

const access: AccessType = {
  admin: {
    admin: {
      admin: ["admin", "editor", "viewer"],
      broadcaster: ["admin"],
      sponsor: ["admin"],
    },
    editor: {
      admin: ["editor", "viewer"],
      broadcaster: ["admin"],
      sponsor: ["admin"],
    },
  },
  sponsor: {
    admin: {
      admin: [],
      broadcaster: [],
      sponsor: ["admin", "editor", "viewer"],
    },
    editor: {
      admin: [],
      broadcaster: [],
      sponsor: ["editor", "viewer"],
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
  const { user, member, password } = await req.json();

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: admin, error } = await supabaseClient
      .from("admin")
      .update(user)
      .eq("id::text", member.id);

    if (error) {
      throw error;
    }

    let authUpdate;

    if (password) {
      authUpdate = {
        email: user.email,
        password: password,
      };
    } else {
      authUpdate = {
        email: user.email,
      };
    }

    checkAccess(admin, role, subrole);

    const { data, error: authError } =
      await supabaseClient.auth.admin.updateUserById(member.id, authUpdate);

    if (authError) {
      throw authError;
    }

    return new Response(JSON.stringify({ data: "User updated!" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
