<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { truncateId, formatDate, formatCurrency } from '@/utils/formatters'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route = useRoute()
const { carts, fetchAllCarts, loading } = useCart()

const userId = route.params.userId as string

onMounted(() => {
  fetchAllCarts(userId)
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">
      Carts for <span class="text-indigo-600">{{ userId }}</span>
    </h1>

    <LoadingSpinner v-if="loading && carts.length === 0" />

    <div v-else-if="carts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="c in carts"
        :key="c.id"
        :to="`/cart/${c.id}`"
        class="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow block"
      >
        <div class="flex items-start justify-between mb-3">
          <p class="text-sm font-mono text-gray-600">{{ truncateId(c.id, 12) }}</p>
          <span
            v-if="c.saved"
            class="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
          >
            Saved
          </span>
        </div>

        <div class="space-y-1 text-sm text-gray-500">
          <p>{{ c.items.length }} item{{ c.items.length !== 1 ? 's' : '' }}</p>
          <p v-if="c.quote" class="font-medium text-gray-900">
            {{ formatCurrency(c.quote.total, c.quote.currency) }}
          </p>
          <p v-else class="text-gray-400 italic">Not priced</p>
        </div>

        <p class="mt-3 text-xs text-gray-400">
          Created {{ formatDate(c.createdAt) }}
        </p>
      </router-link>
    </div>

    <div v-else class="text-center py-16">
      <p class="text-gray-500">No carts found for this user.</p>
      <router-link to="/" class="mt-4 inline-block text-indigo-600 hover:text-indigo-800 text-sm font-medium">
        Create a new cart
      </router-link>
    </div>
  </div>
</template>
