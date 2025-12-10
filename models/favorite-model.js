/**
 * models/favorite-model.js
 * DB access for favorites
 */

const pool = require("../database/");

/**
 * Add a favorite (ignore if already exists)
 */
async function addFavorite(account_id, inv_id) {
  const sql = `
    INSERT INTO favorite (account_id, inv_id)
    VALUES ($1, $2)
    ON CONFLICT (account_id, inv_id) DO NOTHING;
  `;
  await pool.query(sql, [account_id, inv_id]);
  return true;
}

/**
 * Remove a favorite
 */
async function removeFavorite(account_id, inv_id) {
  const sql = `
    DELETE FROM favorite
    WHERE account_id = $1 AND inv_id = $2;
  `;
  await pool.query(sql, [account_id, inv_id]);
  return true;
}

/**
 * Get all favorites for one account (with vehicle info)
 */
async function getFavoritesByAccountId(account_id) {
  const sql = `
    SELECT
      f.favorite_id,
      f.created_at,
      i.inv_id,
      i.inv_make,
      i.inv_model,
      i.inv_price,
      i.inv_thumbnail
    FROM favorite AS f
      JOIN inventory AS i ON f.inv_id = i.inv_id
    WHERE f.account_id = $1
    ORDER BY f.created_at DESC;
  `;
  const result = await pool.query(sql, [account_id]);
  return result.rows;
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesByAccountId,
};
