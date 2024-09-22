import { readFileSync } from "fs"
import PdfParse from "pdf-parse"
import { getDateFromTicketLine, getProductFromTicketLine } from "../util"
import { MercaProduct } from "../types"

export function getProductsFromPdf(pdfData: string): MercaProduct[] {
  const lines = pdfData.split('\n')
  const startingLine = lines.findIndex(line => line.includes("DescripciónP. UnitImporte"))
  const endingLine = lines.findIndex(line => line.includes("TOTAL (€)"))
  if (startingLine === -1 || endingLine === -1) {
    throw new Error('Invalid PDF')
  }
  const linesToProcess = lines.slice(startingLine + 1, endingLine)
  const products: MercaProduct[] = []
  for (const line of linesToProcess) {
    const product = getProductFromTicketLine(line)
    if (product) {
      products.push(product)
    }
  }
  return products
}

export function getTicketDateFromPdf(pdfData: string): Date | null {
  // Line with date contains: "21/09/2024 13:15  OP: 3928298"
  const lines = pdfData.split('\n')
  const dateLine = lines.find(line => line.includes('OP:'))
  if (!dateLine) {
    return null
  }
  return getDateFromTicketLine(dateLine)
}

export async function parsePDF(filename: string): Promise<string> {
  const dataBuffer = readFileSync(filename);
  const pdfData = await PdfParse(dataBuffer)
  return pdfData.text
}