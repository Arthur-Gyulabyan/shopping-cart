<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCart } from '@/composables/useCart'

const open = defineModel<boolean>('open', { default: false })
const { addItem, loading } = useCart()

const productId = ref('')
const name = ref('')
const quantity = ref('1')
const unitPrice = ref('')

async function submit() {
  await addItem([{
    productId: productId.value,
    name: name.value,
    quantity: Number(quantity.value),
    unitPrice: Number(unitPrice.value),
  }])
  productId.value = ''
  name.value = ''
  quantity.value = '1'
  unitPrice.value = ''
  open.value = false
}
</script>

<template>
  <BaseModal v-model:open="open" title="Add Item to Cart">
    <form @submit.prevent="submit" class="space-y-4">
      <BaseInput v-model="productId" label="Product ID" placeholder="PROD-001" />
      <BaseInput v-model="name" label="Product Name" placeholder="Classic T-Shirt" />
      <div class="grid grid-cols-2 gap-3">
        <BaseInput v-model="quantity" label="Quantity" type="number" placeholder="1" />
        <BaseInput v-model="unitPrice" label="Unit Price" type="number" placeholder="29.99" />
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <BaseButton variant="secondary" @click="open = false" type="button">Cancel</BaseButton>
        <BaseButton :loading="loading" type="submit">Add Item</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
