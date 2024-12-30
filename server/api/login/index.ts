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
  const env = useRuntimeConfig(event);
  const supabase = createClient(env.supabaseUrl, env.supabaseKey);
  await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${env.public.url}/login/verify`
    },
  });

  return "ok";
});
