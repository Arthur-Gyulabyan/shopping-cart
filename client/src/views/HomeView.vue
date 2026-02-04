<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCart } from '@/composables/useCart'

const router = useRouter()
const { createCart, loading } = useCart()

const userId = ref('')
const sessionId = ref('')
const cartId = ref('')
const browseUserId = ref('')

async function handleCreate() {
  const cart = await createCart(userId.value || undefined, sessionId.value || undefined)
  if (cart) {
    router.push(`/cart/${cart.id}`)
  }
}

function handleLoad() {
  if (cartId.value.trim()) {
    router.push(`/cart/${cartId.value.trim()}`)
  }
}

function handleBrowse() {
  if (browseUserId.value.trim()) {
    router.push(`/carts/${browseUserId.value.trim()}`)
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto mt-12 space-y-8">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Start Shopping</h2>
      <form @submit.prevent="handleCreate" class="space-y-4">
        <BaseInput v-model="userId" label="User ID (optional)" placeholder="user-101" />
        <BaseInput v-model="sessionId" label="Session ID (optional)" placeholder="sess-abc" />
        <BaseButton :loading="loading" type="submit" class="w-full">Create New Cart</BaseButton>
      </form>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Load Existing Cart</h2>
      <form @submit.prevent="handleLoad" class="flex gap-3">
        <div class="flex-1">
          <BaseInput v-model="cartId" placeholder="Enter cart ID" />
        </div>
        <BaseButton variant="secondary" type="submit">Load</BaseButton>
      </form>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Browse Saved Carts</h2>
      <form @submit.prevent="handleBrowse" class="flex gap-3">
        <div class="flex-1">
          <BaseInput v-model="browseUserId" placeholder="Enter user ID" />
        </div>
        <BaseButton variant="secondary" type="submit">Browse</BaseButton>
      </form>
    </div>
  </div>
</template>
