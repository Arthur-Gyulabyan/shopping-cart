<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCart } from '@/composables/useCart'

const open = defineModel<boolean>('open', { default: false })
const { addItem, loading } = useCart()

const productId = ref('')
const sku = ref('')
const name = ref('')
const quantity = ref('1')
const unitPrice = ref('')
const currency = ref('USD')

async function submit() {
  await addItem([{
    productId: productId.value,
    sku: sku.value,
    name: name.value,
    quantity: Number(quantity.value),
    unitPrice: Number(unitPrice.value),
    currency: currency.value,
  }])
  productId.value = ''
  sku.value = ''
  name.value = ''
  quantity.value = '1'
  unitPrice.value = ''
  currency.value = 'USD'
  open.value = false
}
</script>

<template>
  <BaseModal v-model:open="open" title="Add Item to Cart">
    <form @submit.prevent="submit" class="space-y-4">
      <BaseInput v-model="productId" label="Product ID" placeholder="PROD-001" />
      <BaseInput v-model="sku" label="SKU" placeholder="SKU-BLK-M" />
      <BaseInput v-model="name" label="Product Name" placeholder="Classic T-Shirt" />
      <div class="grid grid-cols-3 gap-3">
        <BaseInput v-model="quantity" label="Quantity" type="number" placeholder="1" />
        <BaseInput v-model="unitPrice" label="Unit Price" type="number" placeholder="29.99" />
        <BaseInput v-model="currency" label="Currency" placeholder="USD" />
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <BaseButton variant="secondary" @click="open = false" type="button">Cancel</BaseButton>
        <BaseButton :loading="loading" type="submit">Add Item</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
