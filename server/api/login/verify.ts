import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const { token_hash, type } = getQuery<{ token_hash: string, type: 'magiclink' }>(event);
  const { supabaseUrl, supabaseAnonKey } = useRuntimeConfig();

  console.log(`Token_hashtoken_hash: ${token_hash}`);

  if (!token_hash || !type) {
    return createError({
      statusCode: 400,
      statusMessage: "token_hash and type are required",
    });
  }

  // Generate a JWT for the user
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  await supabase.auth.verifyOtp({ token_hash, type });

  return "ok";
});