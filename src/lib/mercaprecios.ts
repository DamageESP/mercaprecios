import type { gmail_v1 } from "googleapis"
import { getAttachmentsForMessage } from "./google"
import { getProductsFromTicket, getTicketDateFromPdf, parsePDF } from "./pdf"
import { writeFileSync } from "fs"
import { TicketData, TicketProductRow } from "../types"

export async function getTicketDataFromMessage(message: gmail_v1.Schema$Message): Promise<TicketData> {
  const attachments = await getAttachmentsForMessage(message)
  const messageProducts: TicketProductRow[] = []
  let date: Date | null = null
  for (const attachment of attachments) {
    const { filename, body } = attachment
    const outputPath = `./downloads/${filename}`
    writeFileSync(outputPath, Buffer.from(body || '', 'base64'))
    if (outputPath.endsWith('.pdf')) {
      const pdfContent = await parsePDF(outputPath)
      const products = getProductsFromTicket(pdfContent)
      date = getTicketDateFromPdf(pdfContent)
      messageProducts.push(...products)
    }
  }
  return { date, products: messageProducts }
}