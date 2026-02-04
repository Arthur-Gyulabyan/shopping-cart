import { Router } from 'express';
import { createCartRoutes } from './cart.routes';
import { CartHandler } from '../handlers/cart.handler';

export function createRoutes(handler: CartHandler): Router {
  const router = Router();
  router.use('/api/v1', createCartRoutes(handler));
  return router;
}
