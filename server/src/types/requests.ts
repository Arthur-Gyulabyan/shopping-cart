export interface CreateCartRequest {
  userId?: string;
  sessionId?: string;
}

export interface AddItemRequest {
  id: string;
  items?: CartItemInput[];
}

export interface CartItemInput {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
}

export interface UpdateItemQuantityRequest {
  id: string;
  items?: UpdateItemInput[];
}

export interface UpdateItemInput {
  productId: string;
  quantity: number;
}

export interface RemoveItemRequest {
  id: string;
  items?: RemoveItemInput[];
}

export interface RemoveItemInput {
  productId: string;
}

export interface ClearCartRequest {
  id: string;
}

export interface ApplyPromotionRequest {
  id: string;
  promotionId?: string;
  code?: string;
  name?: string;
  discountAmount?: number;
  discountType?: string;
}

export interface RemovePromotionRequest {
  id: string;
  promotionId?: string;
}

export interface UpdateShippingRequest {
  id: string;
  shippingEstimation?: {
    country: string;
    region?: string;
    postalCode?: string;
    shippingMethod?: 'standard' | 'express' | 'overnight';
  };
}

export interface RepriceCartRequest {
  id: string;
}

export interface SaveCartRequest {
  id: string;
}

export interface DeleteCartRequest {
  id: string;
}
