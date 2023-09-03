import { supabase } from "@/lib/supabase";
import { jwtVerify } from "jose";

export const getUser = async (context) => {
    const token = context.req.cookies.authorization;
    let key = process.env.JWT_SEC;
    const sec = new TextEncoder().encode(key);
    const user = await jwtVerify(token, sec);
    const userId = user.payload.sub;
    // get the user
    const {data, error} = await supabase.from('admin').select().eq("id::text",userId);
    if (data.length === 0) {
        return null;
    }
    return data[0];
} 