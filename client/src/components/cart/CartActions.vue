<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCart } from '@/composables/useCart'

const router = useRouter()
const { cart, saveCart, clearCart, deleteCart, loading } = useCart()

const confirmClear = ref(false)
const confirmDelete = ref(false)

async function handleClear() {
  if (!confirmClear.value) {
    confirmClear.value = true
    return
  }
  await clearCart()
  confirmClear.value = false
}

async function handleDelete() {
  if (!confirmDelete.value) {
    confirmDelete.value = true
    return
  }
  await deleteCart()
  confirmDelete.value = false
  router.push('/')
}
</script>

<template>
  <div v-if="cart" class="bg-white rounded-lg shadow-sm p-4 space-y-3">
    <BaseButton
      v-if="!cart.saved"
      @click="saveCart()"
      :loading="loading"
      variant="secondary"
      class="w-full"
    >
      Save for Later
    </BaseButton>
    <p v-else class="text-sm text-green-600 font-medium text-center py-1">
      Cart saved
    </p>

    <BaseButton
      @click="handleClear"
      :loading="loading"
      variant="secondary"
      class="w-full"
    >
      {{ confirmClear ? 'Confirm Clear?' : 'Clear Cart' }}
    </BaseButton>

    <BaseButton
      @click="handleDelete"
      :loading="loading"
      variant="danger"
      class="w-full"
    >
      {{ confirmDelete ? 'Confirm Delete?' : 'Delete Cart' }}
    </BaseButton>
  </div>
</template>
