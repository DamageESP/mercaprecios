import { searchProduct } from "~/email/db";

export default defineEventHandler(async (event) => {
  const { q: searchTerm } = getQuery<{ q?: string }>(event);

  const products = await searchProduct(searchTerm);

  return products;
});
