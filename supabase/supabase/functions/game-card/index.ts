import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// import { Database } from "../../../data/database.types";
// import { createClient } from "@supabase/supabase-js";

function shuffle(array: any) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

serve(async (req: Request) => {
  const { gameId } = await req.json();

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
      data: { user },
    } = await supabaseClient.auth.getUser();

    // check if there already a card () yes => send that card --done
    const gameCard = await supabaseClient
      .from("card")
      .select("*")
      .eq("game", gameId)
      .eq("player", user?.id);
    if (gameCard.error) {
      return new Response(JSON.stringify(gameCard), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // already there is a gameCard
    if (gameCard.data?.length !== 0) {
      return new Response(JSON.stringify(gameCard.data), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // get the game
    const game = await supabaseClient
      .from("game")
      .select("*")
      .eq("id", gameId)
      .single();

    if (!game || game.error) {
      return new Response(JSON.stringify({ error: "no game found", game }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // check current card number is divisible by odds and less than odds*pool

    const totalGeneratedCards = await supabaseClient
      .from("card")
      .select("*", { count: "exact", head: true })
      .eq("game", gameId);

    const currCardNo: number = totalGeneratedCards.count
      ? totalGeneratedCards.count + 1
      : 0 + 1;

    const odds: number = game.data!!.odds;

    const pool: number = game.data?.pool ? game.data?.pool : 100000;

    const numbers: any = [];
    /*****************************************************************************
     *
     *  Game show specifics card generator starts
     *
     ******************************************************************************/
    const row1 = [2, 3, 4, 7, 8, 9, 12, 13, 14];
    const row2 = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    const row3 = [32, 33, 34, 37, 38, 39, 42, 43, 44];
    const corner_row_1 = [1, 5, 6, 10, 11, 15];
    const corner_row_3 = [31, 35, 36, 40, 41, 45];

    const winning_corners_row_1 = corner_row_1.filter((num) =>
      game.data.winning_numbers.includes(num)
    );
    const winning_corners_row_3 = corner_row_3.filter((num) =>
      game.data.winning_numbers.includes(num)
    );
    const winning_middle_numbers = row2.filter((num) =>
      game.data.winning_numbers.includes(num)
    );
    const winning_top_row = row1.filter((num) =>
      game.data.winning_numbers.includes(num)
    );
    const winning_bottom_row = row3.filter((num) =>
      game.data.winning_numbers.includes(num)
    );

    shuffle(winning_corners_row_1);
    shuffle(winning_corners_row_3);
    shuffle(winning_middle_numbers);
    shuffle(winning_top_row);
    shuffle(winning_bottom_row);

    // const winning_numbers = [...game.data.winning_numbers];
    // shuffle(winning_numbers);

    if (currCardNo % odds === 0) {
      /*****************************************************************************
       *
       *  Game show specifics card generator: Winner Start
       *
       ******************************************************************************/
      while (numbers.length < 15) {
        const current_index = numbers.length;
        if (current_index === 0) {
          numbers.push(winning_corners_row_1[0]);
        } else if (current_index === 4) {
          numbers.push(winning_corners_row_1[1]);
        } else if (current_index === 10) {
          numbers.push(winning_corners_row_3[0]);
        } else if (current_index === 14) {
          numbers.push(winning_corners_row_3[1]);
        } else if (current_index >= 5 && current_index < 10) {
          numbers.push(...winning_middle_numbers.slice(-5));
        } else if (current_index >= 1 && current_index < 4) {
          numbers.push(...winning_top_row.slice(-3));
        } else if (current_index >= 11 && current_index < 14) {
          numbers.push(...winning_bottom_row.slice(-3));
        }
      }

      // numbers.push(...winning_numbers.slice(-15));

      /*****************************************************************************
       *
       *  Game show specifics card generator: Winner End
       *
       ******************************************************************************/

      const newCard = await supabaseClient
        .from("card")
        .insert({
          game: gameId,
          player: user?.id,
          is_winner: false,
          numbers,
          country: user.country,
        })
        .select();
      if (newCard.error) {
        return new Response(
          JSON.stringify({ msg: "Failed to generate the Bingo Card", newCard }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // new winning card
      return new Response(JSON.stringify(newCard.data), {
        headers: { "Content-Type": "application/json" },
      });
    }

    /*****************************************************************************
     *
     *  Game show specifics card generator: Loser starts
     *
     ******************************************************************************/

    const random_corner_winning = Math.floor(Math.random() * 2) + 1;
    const random_middle_row_win = Math.floor(Math.random() * 4) + 1;

    let corners_won = 0;

    while (numbers.length < 15) {
      const current_index = numbers.length;
      if (current_index === 0) {
        if (corners_won <= random_corner_winning) {
          numbers.push(winning_corners_row_1[0]);
          corners_won++;
        } else {
          const random = Math.floor(Math.random() * (corner_row_1.length - 1));
          const random_corner = corner_row_1[random];
          if (
            !winning_corners_row_1.includes(random_corner) &&
            !numbers.includes(random_corner)
          ) {
            numbers.push(random_corner);
          }
        }
      } else if (current_index === 4) {
        if (corners_won <= random_corner_winning) {
          numbers.push(winning_corners_row_1[1]);
          corners_won++;
        } else {
          const random = Math.floor(Math.random() * (corner_row_1.length - 1));
          const random_corner = corner_row_1[random];
          if (
            !winning_corners_row_1.includes(random_corner) &&
            !numbers.includes(random_corner)
          ) {
            numbers.push(random_corner);
          }
        }
      } else if (current_index === 10) {
        if (corners_won <= random_corner_winning) {
          numbers.push(winning_corners_row_3[0]);
          corners_won++;
        } else {
          const random = Math.floor(Math.random() * (corner_row_3.length - 1));
          const random_corner = corner_row_3[random];
          if (
            !winning_corners_row_1.includes(random_corner) &&
            !numbers.includes(random_corner)
          ) {
            numbers.push(random_corner);
          }
        }
      } else if (current_index === 14) {
        if (corners_won <= random_corner_winning) {
          numbers.push(winning_corners_row_3[1]);
          corners_won++;
        } else {
          const random = Math.floor(Math.random() * (corner_row_3.length - 1));
          const random_corner = corner_row_3[random];
          if (
            !winning_corners_row_1.includes(random_corner) &&
            !numbers.includes(random_corner)
          ) {
            numbers.push(random_corner);
          }
        }
      } else if (current_index >= 5 && current_index < 10) {
        const middle_row: any = [];

        middle_row.push(
          ...winning_middle_numbers.slice(-random_middle_row_win)
        );
        const non_winning_middle = row2.filter(
          (num) => !game.data.winning_numbers.includes(num)
        );
        middle_row.push(...non_winning_middle.slice(-(5 - middle_row.length)));
        numbers.push(...middle_row);
      } else if (current_index >= 1 && current_index < 4) {
        numbers.push(...winning_top_row.slice(-3));
      } else if (current_index >= 11 && current_index < 14) {
        numbers.push(...winning_bottom_row.slice(-3));
      }
    }

    /*****************************************************************************
     *
     *  Game show specifics card generator: Loser ends
     *
     ******************************************************************************/

    const newGeneratedCard = await supabaseClient
      .from("card")
      .insert({
        game: gameId,
        player: user?.id,
        is_winner: false,
        numbers,
        country: user.country,
      })
      .select("*");

    if (newGeneratedCard.error) {
      return new Response(
        JSON.stringify({ error: "Failed to generate the Bingo Card" }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(newGeneratedCard.data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    const newErr = error.toString();
    return new Response(JSON.stringify({ error, newErr, msg: "error" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
});
