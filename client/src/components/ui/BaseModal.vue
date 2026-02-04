<script setup lang="ts">
defineProps<{
  open: boolean
  title?: string
}>()

defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black/40" @click="$emit('update:open', false)" />
      <div class="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <button @click="$emit('update:open', false)" class="text-gray-400 hover:text-gray-600">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
