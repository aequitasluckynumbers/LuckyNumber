import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../data/database.types";

export const getSupabaseClient = (req) => {
  const supabaseClient = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    }
  );
  return supabaseClient;
};
