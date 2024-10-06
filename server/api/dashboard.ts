import { serverSupabaseUser } from "#supabase/server";
import { getShoppingCarts } from "~/email/db";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      status: 401,
      statusMessage: "You must be logged in to access this resource",
    });
  }

  const myShoppingCarts = await getShoppingCarts({
    where: {
      userEmail: user.email,
    },
    include: {
      Purchase: {
        include: {
          Product: true,
        },
      },
    },
  });

  return myShoppingCarts;
});
