import {
  authenticate,
  getAuthUrl,
  getMessages,
  oauth2Client,
} from "./lib/google";
import express from "express";
import { createTokens } from "./db";
import { extractDataFromMessage } from "./lib/mercaprecios";

const app = express();

app.get("/", (req, res) => {
  const authUrl = getAuthUrl();
  res.send(`<a href="${authUrl}">Authenticate with Google</a>`);
});

app.get("/oauthcallback", async (req, res) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).send("Missing code");
  }
  const { tokens } = await oauth2Client.getToken(code);
  console.log("Received tokens", tokens);
  if (!tokens.access_token || !tokens.refresh_token) {
    return res.status(400).send("Failed to get tokens");
  }
  await createTokens(tokens.access_token, tokens.refresh_token);
  oauth2Client.setCredentials(tokens);
  res.redirect("/messages");
});

app.get("/downloadProducts", async (req, res) => {
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
    res.json({ message: "Products downloaded and saved to the database" });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
