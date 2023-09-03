import {createClient} from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Database} from "../types/supabase";
// import env from "react-native-dotenv";

// android 438805178293-09g82ohr25nj4sqppoctsmkb7ie8u9gn.apps.googleusercontent.com

// g sec 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

export const supabaseUrl = "https://ubeqfynzagmhgpnwkavn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZXFmeW56YWdtaGdwbndrYXZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ3NTg0MzUsImV4cCI6MjAwMDMzNDQzNX0.1uAYzBCHfvx5HtQV3Y5eSLn4OGQZbimSdq6cuFC6DbU";
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
