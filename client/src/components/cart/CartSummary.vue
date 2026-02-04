<script setup lang="ts">
import { useCart } from '@/composables/useCart'
import { formatCurrency } from '@/utils/formatters'
import PromotionTag from './PromotionTag.vue'
import PromotionForm from './PromotionForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { cart, repriceCart, loading } = useCart()
</script>

<template>
  <div v-if="cart" class="bg-white rounded-lg shadow-sm p-6 space-y-4">
    <h3 class="text-lg font-semibold text-gray-900">Order Summary</h3>

    <template v-if="cart.quote">
      <div class="space-y-2 text-sm">
        <div class="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{{ formatCurrency(cart.quote.subtotal, cart.quote.currency) }}</span>
        </div>
        <div v-if="cart.quote.discount > 0" class="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-{{ formatCurrency(cart.quote.discount, cart.quote.currency) }}</span>
        </div>
        <div class="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>{{ formatCurrency(cart.quote.tax, cart.quote.currency) }}</span>
        </div>
        <div class="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{{ cart.quote.shipping > 0 ? formatCurrency(cart.quote.shipping, cart.quote.currency) : 'Free' }}</span>
        </div>
        <div class="border-t pt-2 flex justify-between font-semibold text-gray-900 text-base">
          <span>Total</span>
          <span>{{ formatCurrency(cart.quote.total, cart.quote.currency) }}</span>
        </div>
      </div>

      <div v-if="cart.quote.appliedPromotions.length > 0" class="flex flex-wrap gap-2">
        <PromotionTag v-for="p in cart.quote.appliedPromotions" :key="p.promotionId" :promo="p" />
      </div>
    </template>

    <div v-else class="text-sm text-gray-500 py-4 text-center">
      <p>No quote calculated yet.</p>
    </div>

    <BaseButton
      @click="repriceCart()"
      :loading="loading"
      :variant="cart.quote ? 'secondary' : 'primary'"
      class="w-full"
    >
      {{ cart.quote ? 'Recalculate' : 'Calculate Totals' }}
    </BaseButton>

    <div class="border-t pt-4">
      <PromotionForm />
    </div>
  </div>
</template>
