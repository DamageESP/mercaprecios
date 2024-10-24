import type { Prisma } from "@prisma/client";
import type { Serialize as NitroSerialize } from "nitropack";

export interface TicketProductRow {
  name: string;
  quantity: number;
  pricePerUnit: number;
  priceTotal: number;
}

export interface TicketData {
  id: string;
  date: Date;
  products: TicketProductRow[];
}

export type Serialize<T> = NitroSerialize<T>;

export type ProductWithPurchase = Prisma.ProductGetPayload<{
  include: { Purchase: { include: { ShoppingCart: true } } };
}>;

export type PurchaseWithShoppingCart = Prisma.PurchaseGetPayload<{
  include: { ShoppingCart: true }
}>;

export type ShoppingCartWithPurchasesAndProducts = Prisma.ShoppingCartGetPayload<{
  include: { Purchase: { include: { Product: true } } };
}>

export interface TimeSeriesData {
  labels: string[];
  datasets: {
    label: string;
    data: (number | null)[];
    fill: boolean;
    borderColor: string;
    tension: number;
  }[];
}
