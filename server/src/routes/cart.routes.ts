import { Router } from 'express';
import { CartHandler } from '../handlers/cart.handler';
import { validateBody } from '../middleware/validate';

export function createCartRoutes(handler: CartHandler): Router {
  const router = Router();

  // Commands (POST)
  router.post('/create-cart',          handler.createCart);
  router.post('/add-item',             validateBody(['id']), handler.addItem);
  router.post('/update-item-quantity',  validateBody(['id']), handler.updateItemQuantity);
  router.post('/remove-item',          validateBody(['id']), handler.removeItem);
  router.post('/clear-cart',           validateBody(['id']), handler.clearCart);
  router.post('/apply-promotion',      validateBody(['id']), handler.applyPromotion);
  router.post('/remove-promotion',     validateBody(['id']), handler.removePromotion);
  router.post('/update-shipping',      validateBody(['id']), handler.updateShipping);
  router.post('/reprice-cart',         validateBody(['id']), handler.repriceCart);
  router.post('/save-cart',            validateBody(['id']), handler.saveCart);
  router.post('/delete-cart',          validateBody(['id']), handler.deleteCart);

  // Queries (GET)
  router.get('/get-cart-by-id/:id',    handler.getCartById);
  router.get('/get-all-carts/:userId', handler.getAllCarts);

  return router;
}
