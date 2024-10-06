import { Prisma } from "@prisma/client";
import type {
  ProductWithPurchase,
  TicketData,
  TicketProductRow,
  TimeSeriesData,
} from "./types";
import { getProductsFromTicket, getTicketDateFromPdf } from "./lib/pdf";

export function getDateFromTicketLine(line: string): Date | null {
  // Match the line using regex to extract the date
  // Sample line: "21/09/2024 13:15  OP: 3928298"
  const regex = /^(\d{2}\/\d{2}\/\d{4}) (\d{2}:\d{2})/;
  const match = line.match(regex);

  if (!match) {
    return null;
  }

  const [date, time] = match.slice(1);
  const [day, month, year] = date.split("/").map((part) => parseInt(part, 10));
  const [hour, minute] = time.split(":").map((part) => parseInt(part, 10));

  return new Date(year, month - 1, day, hour, minute);
}

export function getProductFromTicketLine(
  line: string
): TicketProductRow | null {
  // Match the line using regex to extract the quantity, name, price per unit, and total price
  const regex =
    /^(\d+)([\w\s\.\&áéíóúÁÉÍÓÚñÑüÜ%\+\-çÇ/\?]+)(\d+,\d{2})(\d+,\d{2})?$/;
  const match = line.match(regex);

  if (!match) {
    console.log("[getProductFromTicketLine] No product match for line", line);
    return null;
  }

  const quantity = parseInt(match[1], 10);
  const name = match[2].trim();
  const priceTotal = match[4]
    ? parseFloat(match[4].replace(",", "."))
    : parseFloat(match[3].replace(",", "."));
  const pricePerUnit = match[4]
    ? parseFloat(match[3].replace(",", "."))
    : undefined ?? parseFloat((priceTotal / quantity).toFixed(2));

  return {
    quantity,
    name,
    pricePerUnit,
    priceTotal,
  };
}

export function mapTicketDataToShoppingCartCreationInput(
  ticketData: TicketData
): Prisma.ShoppingCartCreateInput {
  return {
    cartId: ticketData.id,
    date: ticketData.date,
    Purchase: {
      create: ticketData.products.map((product) => ({
        quantity: product.quantity,
        price: product.pricePerUnit,
        Product: {
          connectOrCreate: {
            create: {
              name: product.name,
              unit: "piece",
            },
            where: {
              name: product.name,
            },
          },
        },
      })),
    },
  };
}

export function getTicketIdFromPdf(pdfData: string): string {
  // Line with ticket id contains: "FACTURA SIMPLIFICADA: 2268-019-231132"
  const lines = pdfData.split("\n");
  const ticketIdLine = lines.find((line) =>
    line.includes("FACTURA SIMPLIFICADA:")
  );
  if (!ticketIdLine) {
    throw new Error("Invalid PDF");
  }
  const ticketId = ticketIdLine.split(":")[1].trim();
  return ticketId;
}

export function getTicketDataFromPdfContent(pdfContent: string): TicketData {
  const products = getProductsFromTicket(pdfContent);
  const date = getTicketDateFromPdf(pdfContent);
  const id = getTicketIdFromPdf(pdfContent);

  if (!date) {
    throw new Error("Invalid PDF");
  }

  return { id, date, products };
}

function getPriceForProductForDay(product: ProductWithPurchase, date: Date) {
  return (
    product.Purchase.find(
      (purchase) =>
        new Date(purchase.ShoppingCart.date).toDateString() ===
        date.toDateString()
    )?.price || null
  );
}

export function buildTimeSeriesForProducts(
  products: ProductWithPurchase[]
): TimeSeriesData {
  const labels = [
    ...new Set(
      products
        .map((product) =>
          product.Purchase.map(
            (purchase) => new Date(purchase.ShoppingCart.date)
          )
        )
        .flat()
        .sort((a, b) => a.getTime() - b.getTime())
        .map((date) => date.toDateString()) || []
    ),
  ];

  const datasets = products.map((product) => ({
    label: product.name,
    data: labels.map((date) =>
      getPriceForProductForDay(product, new Date(date))
    ),
    fill: false,
    borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    tension: 0.1,
    spanGaps: false,
  }));

  return { labels, datasets };
}
