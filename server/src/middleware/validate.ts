import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../types/errors';

export function validateBody(requiredFields: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        throw new ValidationError(`Missing required field: ${field}`);
      }
    }
    next();
  };
}
