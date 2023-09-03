// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// import { Database } from "../../../data/database.types";
// import { createClient } from "@supabase/supabase-js";

serve(async (req: Request) => {
  const data = await req.json();

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

    if (data.fname) {
      const { error } = await supabaseClient.from("users").insert(data);
      if (error.code === 23503) {
        throw error;
      }
    }

    let { user, error } = await supabaseClient.auth.signInWithOtp({
      phone: `${data.country_code}${data.phone_number}`,
    });

    if (error) {
      throw error;
    }
    const verifyOtp = await supabaseClient.functions.invoke("verify-otp", {
      body: {
        country_code: data.country_code,
        phone_number: data.phone_number,
      },
    });

    if (verifyOtp.error) {
      throw error;
    }

    return new Response(JSON.stringify({ message: "User Sign in Complete" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), {
      headers: { "Content-Type": "application/json" },
    });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
