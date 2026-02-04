<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'

const router = useRouter()
const { cart } = useCart()
const userIdInput = ref('')

function goToSavedCarts() {
  if (userIdInput.value.trim()) {
    router.push(`/carts/${userIdInput.value.trim()}`)
  }
}
</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 text-indigo-600 font-semibold text-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        Shopping Cart
      </router-link>

      <div class="flex items-center gap-4">
        <div class="hidden sm:flex items-center gap-2">
          <input
            v-model="userIdInput"
            type="text"
            placeholder="User ID"
            class="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-36"
            @keyup.enter="goToSavedCarts"
          />
          <button
            @click="goToSavedCarts"
            class="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            My Carts
          </button>
        </div>

        <router-link
          v-if="cart"
          :to="`/cart/${cart.id}`"
          class="relative text-gray-600 hover:text-indigo-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <span
            v-if="cart.items.length > 0"
            class="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          >
            {{ cart.items.length }}
          </span>
        </router-link>
      </div>
    </div>
  </header>
</template>
