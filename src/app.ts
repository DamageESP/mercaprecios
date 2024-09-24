import {
  authenticate,
  getAuthUrl,
  getMessages,
  oauth2Client,
} from "./lib/google";
import express from "express";
import { createShoppingCart, createTokens } from "./db";
import { TicketData } from "./types";
import {
  getTicketDataFromPdfContent,
  mapTicketDataToShoppingCartCreationInput,
} from "./util";
import { getRawPdfContentsFromMessage } from "./lib/pdf";

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
    const messages = await getMessages();
    const ticketData: TicketData[] = [];
    for (const message of messages) {
      const pdfContent = await getRawPdfContentsFromMessage(message);
      const ticket = getTicketDataFromPdfContent(pdfContent);
      ticketData.push(ticket);
    }
    const shoppingCartCreationData = ticketData.map(
      mapTicketDataToShoppingCartCreationInput
    );
    for (const shoppingCart of shoppingCartCreationData) {
      await createShoppingCart(shoppingCart);
    }
    res.json({ message: "Products downloaded and saved to the database" });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.get("/rawParsedPdf", async (req, res) => {
  const messages = await getMessages();
  const pdfData = (await getRawPdfContentsFromMessage(messages[0])).split("\n");
  res.send(pdfData);
});

app.get("/messages", async (req, res) => {
  try {
    const messages = await getMessages();
    const allProducts = [];
    let purchaseDate = null;
    for (const message of messages) {
      const pdfContent = await getRawPdfContentsFromMessage(message);
      const { date, products } = getTicketDataFromPdfContent(pdfContent);
      allProducts.push(...products);
      purchaseDate = date;
    }

    res.json({
      date: purchaseDate,
      products: allProducts,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

async function initializeApp() {
  await authenticate();
}

await initializeApp();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
