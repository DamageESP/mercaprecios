import { createError } from "nuxt/app";
import { SupabaseClient } from "@supabase/supabase-js";
import { getLoginLink } from "~/email/db";

export default defineEventHandler(async (event) => {
  const { token } = await readBody(event);
  const { supabaseUrl, supabaseAnonKey } = useRuntimeConfig();

  console.log(`Token: ${token}`);

  if (!token) {
    return createError({
      statusCode: 400,
      statusMessage: "Token is required",
    });
  }

  // Retrieve the login link
  const tokenData = await getLoginLink(token);

  if (!tokenData) {
    return createError({
      statusCode: 400,
      statusMessage: "Invalid token",
    });
  }

  // Generate a JWT for the user
  const supabase = new SupabaseClient(supabaseUrl, supabaseAnonKey);
  await supabase.auth.signInWithOtp({
    email: tokenData?.email,
  });

  return "ok";
});
