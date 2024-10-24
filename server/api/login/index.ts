import { createClient } from "@supabase/supabase-js";
import { getShoppingCarts } from "~/email/db";

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);

  console.log(`Email: ${email}`);

  if (!email) {
    return createError({
      statusCode: 400,
      statusMessage: "Email is required",
    });
  }

  // Check that we have that email in one of the ShoppingCarts
  const shoppingCart = await getShoppingCarts({
    where: {
      userEmail: email,
    },
  });

  if (!shoppingCart) {
    return createError({
      statusCode: 404,
      statusMessage: "No shopping cart found for this email",
    });
  }

  // Send a magic link with Supabase
  const { supabaseUrl, supabaseAnonKey } = useRuntimeConfig();
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'http://localhost:3000/login/verify',
    }
  });

  return "ok";
});
