import { crawlEmail } from "~/email";

export default defineEventHandler(async (event) => {
  const authHeader = event.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  await crawlEmail();
});
