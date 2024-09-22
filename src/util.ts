import { MercaProduct } from "./types";

export function getDateFromTicketLine(line: string): Date | null {
  // Match the line using regex to extract the date
  // Sample line: "21/09/2024 13:15  OP: 3928298"
  const regex = /^(\d{2}\/\d{2}\/\d{4}) (\d{2}:\d{2})/;
  const match = line.match(regex);

  if (!match) {
    return null;
  }

  const [date, time] = match.slice(1);
  const [day, month, year] = date.split('/').map((part) => parseInt(part, 10));
  const [hour, minute] = time.split(':').map((part) => parseInt(part, 10));

  return new Date(year, month - 1, day, hour, minute);
}

export function getProductFromTicketLine(line: string): MercaProduct | null {
  // Match the line using regex to extract the quantity, name, price per unit, and total price
  const regex = /^(\d+)([\w\s\.\&áéíóúÁÉÍÓÚñÑüÜ%\+\-çÇ/\?]+)(\d+,\d{2})(\d+,\d{2})?$/;
  const match = line.match(regex);

  if (!match) {
    console.log('[getProductFromTicketLine] No product match for line', line);
    return null;
  }

  const quantity = parseInt(match[1], 10);
  const name = match[2].trim();
  const priceTotal = match[4] ? parseFloat(match[4].replace(',', '.')) : parseFloat(match[3].replace(',', '.'));
  const pricePerUnit = match[4] ? parseFloat(match[3].replace(',', '.')) : undefined ?? parseFloat((priceTotal / quantity).toFixed(2));

  return {
    quantity,
    name,
    pricePerUnit,
    priceTotal,
  };
}
