import { getProductsWithRecentPriceChanges } from "~/email/db";
import { ProductWithPurchase } from "~/email/types";

export default defineEventHandler(async () => {
  const products: ProductWithPurchase[] =
    await getProductsWithRecentPriceChanges();

  return products;
});
