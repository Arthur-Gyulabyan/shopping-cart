import dotenv from 'dotenv';
dotenv.config();

import type { Knex } from 'knex';

const config: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/shopping_cart',
  migrations: {
    directory: './src/db/migrations',
    extension: 'ts',
  },
};

export default config;
