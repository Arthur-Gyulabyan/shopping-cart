import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE TABLE carts (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id         VARCHAR(255),
      session_id      VARCHAR(255),
      saved           BOOLEAN NOT NULL DEFAULT false,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),

      -- ShippingEstimation (embedded 1:1)
      shipping_country       VARCHAR(10),
      shipping_region        VARCHAR(100),
      shipping_postal_code   VARCHAR(20),
      shipping_method        VARCHAR(20) CHECK (shipping_method IN ('standard', 'express', 'overnight')),

      -- Quote (embedded 1:1)
      quote_subtotal         NUMERIC(12,2),
      quote_tax              NUMERIC(12,2),
      quote_shipping         NUMERIC(12,2),
      quote_discount         NUMERIC(12,2),
      quote_total            NUMERIC(12,2),
      quote_currency         VARCHAR(3),
      quote_calculated_at    TIMESTAMPTZ
    );

    CREATE INDEX idx_carts_user_id ON carts(user_id);
    CREATE INDEX idx_carts_user_id_saved ON carts(user_id, saved);
  `);

  await knex.schema.raw(`
    CREATE TABLE cart_items (
      cart_id     UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
      product_id  VARCHAR(255) NOT NULL,
      sku         VARCHAR(255) NOT NULL,
      name        VARCHAR(500) NOT NULL,
      quantity    INTEGER NOT NULL CHECK (quantity > 0),
      unit_price  NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
      currency    VARCHAR(3) NOT NULL DEFAULT 'USD',
      image_url   TEXT,
      PRIMARY KEY (cart_id, product_id)
    );
  `);

  await knex.schema.raw(`
    CREATE TABLE applied_promotions (
      cart_id         UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
      promotion_id    VARCHAR(255) NOT NULL,
      code            VARCHAR(100),
      name            VARCHAR(255) NOT NULL,
      discount_amount NUMERIC(12,2) NOT NULL,
      discount_type   VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
      description     TEXT,
      PRIMARY KEY (cart_id, promotion_id)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE IF EXISTS applied_promotions');
  await knex.schema.raw('DROP TABLE IF EXISTS cart_items');
  await knex.schema.raw('DROP TABLE IF EXISTS carts');
}
