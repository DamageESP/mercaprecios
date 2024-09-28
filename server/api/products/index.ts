import { searchProducts } from "~/email/db";
import { ProductWithPurchase } from "~/email/types";

export default defineEventHandler(async (event) => {
  const { q: searchTerm } = getQuery<{ q?: string }>(event);

  const products: ProductWithPurchase[] = await searchProducts(searchTerm);

  return products;
});
