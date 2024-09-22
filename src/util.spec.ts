import { getDateFromTicketLine, getProductFromTicketLine } from "./util";

describe("getProductFromTicketLine", () => {
  it("should return a product when the ticket line is valid", () => {
    const ticketLine = "2AGUA AQUAREL 1.5L0,591,18"
    const ticketLine2 = "4AGUA MINERAL 10000,401,60"
    const product = getProductFromTicketLine(ticketLine)
    const product2 = getProductFromTicketLine(ticketLine2)
    expect(product).toEqual({
      name: "AGUA AQUAREL 1.5L",
      quantity: 2,
      pricePerUnit: 0.59,
      priceTotal: 1.18,
    })
    expect(product2).toEqual({
      name: "AGUA MINERAL 1000",
      quantity: 4,
      pricePerUnit: 0.40,
      priceTotal: 1.60,
    })
  })

  it("should return null when the ticket line is invalid", () => {
    const ticketLine = "invalid ticket line"
    const product = getProductFromTicketLine(ticketLine)
    expect(product).toBeNull()
  })
})

describe('getDateFromTicketLine', () => {
  it('should return a date when the ticket line is valid', () => {
    const ticketLine = '21/09/2024 13:15  OP: 3928298'
    const date = getDateFromTicketLine(ticketLine)
    expect(date).toEqual(new Date(2024, 8, 21, 13, 15))
  })

  it('should return null when the ticket line is invalid', () => {
    const ticketLine = 'invalid ticket line'
    const date = getDateFromTicketLine(ticketLine)
    expect(date).toBeNull()
  })
})
