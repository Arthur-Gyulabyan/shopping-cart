<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  loading?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <button
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      variant === 'danger'
        ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
        : variant === 'secondary'
        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500'
        : variant === 'ghost'
        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-indigo-500'
        : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
    ]"
  >
    <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <slot />
  </button>
</template>
