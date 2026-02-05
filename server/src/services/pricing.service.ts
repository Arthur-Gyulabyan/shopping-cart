import type { CartItem, AppliedPromotion, ShippingMethod } from '../types/entities';

export interface PricingInput {
  items: CartItem[];
  promotions: AppliedPromotion[];
  shippingMethod: ShippingMethod | null;
}

export interface PricingResult {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  calculatedAt: string;
}

const SHIPPING_COSTS: Record<ShippingMethod, number> = {
  standard: 5.99,
  express: 12.99,
  overnight: 24.99,
};

const TAX_RATE = 0.10;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateQuote(input: PricingInput): PricingResult {
  const subtotal = round2(
    input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  );

  const discount = round2(
    input.promotions.reduce((sum, promo) => {
      if (promo.discountType === 'percentage') {
        return sum + subtotal * (promo.discountAmount / 100);
      }
      return sum + promo.discountAmount;
    }, 0)
  );

  const taxableAmount = Math.max(0, round2(subtotal - discount));
  const tax = round2(taxableAmount * TAX_RATE);

  const shipping = input.shippingMethod
    ? SHIPPING_COSTS[input.shippingMethod]
    : 0;

  const total = round2(taxableAmount + tax + shipping);

  const currency = 'USD';

  return {
    subtotal,
    discount,
    tax,
    shipping,
    total,
    currency,
    calculatedAt: new Date().toISOString(),
  };
}
