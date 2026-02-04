<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCart } from '@/composables/useCart'

const { cart, updateShipping, repriceCart, loading } = useCart()

const show = ref(false)
const country = ref('')
const region = ref('')
const postalCode = ref('')
const shippingMethod = ref('')

const methodOptions = [
  { value: 'standard', label: 'Standard ($5.99)' },
  { value: 'express', label: 'Express ($12.99)' },
  { value: 'overnight', label: 'Overnight ($24.99)' },
]

watch(() => cart.value?.shippingEstimation, (s) => {
  if (s) {
    country.value = s.country
    region.value = s.region || ''
    postalCode.value = s.postalCode || ''
    shippingMethod.value = s.shippingMethod || ''
  }
}, { immediate: true })

async function submit() {
  await updateShipping({
    country: country.value,
    region: region.value || undefined,
    postalCode: postalCode.value || undefined,
    shippingMethod: (shippingMethod.value as any) || undefined,
  })
  await repriceCart()
  show.value = false
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-4">
    <button
      @click="show = !show"
      class="flex items-center justify-between w-full text-left"
    >
      <h3 class="text-sm font-semibold text-gray-900">Shipping</h3>
      <svg
        :class="['h-5 w-5 text-gray-400 transition-transform', show && 'rotate-180']"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div v-if="!show && cart?.shippingEstimation" class="mt-2 text-sm text-gray-600">
      {{ cart.shippingEstimation.country }}
      <span v-if="cart.shippingEstimation.region">, {{ cart.shippingEstimation.region }}</span>
      <span v-if="cart.shippingEstimation.postalCode"> {{ cart.shippingEstimation.postalCode }}</span>
      <span v-if="cart.shippingEstimation.shippingMethod" class="ml-2 text-gray-400">
        ({{ cart.shippingEstimation.shippingMethod }})
      </span>
    </div>

    <form v-if="show" @submit.prevent="submit" class="mt-4 space-y-3">
      <BaseInput v-model="country" label="Country" placeholder="US" />
      <div class="grid grid-cols-2 gap-3">
        <BaseInput v-model="region" label="Region" placeholder="California" />
        <BaseInput v-model="postalCode" label="Postal Code" placeholder="90210" />
      </div>
      <BaseSelect v-model="shippingMethod" label="Shipping Method" :options="methodOptions" placeholder="Select method" />
      <BaseButton :loading="loading" type="submit" class="w-full">Update Shipping</BaseButton>
    </form>
  </div>
</template>
