import { getProducts, searchProducts } from "~/email/db";

export default defineEventHandler(async (event) => {
  const { q: searchTerm } = getQuery<{ q?: string }>(event);

  // Example data, replace with your actual data fetching logic
  const products = await searchProducts(searchTerm);

  return products;
});
