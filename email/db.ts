import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProducts() {
  return prisma.product.findMany();
}

export async function getProductsWithRecentPriceChanges(periodDays = 7) {
  const productsWithPurchaseInPeriod = await prisma.product.findMany({
    where: {
      Purchase: {
        some: {
          ShoppingCart: {
            date: {
              gte: new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    },
    include: {
      Purchase: {
        include: {
          ShoppingCart: true,
        },
      },
    },
  });

  const productsWithPriceChanges = productsWithPurchaseInPeriod.filter(
    (product) => {
      const prices = product.Purchase.map((purchase) => purchase.price);
      return new Set(prices).size > 1;
    }
  );

  return productsWithPriceChanges;
}

export async function searchProducts(searchTerm?: string) {
  return prisma.product.findMany({
    take: 12,
    where: {
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    },
    orderBy: {
      Purchase: {
        _count: "desc",
      },
    },
    include: {
      Purchase: {
        include: {
          ShoppingCart: true,
        },
      },
    },
  });
}

export async function getProductHistory(productUuid: string) {
  return prisma.product.findUnique({
    where: {
      uuid: productUuid,
    },
    include: {
      Purchase: {
        include: {
          ShoppingCart: true,
        },
      },
    },
  });
}

export async function createProduct(name: string, unit: string) {
  return prisma.product.create({
    data: {
      name,
      unit,
    },
  });
}

export async function deleteProduct(uuid: string) {
  return prisma.product.delete({
    where: {
      uuid,
    },
  });
}

export async function updateProduct(uuid: string, name: string, unit: string) {
  return prisma.product.update({
    where: {
      uuid,
    },
    data: {
      name,
      unit,
    },
  });
}

export async function getProduct(uuid: string) {
  return prisma.product.findUnique({
    where: {
      uuid,
    },
    include: {
      Purchase: true,
    },
  });
}

export async function getProductByName(name: string) {
  return prisma.product.findFirst({
    where: {
      name,
    },
  });
}

export async function getPurchasesForProduct(productUuid: string) {
  return prisma.purchase.findMany({
    where: {
      productUuid,
    },
  });
}

export async function createTokens(accessToken: string, refreshToken: string) {
  return prisma.accessToken.createMany({
    data: [
      {
        name: "accessToken",
        token: accessToken,
      },
      {
        name: "refreshToken",
        token: refreshToken,
      },
    ],
  });
}

export async function getTokens() {
  return prisma.accessToken.findMany();
}

export async function createShoppingCart(data: Prisma.ShoppingCartCreateInput) {
  return prisma.shoppingCart.create({
    data,
  });
}

export async function getShoppingCarts(
  filters?: Prisma.ShoppingCartFindManyArgs
) {
  return prisma.shoppingCart.findMany(filters);
}

export async function createLoginLink(data: Prisma.LoginLinksCreateInput) {
  return prisma.loginLinks.create({
    data,
  });
}

export async function getLoginLink(token: string) {
  return prisma.loginLinks.findUnique({
    where: {
      token,
    },
  });
}
