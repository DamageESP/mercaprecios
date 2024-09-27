import { getProductHistory, searchProduct } from "~/email/db";
import { buildTimeSeriesForProducts } from "~/email/util";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw new Error("Id is required");
  }

  const product = await getProductHistory(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return buildTimeSeriesForProducts([product]);
});
