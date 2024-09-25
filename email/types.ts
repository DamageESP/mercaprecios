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
