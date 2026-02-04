<script setup lang="ts">
import type { CartItem } from '@/types/cart'
import { formatCurrency } from '@/utils/formatters'
import { useCart } from '@/composables/useCart'

const props = defineProps<{ item: CartItem }>()
const { updateQuantity, removeItem, loading } = useCart()

function increment() {
  updateQuantity(props.item.productId, props.item.sku, props.item.quantity + 1)
}

function decrement() {
  if (props.item.quantity > 1) {
    updateQuantity(props.item.productId, props.item.sku, props.item.quantity - 1)
  }
}

function remove() {
  removeItem(props.item.productId, props.item.sku)
}
</script>

<template>
  <div class="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
    <div class="h-12 w-12 rounded bg-gray-100 flex items-center justify-center shrink-0">
      <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" class="h-12 w-12 rounded object-cover" />
      <svg v-else class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    </div>

    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
      <p class="text-xs text-gray-500">SKU: {{ item.sku }}</p>
    </div>

    <p class="text-sm text-gray-600 w-20 text-right">{{ formatCurrency(item.unitPrice, item.currency) }}</p>

    <div class="flex items-center gap-1">
      <button
        @click="decrement"
        :disabled="loading || item.quantity <= 1"
        class="h-8 w-8 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
      >-</button>
      <span class="w-10 text-center text-sm font-medium">{{ item.quantity }}</span>
      <button
        @click="increment"
        :disabled="loading"
        class="h-8 w-8 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
      >+</button>
    </div>

    <p class="text-sm font-medium text-gray-900 w-24 text-right">
      {{ formatCurrency(item.unitPrice * item.quantity, item.currency) }}
    </p>

    <button @click="remove" :disabled="loading" class="text-gray-400 hover:text-red-600 disabled:opacity-50">
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
</template>
