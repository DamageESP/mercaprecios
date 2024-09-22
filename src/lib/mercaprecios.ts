import type { gmail_v1 } from "googleapis"
import { MercaProduct } from "../types"
import { getAttachmentsForMessage } from "./google"
import { getProductsFromPdf, getTicketDateFromPdf, parsePDF } from "./pdf"
import { writeFileSync } from "fs"

export async function getProductsFromMessage(message: gmail_v1.Schema$Message): Promise<{ date: Date | null, products: MercaProduct[] }> {
  const attachments = await getAttachmentsForMessage(message)
  const messageProducts: MercaProduct[] = []
  let date: Date | null = null
  for (const attachment of attachments) {
    const { filename, body } = attachment
    const outputPath = `./downloads/${filename}`
    writeFileSync(outputPath, Buffer.from(body || '', 'base64'))
    if (outputPath.endsWith('.pdf')) {
      const pdfContent = await parsePDF(outputPath)
      const products = getProductsFromPdf(pdfContent)
      date = getTicketDateFromPdf(pdfContent)
      messageProducts.push(...products)
    }
  }
  return { date, products: messageProducts }
}