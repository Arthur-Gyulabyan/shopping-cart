<script setup lang="ts">
defineProps<{ message: string }>()
defineEmits<{ dismiss: [] }>()
</script>

<template>
  <div class="mb-4 rounded-md bg-red-50 border border-red-200 p-4 flex items-start gap-3">
    <svg class="h-5 w-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
    </svg>
    <p class="text-sm text-red-700 flex-1">{{ message }}</p>
    <button @click="$emit('dismiss')" class="text-red-400 hover:text-red-600">
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
