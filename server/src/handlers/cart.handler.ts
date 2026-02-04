import type { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service';

export class CartHandler {
  constructor(private service: CartService) {}

  createCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.service.createCart(req.body);
      res.status(200).json(cart);
    } catch (err) { next(err); }
  };

  getCartById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.service.getCartById(req.params.id as string);
      res.status(200).json(cart);
    } catch (err) { next(err); }
  };

  getAllCarts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const carts = await this.service.getAllCarts(req.params.userId as string);
      res.status(200).json(carts);
    } catch (err) { next(err); }
  };

  addItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.service.addItem(req.body);
      res.status(200).json(cart);
    } catch (err) { next(err); }
  };

  updateItemQuantity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.service.updateItemQuantity(req.body);
      res.status(200).json(cart);
    } catch (err) { next(err); }
  };

  removeItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.service.removeItem(req.body);
      res.status(200).json(cart);
    } catch (err) { next(err); }
  };

  clearCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.service.clearCart(req.body);
      res.status(200).json(cart);
    } catch (err) { next(err); }
  };

  applyPromotion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.service.applyPromotion(req.body);
      res.status(200).json(cart);
    } catch (err) { next(err); }
  };

  removePromotion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.service.removePromotion(req.body);
      res.status(200).json(cart);
    } catch (err) { next(err); }
  };

  updateShipping = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.service.updateShipping(req.body);
      res.status(200).json(cart);
    } catch (err) { next(err); }
  };

  repriceCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.service.repriceCart(req.body);
      res.status(200).json(cart);
    } catch (err) { next(err); }
  };

  saveCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.service.saveCart(req.body);
      res.status(200).json(cart);
    } catch (err) { next(err); }
  };

  deleteCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.service.deleteCart(req.body);
      res.status(200).json(cart);
    } catch (err) { next(err); }
  };
}
