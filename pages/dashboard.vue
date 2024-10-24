<script setup lang="ts">
import type {
  Serialize,
  ShoppingCartWithPurchasesAndProducts,
} from "~/email/types";

const user = useSupabaseUser();
const router = useRouter();

const { data: shoppingCarts } = await useLazyFetch("/api/dashboard");

function getCartTotal(cart: Serialize<ShoppingCartWithPurchasesAndProducts>) {
  return cart.Purchase.reduce((acc, purchase) => acc + purchase.price, 0);
}

const averageCartPrice = computed(() => {
  if (!shoppingCarts.value) return 0;
  return (
    shoppingCarts.value.reduce((acc, cart) => acc + getCartTotal(cart), 0) /
    shoppingCarts.value.length
  );
});

onMounted(() => {
  if (!user.value) {
    router.replace("/");
  }
});
</script>

<template>
  <div class="max-w-screen-xl mx-auto my-4 lg:my-14 px-4">
    Hello {{ user?.email }}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-lg p-4 shadow-md">
        <h2 class="text-2xl font-bold mb-4">Carritos de compra</h2>
        <span>Precio medio: {{ formatMoney(averageCartPrice) }}</span>
        <div v-if="shoppingCarts?.length === 0" class="text-center">
          <p>No hay carritos de compra.</p>
        </div>
        <div v-else>
          <ul>
            <li v-for="cart in shoppingCarts" :key="cart.uuid">
              <div class="flex items-center justify-between">
                <span>{{ cart.cartId }}</span>
                <span>{{ formatDate(cart.date) }}</span>
                <span>{{ formatMoney(getCartTotal(cart)) }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
