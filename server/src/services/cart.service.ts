import type { Cart } from '../types/entities';
import type {
  CreateCartRequest,
  AddItemRequest,
  UpdateItemQuantityRequest,
  RemoveItemRequest,
  ClearCartRequest,
  ApplyPromotionRequest,
  RemovePromotionRequest,
  UpdateShippingRequest,
  RepriceCartRequest,
  SaveCartRequest,
  DeleteCartRequest,
} from '../types/requests';
import { NotFoundError, ValidationError, ConflictError } from '../types/errors';
import { CartRepository } from '../repositories/cart.repository';
import { calculateQuote } from './pricing.service';

export class CartService {
  constructor(private repo: CartRepository) {}

  async createCart(req: CreateCartRequest): Promise<Cart> {
    return this.repo.create(req.userId || null, req.sessionId || null);
  }

  async getCartById(id: string): Promise<Cart> {
    const cart = await this.repo.findById(id);
    if (!cart) throw new NotFoundError('Cart', id);
    return cart;
  }

  async getAllCarts(userId: string): Promise<Cart[]> {
    return this.repo.findAllByUserId(userId);
  }

  async addItem(req: AddItemRequest): Promise<Cart> {
    await this.ensureCartExists(req.id);

    if (!req.items || req.items.length === 0) {
      throw new ValidationError('At least one item is required');
    }

    for (const item of req.items) {
      if (!item.productId) throw new ValidationError('productId is required for each item');
      if (!item.name) throw new ValidationError('name is required for each item');
      if (!item.quantity || item.quantity <= 0) throw new ValidationError('quantity must be greater than 0');
      if (item.unitPrice == null || item.unitPrice < 0) throw new ValidationError('unitPrice must be >= 0');
    }

    await this.repo.addItems(req.id, req.items);
    return (await this.repo.findById(req.id))!;
  }

  async updateItemQuantity(req: UpdateItemQuantityRequest): Promise<Cart> {
    await this.ensureCartExists(req.id);

    if (!req.items || req.items.length === 0) {
      throw new ValidationError('At least one item is required');
    }

    for (const item of req.items) {
      if (!item.productId) throw new ValidationError('productId is required');
      if (!item.quantity || item.quantity <= 0) throw new ValidationError('quantity must be greater than 0');
    }

    await this.repo.updateItemQuantity(req.id, req.items);
    return (await this.repo.findById(req.id))!;
  }

  async removeItem(req: RemoveItemRequest): Promise<Cart> {
    await this.ensureCartExists(req.id);

    if (!req.items || req.items.length === 0) {
      throw new ValidationError('At least one item is required');
    }

    await this.repo.removeItems(req.id, req.items);
    return (await this.repo.findById(req.id))!;
  }

  async clearCart(req: ClearCartRequest): Promise<Cart> {
    await this.ensureCartExists(req.id);
    await this.repo.clearItems(req.id);
    return (await this.repo.findById(req.id))!;
  }

  async applyPromotion(req: ApplyPromotionRequest): Promise<Cart> {
    await this.ensureCartExists(req.id);

    if (!req.promotionId) throw new ValidationError('promotionId is required');
    if (!req.name) throw new ValidationError('name is required');
    if (req.discountAmount == null) throw new ValidationError('discountAmount is required');
    if (!req.discountType) throw new ValidationError('discountType is required');
    if (req.discountType !== 'percentage' && req.discountType !== 'fixed') {
      throw new ValidationError('discountType must be "percentage" or "fixed"');
    }

    const exists = await this.repo.promotionExists(req.id, req.promotionId);
    if (exists) {
      throw new ConflictError(`Promotion '${req.promotionId}' is already applied to this cart`);
    }

    await this.repo.addPromotion(req.id, {
      promotionId: req.promotionId,
      code: req.code || null,
      name: req.name,
      discountAmount: req.discountAmount,
      discountType: req.discountType as 'percentage' | 'fixed',
      description: null,
    });

    return (await this.repo.findById(req.id))!;
  }

  async removePromotion(req: RemovePromotionRequest): Promise<Cart> {
    await this.ensureCartExists(req.id);

    if (!req.promotionId) throw new ValidationError('promotionId is required');

    await this.repo.removePromotion(req.id, req.promotionId);
    return (await this.repo.findById(req.id))!;
  }

  async updateShipping(req: UpdateShippingRequest): Promise<Cart> {
    await this.ensureCartExists(req.id);

    if (!req.shippingEstimation) {
      throw new ValidationError('shippingEstimation is required');
    }
    if (!req.shippingEstimation.country) {
      throw new ValidationError('country is required');
    }

    const validMethods = ['standard', 'express', 'overnight'];
    if (req.shippingEstimation.shippingMethod && !validMethods.includes(req.shippingEstimation.shippingMethod)) {
      throw new ValidationError('shippingMethod must be "standard", "express", or "overnight"');
    }

    await this.repo.updateShipping(req.id, {
      country: req.shippingEstimation.country,
      region: req.shippingEstimation.region || null,
      postalCode: req.shippingEstimation.postalCode || null,
      shippingMethod: req.shippingEstimation.shippingMethod || null,
    });

    return (await this.repo.findById(req.id))!;
  }

  async repriceCart(req: RepriceCartRequest): Promise<Cart> {
    const cart = await this.getCartById(req.id);

    const promotions = await this.repo.getPromotions(req.id);

    const result = calculateQuote({
      items: cart.items,
      promotions,
      shippingMethod: cart.shippingEstimation?.shippingMethod || null,
    });

    await this.repo.updateQuote(req.id, result);
    return (await this.repo.findById(req.id))!;
  }

  async saveCart(req: SaveCartRequest): Promise<Cart> {
    await this.ensureCartExists(req.id);
    await this.repo.save(req.id);
    return (await this.repo.findById(req.id))!;
  }

  async deleteCart(req: DeleteCartRequest): Promise<Cart> {
    const cart = await this.getCartById(req.id);
    await this.repo.delete(req.id);
    return cart;
  }

  private async ensureCartExists(id: string): Promise<void> {
    const exists = await this.repo.cartExists(id);
    if (!exists) throw new NotFoundError('Cart', id);
  }
}
