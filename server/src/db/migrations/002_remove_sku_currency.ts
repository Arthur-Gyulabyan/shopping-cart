import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cart_items', (table) => {
    table.dropColumn('sku');
    table.dropColumn('currency');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cart_items', (table) => {
    table.string('sku', 255).notNullable().defaultTo('');
    table.string('currency', 3).notNullable().defaultTo('USD');
  });
}
