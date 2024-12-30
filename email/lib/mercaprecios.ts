import { gmail_v1 } from "googleapis";
import { getProductsFromTicket, getRawPdfContentsFromMessage, getTicketDateFromPdf } from "./pdf";
import {
  getSenderFromEmailHeaders,
  getTicketIdFromPdf,
  mapTicketDataToShoppingCartCreationInput,
} from "../util";
import { createShoppingCart } from "../db";
import { moveMessageToProcessedInbox } from "./google";
import type { TicketData } from "../types";


export function getTicketDataFromPdfContent(pdfContent: string): TicketData {
  const products = getProductsFromTicket(pdfContent);
  const date = getTicketDateFromPdf(pdfContent);
  const id = getTicketIdFromPdf(pdfContent);

  if (!date) {
    throw new Error("Invalid PDF");
  }

  return { id, date, products };
}

export async function extractDataFromMessage(message: gmail_v1.Schema$Message) {
  if (!message?.id) {
    throw new Error(`Message ID is required`);
  }
  const pdfContent = await getRawPdfContentsFromMessage(message);
  console.log(`Got PDF content`);
  const ticket = getTicketDataFromPdfContent(pdfContent);
  console.log(`Got ticket data`);
  const shoppingCart = mapTicketDataToShoppingCartCreationInput(ticket);
  console.log(`Created shopping cart data`);
  const senderEmail = getSenderFromEmailHeaders(message.payload?.headers || []);
  if (senderEmail) {
    shoppingCart.userEmail = senderEmail;
  }
  await createShoppingCart(shoppingCart);
  console.log(`Saved shopping cart to the database`);
  await moveMessageToProcessedInbox(message.id);
  console.log(`Moved message to processed inbox`);
}
