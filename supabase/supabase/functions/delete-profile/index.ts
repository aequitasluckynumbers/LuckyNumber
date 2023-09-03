import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    const { id: userId } = user;

    const { error } = await supabaseClient
      .from("card")
      .delete()
      .eq("player", userId);

    if (error) {
      console.error("Error deleting user data:", error);
      return new Response(JSON.stringify({ error }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { error: profileError } = await supabaseClient
      .from("users")
      .delete()
      .eq("id", userId);

    if (profileError) {
      console.error("Error deleting user data:", profileError);
      return new Response(
        JSON.stringify({ error: "no card found", profileError }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { data, error: userError } =
      await supabaseClient.auth.admin.deleteUser(userId);

    if (userError) {
      console.error("Error deleting user data:", userError);
      return new Response(
        JSON.stringify({ error: "no card found", userError }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ message: "user deleted" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const newErr = error.toString();
    return new Response(JSON.stringify({ error, newErr, msg: "error" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
});
