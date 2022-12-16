/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('merchants', function (table) {
    table.increments('id');
    table.string('merchant_name', 255)
    table.string('phone_number', 255);
    table.decimal('latitude');
    table.decimal('longitude');
    table.boolean('is_active').defaultTo(false);
    table.timestamp('recorded_date_time').defaultTo(knex.fn.now());
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
  .dropTable("merchants")
};
