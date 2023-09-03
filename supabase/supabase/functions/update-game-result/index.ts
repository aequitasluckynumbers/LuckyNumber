import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  const { cardId } = await req.json();
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

    const { data: gameCard, error } = await supabaseClient
      .from("card")
      .select("*")
      .eq("id", cardId)
      .eq("player", user?.id);

    if (error) {
      return new Response(JSON.stringify(error), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (gameCard && gameCard.length === 1) {
      const { data: updatedCard, error: updateError } = await supabaseClient
        .from("card")
        .update({ is_winner: true })
        .match({ id: gameCard[0].id });

      if (updateError) {
        return new Response(JSON.stringify(error), {
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(updatedCard), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "no card found" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const newErr = error.toString();
    return new Response(JSON.stringify({ error, newErr, msg: "error" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
});
