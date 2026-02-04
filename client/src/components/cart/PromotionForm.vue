<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCart } from '@/composables/useCart'

const { applyPromotion, loading } = useCart()

const show = ref(false)
const promotionId = ref('')
const code = ref('')
const name = ref('')
const discountAmount = ref('')
const discountType = ref('percentage')

const typeOptions = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'fixed', label: 'Fixed ($)' },
]

async function submit() {
  await applyPromotion(
    promotionId.value,
    name.value,
    Number(discountAmount.value),
    discountType.value as 'percentage' | 'fixed',
    code.value || undefined
  )
  promotionId.value = ''
  code.value = ''
  name.value = ''
  discountAmount.value = ''
  discountType.value = 'percentage'
  show.value = false
}
</script>

<template>
  <div>
    <button
      v-if="!show"
      @click="show = true"
      class="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
    >
      + Add Promotion
    </button>
    <form v-else @submit.prevent="submit" class="space-y-3 mt-3 p-3 bg-gray-50 rounded-md">
      <BaseInput v-model="promotionId" label="Promotion ID" placeholder="PROMO-001" />
      <BaseInput v-model="name" label="Name" placeholder="10% Off Order" />
      <BaseInput v-model="code" label="Code (optional)" placeholder="SAVE10" />
      <div class="grid grid-cols-2 gap-3">
        <BaseInput v-model="discountAmount" label="Amount" type="number" placeholder="10" />
        <BaseSelect v-model="discountType" label="Type" :options="typeOptions" />
      </div>
      <div class="flex gap-2">
        <BaseButton :loading="loading" type="submit" class="flex-1">Apply</BaseButton>
        <BaseButton variant="secondary" @click="show = false" type="button">Cancel</BaseButton>
      </div>
    </form>
  </div>
</template>
