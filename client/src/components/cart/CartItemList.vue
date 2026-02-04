<script setup lang="ts">
import type { CartItem } from '@/types/cart'
import CartItemRow from './CartItemRow.vue'
import EmptyCart from './EmptyCart.vue'

defineProps<{ items: CartItem[] }>()
</script>

<template>
  <div v-if="items.length > 0" class="space-y-3">
    <div class="hidden sm:grid grid-cols-[48px_1fr_80px_104px_96px_20px] gap-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
      <span></span>
      <span>Product</span>
      <span class="text-right">Price</span>
      <span class="text-center">Qty</span>
      <span class="text-right">Total</span>
      <span></span>
    </div>
    <CartItemRow v-for="item in items" :key="item.productId" :item="item" />
  </div>
  <EmptyCart v-else />
</template>
