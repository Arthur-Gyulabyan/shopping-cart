<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { truncateId } from '@/utils/formatters'
import CartItemList from '@/components/cart/CartItemList.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import CartActions from '@/components/cart/CartActions.vue'
import ShippingForm from '@/components/cart/ShippingForm.vue'
import AddItemForm from '@/components/cart/AddItemForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route = useRoute()
const { cart, fetchCart, loading } = useCart()
const showAddItem = ref(false)

onMounted(() => {
  fetchCart(route.params.id as string)
})
</script>

<template>
  <LoadingSpinner v-if="loading && !cart" />

  <div v-else-if="cart" class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <p class="text-sm text-gray-500 mt-1">
          Cart {{ truncateId(cart.id) }}
          <span v-if="cart.saved" class="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Saved</span>
        </p>
      </div>
      <BaseButton @click="showAddItem = true">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Item
      </BaseButton>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <CartItemList :items="cart.items" />
      </div>
      <div class="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <CartSummary />
        <CartActions />
      </div>
    </div>

    <ShippingForm />

    <AddItemForm v-model:open="showAddItem" />
  </div>

  <div v-else class="text-center py-16">
    <p class="text-gray-500">Cart not found.</p>
  </div>
</template>
