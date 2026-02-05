import { ref } from 'vue'
import type { Cart, CartItemInput, UpdateItemInput, RemoveItemInput, ShippingPayload } from '@/types/cart'
import { cartApi } from '@/api/cartApi'

const cart = ref<Cart | null>(null)
const carts = ref<Cart[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

async function run<T>(fn: () => Promise<T>): Promise<T | null> {
  loading.value = true
  error.value = null
  try {
    return await fn()
  } catch (err: any) {
    error.value = err.message || 'An error occurred'
    return null
  } finally {
    loading.value = false
  }
}

export function useCart() {
  async function createCart(userId?: string, sessionId?: string) {
    const result = await run(() => cartApi.createCart({ userId, sessionId }))
    if (result) cart.value = result
    return result
  }

  async function fetchCart(id: string) {
    const result = await run(() => cartApi.getCartById(id))
    if (result) cart.value = result
    return result
  }

  async function fetchAllCarts(userId: string) {
    const result = await run(() => cartApi.getAllCarts(userId))
    if (result) carts.value = result
    return result
  }

  async function addItem(items: CartItemInput[]) {
    if (!cart.value) return
    const result = await run(() => cartApi.addItem(cart.value!.id, items))
    if (result) cart.value = result
  }

  async function updateQuantity(productId: string, quantity: number) {
    if (!cart.value) return
    const result = await run(() =>
      cartApi.updateItemQuantity(cart.value!.id, [{ productId, quantity }])
    )
    if (result) cart.value = result
  }

  async function removeItem(productId: string) {
    if (!cart.value) return
    const result = await run(() =>
      cartApi.removeItem(cart.value!.id, [{ productId }])
    )
    if (result) cart.value = result
  }

  async function clearCart() {
    if (!cart.value) return
    const result = await run(() => cartApi.clearCart(cart.value!.id))
    if (result) cart.value = result
  }

  async function applyPromotion(promotionId: string, name: string, discountAmount: number, discountType: 'percentage' | 'fixed', code?: string) {
    if (!cart.value) return
    const result = await run(() =>
      cartApi.applyPromotion({ id: cart.value!.id, promotionId, name, discountAmount, discountType, code })
    )
    if (result) cart.value = result
  }

  async function removePromotion(promotionId: string) {
    if (!cart.value) return
    const result = await run(() => cartApi.removePromotion(cart.value!.id, promotionId))
    if (result) cart.value = result
  }

  async function updateShipping(shipping: ShippingPayload) {
    if (!cart.value) return
    const result = await run(() => cartApi.updateShipping(cart.value!.id, shipping))
    if (result) cart.value = result
  }

  async function repriceCart() {
    if (!cart.value) return
    const result = await run(() => cartApi.repriceCart(cart.value!.id))
    if (result) cart.value = result
  }

  async function saveCart() {
    if (!cart.value) return
    const result = await run(() => cartApi.saveCart(cart.value!.id))
    if (result) cart.value = result
  }

  async function deleteCart() {
    if (!cart.value) return
    const result = await run(() => cartApi.deleteCart(cart.value!.id))
    if (result) cart.value = null
  }

  function clearError() {
    error.value = null
  }

  return {
    cart,
    carts,
    loading,
    error,
    createCart,
    fetchCart,
    fetchAllCarts,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    applyPromotion,
    removePromotion,
    updateShipping,
    repriceCart,
    saveCart,
    deleteCart,
    clearError,
  }
}
