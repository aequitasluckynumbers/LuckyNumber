import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ubeqfynzagmhgpnwkavn.supabase.co";
const anonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZXFmeW56YWdtaGdwbndrYXZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ3NTg0MzUsImV4cCI6MjAwMDMzNDQzNX0.1uAYzBCHfvx5HtQV3Y5eSLn4OGQZbimSdq6cuFC6DbU";

// const serviceRole = process.env.NEXT_PUBLIC_SERVICE_ROLE;

export const supabaseAdmin = createClient(supabaseUrl, anonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// export const supabaseAdmin = process.env.JWT_SEC;

export const supabase = createClient(supabaseUrl, anonKey);
