import { readFileSync, writeFileSync } from "fs";
import PdfParse from "pdf-parse/lib/pdf-parse";
import { getDateFromTicketLine, getProductFromTicketLine } from "../util";
import type { TicketProductRow } from "../types";
import { gmail_v1 } from "googleapis";
import { getAttachmentsForMessage } from "./google";

export function getProductsFromTicket(pdfData: string): TicketProductRow[] {
  const lines = pdfData.split("\n");
  const startingLine = lines.findIndex((line) =>
    line.includes("DescripciónP. UnitImporte")
  );
  const endingLine = lines.findIndex((line) => line.includes("TOTAL (€)"));
  if (startingLine === -1 || endingLine === -1) {
    throw new Error("Invalid PDF");
  }
  const linesToProcess = lines.slice(startingLine + 1, endingLine);
  const products: TicketProductRow[] = [];
  for (const line of linesToProcess) {
    const product = getProductFromTicketLine(line);
    if (product) {
      products.push(product);
    }
  }
  return products;
}

export async function getRawPdfContentsFromMessage(
  message: gmail_v1.Schema$Message
): Promise<string> {
  const attachments = await getAttachmentsForMessage(message);
  if (attachments?.length === 0) {
    throw new Error("No attachments found");
  }
  const ticketAttachment = attachments[0];
  const { filename, body } = ticketAttachment;
  const outputPath = `./downloads/${filename}`;
  writeFileSync(outputPath, Buffer.from(body || "", "base64"));
  const pdfContent = await parsePDF(outputPath);
  return pdfContent;
}

export function getTicketDateFromPdf(pdfData: string): Date | null {
  // Line with date contains: "21/09/2024 13:15  OP: 3928298"
  const lines = pdfData.split("\n");
  const dateLine = lines.find((line) => line.includes("OP:"));
  if (!dateLine) {
    return null;
  }
  return getDateFromTicketLine(dateLine);
}

export async function parsePDF(filename: string): Promise<string> {
  const dataBuffer = readFileSync(filename);
  const pdfData = await PdfParse(dataBuffer);
  return pdfData.text;
}
