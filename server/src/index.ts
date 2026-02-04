import dotenv from 'dotenv';
dotenv.config();

import { config } from './config';
import { db } from './db/connection';
import { CartRepository } from './repositories/cart.repository';
import { CartService } from './services/cart.service';
import { CartHandler } from './handlers/cart.handler';
import { createApp } from './app';

const repository = new CartRepository(db);
const service = new CartService(repository);
const handler = new CartHandler(service);
const app = createApp(handler);

app.listen(config.port, () => {
  console.log(`Cart service running on port ${config.port}`);
});
