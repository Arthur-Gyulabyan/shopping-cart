<script setup lang="ts">
import type { AppliedPromotion } from '@/types/cart'
import { useCart } from '@/composables/useCart'

defineProps<{ promo: AppliedPromotion }>()
const { removePromotion, loading } = useCart()
</script>

<template>
  <span class="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
    {{ promo.name }}
    <span class="text-green-600">
      ({{ promo.discountType === 'percentage' ? `${promo.discountAmount}%` : `$${promo.discountAmount}` }})
    </span>
    <button @click="removePromotion(promo.promotionId)" :disabled="loading" class="ml-1 text-green-600 hover:text-red-600">
      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </span>
</template>
