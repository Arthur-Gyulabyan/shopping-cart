import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CartView from '@/views/CartView.vue'
import SavedCartsView from '@/views/SavedCartsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/cart/:id', name: 'cart', component: CartView },
    { path: '/carts/:userId', name: 'saved-carts', component: SavedCartsView },
  ],
})

export default router
