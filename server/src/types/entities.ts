export interface Cart {
  id: string;
  userId: string | null;
  sessionId: string | null;
  saved: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  items: CartItem[];
  quote: Quote | null;
  shippingEstimation: ShippingEstimation | null;
}

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  imageUrl: string | null;
}

export interface Quote {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  calculatedAt: string;
  appliedPromotions: AppliedPromotion[];
}

export interface AppliedPromotion {
  promotionId: string;
  code: string | null;
  name: string;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  description: string | null;
}

export interface ShippingEstimation {
  country: string;
  region: string | null;
  postalCode: string | null;
  shippingMethod: ShippingMethod | null;
}

export type ShippingMethod = 'standard' | 'express' | 'overnight';
