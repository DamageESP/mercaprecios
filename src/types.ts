export interface TicketProductRow {
  name: string
  quantity: number
  pricePerUnit: number
  priceTotal: number
}

export interface TicketData {
  date: Date
  products: TicketProductRow[]
}
