import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProducts() {
  return prisma.product.findMany({
    include: {
      Purchase: true,
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

export async function getShoppingCarts() {
  return prisma.shoppingCart.findMany();
}
