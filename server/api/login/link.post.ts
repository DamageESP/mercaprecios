import { randomUUID } from "crypto";
import { createError } from "nuxt/app";
import { createLoginLink, getShoppingCarts } from "~/email/db";

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

  const loginLink = await createLoginLink({
    email,
    token: randomUUID(),
  });

  // Send the email with the login link
  // This is where you would use a service like SendGrid or Mailgun
  // to send the email with the login link
  console.log(`Login link for ${email}: ${loginLink.token}`);

  return loginLink.token;
});
