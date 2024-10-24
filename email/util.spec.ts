import {
  getDateFromTicketLine,
  getProductFromTicketLine,
  getSenderFromEmailHeaders,
  getTicketIdFromPdf,
} from "./util";

describe("getProductFromTicketLine", () => {
  it("should return a product when the ticket line is valid", () => {
    const ticketLine = "2AGUA AQUAREL 1.5L0,591,18";
    const ticketLine2 = "4AGUA MINERAL 10000,401,60";
    const product = getProductFromTicketLine(ticketLine);
    const product2 = getProductFromTicketLine(ticketLine2);
    expect(product).toEqual({
      name: "AGUA AQUAREL 1.5L",
      quantity: 2,
      pricePerUnit: 0.59,
      priceTotal: 1.18,
    });
    expect(product2).toEqual({
      name: "AGUA MINERAL 1000",
      quantity: 4,
      pricePerUnit: 0.4,
      priceTotal: 1.6,
    });
  });

  it("should return null when the ticket line is invalid", () => {
    const ticketLine = "invalid ticket line";
    const product = getProductFromTicketLine(ticketLine);
    expect(product).toBeNull();
  });
});

describe("getDateFromTicketLine", () => {
  it("should return a date when the ticket line is valid", () => {
    const ticketLine = "21/09/2024 13:15  OP: 3928298";
    const date = getDateFromTicketLine(ticketLine);
    expect(date).toEqual(new Date(2024, 8, 21, 13, 15));
  });

  it("should return null when the ticket line is invalid", () => {
    const ticketLine = "invalid ticket line";
    const date = getDateFromTicketLine(ticketLine);
    expect(date).toBeNull();
  });
});

describe("getTicketIdFromPdf", () => {
  it("should correctly get the ticket id", () => {
    const ticketId = getTicketIdFromPdf(
      "FACTURA SIMPLIFICADA: 0000-213-333222"
    );
    expect(ticketId).toEqual("0000-213-333222");
  });
});

describe('getSenderFromEmailHeaders', () => {
  it('should return the sender email when it exists', () => {
    const headers = [
      { name: 'From', value: 'John Doe <john@doe.com>' },
      { name: 'To', value: 'Johnny Doe <johnny@doe.com>' },
    ];
    const sender = getSenderFromEmailHeaders(headers);
    expect(sender).toEqual('john@doe.com');
  })
  it('should return the sender email when it does not contain carets', () => {
    const headers = [
      { name: 'From', value: 'john@doe.com' },
      { name: 'To', value: 'johnny@doe.com' },
    ];
    const sender = getSenderFromEmailHeaders(headers);
    expect(sender).toEqual('john@doe.com');
  })
});
