import { authenticate, getMessages } from "./lib/google";
import { extractDataFromMessage } from "./lib/mercaprecios";

export async function crawlEmail(): Promise<void> {
  try {
    await authenticate();
    const messages = await getMessages();
    console.log(`Got ${messages.length} messages`);
    let i = 0;
    for (const message of messages) {
      i++;
      console.log(`[${i}] Processing message ${i} of ${messages.length}`);
      try {
        await extractDataFromMessage(message);
      } catch (e) {
        console.warn(`[${i}] Error processing message`, e);
      }
    }
  } catch (e) {
    console.error(e);
  }
}
