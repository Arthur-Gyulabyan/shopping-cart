<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'
import { useCart } from '@/composables/useCart'

const { error, clearError } = useCart()
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ErrorAlert v-if="error" :message="error" @dismiss="clearError" />
      <router-view />
    </main>
    <footer class="text-center text-gray-400 text-sm py-4">
      Cart Microservice
    </footer>
  </div>
</template>
