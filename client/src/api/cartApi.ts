import type {
  Cart,
  CreateCartRequest,
  CartItemInput,
  UpdateItemInput,
  RemoveItemInput,
  ApplyPromotionPayload,
  ShippingPayload,
} from '@/types/cart'

const BASE = '/api/v1'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(body.message || `HTTP ${res.status}`)
  }
  return res.json()
}

export const cartApi = {
  createCart: (payload: CreateCartRequest) =>
    request<Cart>(`${BASE}/create-cart`, { method: 'POST', body: JSON.stringify(payload) }),

  addItem: (id: string, items: CartItemInput[]) =>
    request<Cart>(`${BASE}/add-item`, { method: 'POST', body: JSON.stringify({ id, items }) }),

  updateItemQuantity: (id: string, items: UpdateItemInput[]) =>
    request<Cart>(`${BASE}/update-item-quantity`, { method: 'POST', body: JSON.stringify({ id, items }) }),

  removeItem: (id: string, items: RemoveItemInput[]) =>
    request<Cart>(`${BASE}/remove-item`, { method: 'POST', body: JSON.stringify({ id, items }) }),

  clearCart: (id: string) =>
    request<Cart>(`${BASE}/clear-cart`, { method: 'POST', body: JSON.stringify({ id }) }),

  applyPromotion: (payload: ApplyPromotionPayload) =>
    request<Cart>(`${BASE}/apply-promotion`, { method: 'POST', body: JSON.stringify(payload) }),

  removePromotion: (id: string, promotionId: string) =>
    request<Cart>(`${BASE}/remove-promotion`, { method: 'POST', body: JSON.stringify({ id, promotionId }) }),

  updateShipping: (id: string, shippingEstimation: ShippingPayload) =>
    request<Cart>(`${BASE}/update-shipping`, { method: 'POST', body: JSON.stringify({ id, shippingEstimation }) }),

  repriceCart: (id: string) =>
    request<Cart>(`${BASE}/reprice-cart`, { method: 'POST', body: JSON.stringify({ id }) }),

  saveCart: (id: string) =>
    request<Cart>(`${BASE}/save-cart`, { method: 'POST', body: JSON.stringify({ id }) }),

  deleteCart: (id: string) =>
    request<Cart>(`${BASE}/delete-cart`, { method: 'POST', body: JSON.stringify({ id }) }),

  getCartById: (id: string) =>
    request<Cart>(`${BASE}/get-cart-by-id/${id}`),

  getAllCarts: (userId: string) =>
    request<Cart[]>(`${BASE}/get-all-carts/${userId}`),
}
