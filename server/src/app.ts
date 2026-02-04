import express from 'express';
import { createRoutes } from './routes';
import { errorHandler } from './middleware/error-handler';
import { CartHandler } from './handlers/cart.handler';

export function createApp(handler: CartHandler): express.Application {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use(createRoutes(handler));

  app.use(errorHandler);

  return app;
}
