/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('merchants').del()
  await knex('merchants').insert([
    {merchant_name: 'bumi nusantara', phone_number: '+62858777373', longitude: 102.7, latitude: -6.77, recorded_date_time: 'now()'},
    {merchant_name: 'malay nusa indah', phone_number: '+62858742424', longitude: 101.7, latitude: -4.3, recorded_date_time: 'now()'}
  ]);
};
