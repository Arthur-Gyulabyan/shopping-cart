import type { Knex } from 'knex';
import type { Cart, CartItem, AppliedPromotion, Quote, ShippingEstimation } from '../types/entities';
import type { CartItemInput, UpdateItemInput, RemoveItemInput } from '../types/requests';

export class CartRepository {
  constructor(private db: Knex) {}

  async findById(id: string): Promise<Cart | null> {
    return this.getFullCart(id);
  }

  async findAllByUserId(userId: string): Promise<Cart[]> {
    const rows = await this.db('carts').where('user_id', userId).orderBy('created_at', 'desc');
    if (rows.length === 0) return [];

    const cartIds = rows.map((r: Record<string, unknown>) => r.id as string);

    const [itemRows, promoRows] = await Promise.all([
      this.db('cart_items').whereIn('cart_id', cartIds as string[]).orderBy('product_id'),
      this.db('applied_promotions').whereIn('cart_id', cartIds as string[]).orderBy('promotion_id'),
    ]);

    const itemsByCartId = this.groupBy(itemRows, 'cart_id');
    const promosByCartId = this.groupBy(promoRows, 'cart_id');

    return rows.map((row: Record<string, unknown>) => {
      const id = row.id as string;
      return this.assembleCart(
        row,
        (itemsByCartId[id] || []) as Record<string, unknown>[],
        (promosByCartId[id] || []) as Record<string, unknown>[]
      );
    });
  }

  async create(userId: string | null, sessionId: string | null): Promise<Cart> {
    const id = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    await this.db('carts').insert({
      id,
      user_id: userId,
      session_id: sessionId,
      saved: false,
      created_at: now,
      updated_at: now,
      expires_at: expiresAt,
    });

    return (await this.getFullCart(id))!;
  }

  async save(id: string): Promise<void> {
    await this.db('carts').where('id', id).update({
      saved: true,
      updated_at: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.db('carts').where('id', id).delete();
  }

  async addItems(cartId: string, items: CartItemInput[]): Promise<void> {
    for (const item of items) {
      await this.db.raw(
        `INSERT INTO cart_items (cart_id, product_id, name, quantity, unit_price, image_url)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT (cart_id, product_id) DO UPDATE SET
           quantity = cart_items.quantity + EXCLUDED.quantity,
           name = EXCLUDED.name,
           unit_price = EXCLUDED.unit_price,
           image_url = EXCLUDED.image_url`,
        [cartId, item.productId, item.name, item.quantity, item.unitPrice, item.imageUrl || null]
      );
    }
    await this.touchUpdatedAt(cartId);
    await this.nullifyQuote(cartId);
  }

  async updateItemQuantity(cartId: string, items: UpdateItemInput[]): Promise<void> {
    for (const item of items) {
      await this.db('cart_items')
        .where({ cart_id: cartId, product_id: item.productId })
        .update({ quantity: item.quantity });
    }
    await this.touchUpdatedAt(cartId);
    await this.nullifyQuote(cartId);
  }

  async removeItems(cartId: string, items: RemoveItemInput[]): Promise<void> {
    for (const item of items) {
      await this.db('cart_items')
        .where({ cart_id: cartId, product_id: item.productId })
        .delete();
    }
    await this.touchUpdatedAt(cartId);
    await this.nullifyQuote(cartId);
  }

  async clearItems(cartId: string): Promise<void> {
    await this.db('cart_items').where('cart_id', cartId).delete();
    await this.touchUpdatedAt(cartId);
    await this.nullifyQuote(cartId);
  }

  async addPromotion(cartId: string, promo: AppliedPromotion): Promise<void> {
    await this.db('applied_promotions').insert({
      cart_id: cartId,
      promotion_id: promo.promotionId,
      code: promo.code,
      name: promo.name,
      discount_amount: promo.discountAmount,
      discount_type: promo.discountType,
      description: promo.description,
    });
    await this.touchUpdatedAt(cartId);
    await this.nullifyQuote(cartId);
  }

  async removePromotion(cartId: string, promotionId: string): Promise<void> {
    await this.db('applied_promotions')
      .where({ cart_id: cartId, promotion_id: promotionId })
      .delete();
    await this.touchUpdatedAt(cartId);
    await this.nullifyQuote(cartId);
  }

  async getPromotions(cartId: string): Promise<AppliedPromotion[]> {
    const rows = await this.db('applied_promotions')
      .where('cart_id', cartId)
      .orderBy('promotion_id');
    return rows.map((r: Record<string, unknown>) => this.toAppliedPromotion(r));
  }

  async updateShipping(cartId: string, shipping: ShippingEstimation): Promise<void> {
    await this.db('carts').where('id', cartId).update({
      shipping_country: shipping.country,
      shipping_region: shipping.region,
      shipping_postal_code: shipping.postalCode,
      shipping_method: shipping.shippingMethod,
      updated_at: new Date(),
    });
    await this.nullifyQuote(cartId);
  }

  async updateQuote(cartId: string, quote: Omit<Quote, 'appliedPromotions'>): Promise<void> {
    await this.db('carts').where('id', cartId).update({
      quote_subtotal: quote.subtotal,
      quote_tax: quote.tax,
      quote_shipping: quote.shipping,
      quote_discount: quote.discount,
      quote_total: quote.total,
      quote_currency: quote.currency,
      quote_calculated_at: quote.calculatedAt,
      updated_at: new Date(),
    });
  }

  async cartExists(id: string): Promise<boolean> {
    const row = await this.db('carts').where('id', id).select('id').first();
    return !!row;
  }

  async promotionExists(cartId: string, promotionId: string): Promise<boolean> {
    const row = await this.db('applied_promotions')
      .where({ cart_id: cartId, promotion_id: promotionId })
      .select('promotion_id')
      .first();
    return !!row;
  }

  // --- Private helpers ---

  private async getFullCart(id: string): Promise<Cart | null> {
    const row = await this.db('carts').where('id', id).first();
    if (!row) return null;

    const [itemRows, promoRows] = await Promise.all([
      this.db('cart_items').where('cart_id', id).orderBy('product_id'),
      this.db('applied_promotions').where('cart_id', id).orderBy('promotion_id'),
    ]);

    return this.assembleCart(row, itemRows, promoRows);
  }

  private assembleCart(
    row: Record<string, unknown>,
    itemRows: Record<string, unknown>[],
    promoRows: Record<string, unknown>[]
  ): Cart {
    const items = itemRows.map((r) => this.toCartItem(r));
    const promotions = promoRows.map((r) => this.toAppliedPromotion(r));

    let quote: Quote | null = null;
    if (row.quote_subtotal != null) {
      quote = {
        subtotal: Number(row.quote_subtotal),
        tax: Number(row.quote_tax),
        shipping: Number(row.quote_shipping),
        discount: Number(row.quote_discount),
        total: Number(row.quote_total),
        currency: row.quote_currency as string,
        calculatedAt: (row.quote_calculated_at as Date).toISOString(),
        appliedPromotions: promotions,
      };
    }

    let shippingEstimation: ShippingEstimation | null = null;
    if (row.shipping_country) {
      shippingEstimation = {
        country: row.shipping_country as string,
        region: (row.shipping_region as string) || null,
        postalCode: (row.shipping_postal_code as string) || null,
        shippingMethod: (row.shipping_method as ShippingEstimation['shippingMethod']) || null,
      };
    }

    return {
      id: row.id as string,
      userId: (row.user_id as string) || null,
      sessionId: (row.session_id as string) || null,
      saved: row.saved as boolean,
      createdAt: (row.created_at as Date).toISOString(),
      updatedAt: (row.updated_at as Date).toISOString(),
      expiresAt: (row.expires_at as Date).toISOString(),
      items,
      quote,
      shippingEstimation,
    };
  }

  private toCartItem(row: Record<string, unknown>): CartItem {
    return {
      productId: row.product_id as string,
      name: row.name as string,
      quantity: Number(row.quantity),
      unitPrice: Number(row.unit_price),
      imageUrl: (row.image_url as string) || null,
    };
  }

  private toAppliedPromotion(row: Record<string, unknown>): AppliedPromotion {
    return {
      promotionId: row.promotion_id as string,
      code: (row.code as string) || null,
      name: row.name as string,
      discountAmount: Number(row.discount_amount),
      discountType: row.discount_type as 'percentage' | 'fixed',
      description: (row.description as string) || null,
    };
  }

  private async touchUpdatedAt(id: string): Promise<void> {
    await this.db('carts').where('id', id).update({ updated_at: new Date() });
  }

  private async nullifyQuote(cartId: string): Promise<void> {
    await this.db('carts').where('id', cartId).update({
      quote_subtotal: null,
      quote_tax: null,
      quote_shipping: null,
      quote_discount: null,
      quote_total: null,
      quote_currency: null,
      quote_calculated_at: null,
    });
  }

  private groupBy(rows: Record<string, unknown>[], key: string): Record<string, Record<string, unknown>[]> {
    const result: Record<string, Record<string, unknown>[]> = {};
    for (const row of rows) {
      const k = row[key] as string;
      if (!result[k]) result[k] = [];
      result[k].push(row);
    }
    return result;
  }
}
