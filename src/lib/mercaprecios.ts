import { gmail_v1 } from "googleapis";
import { getRawPdfContentsFromMessage } from "./pdf";
import {
  getTicketDataFromPdfContent,
  mapTicketDataToShoppingCartCreationInput,
} from "../util";
import { createShoppingCart } from "../db";
import { moveMessageToProcessedInbox } from "./google";

export async function extractDataFromMessage(message: gmail_v1.Schema$Message) {
  const pdfContent = await getRawPdfContentsFromMessage(message);
  console.log(`Got PDF content`);
  const ticket = getTicketDataFromPdfContent(pdfContent);
  console.log(`Got ticket data`);
  const shoppingCart = mapTicketDataToShoppingCartCreationInput(ticket);
  console.log(`Created shopping cart data`);
  await createShoppingCart(shoppingCart);
  console.log(`Saved shopping cart to the database`);
  await moveMessageToProcessedInbox(message.id);
  console.log(`Moved message to processed inbox`);
}
