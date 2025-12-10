/**
 * models/favorite-model.js
 * Favorite data access functions
 */

const pool = require("../database/");

/**
 * Add favorite (ignore if already exists)
 */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO public.favorite (account_id, inv_id)
      VALUES ($1, $2)
      ON CONFLICT (account_id, inv_id) DO NOTHING
      RETURNING favorite_id;
    `;
    const data = await pool.query(sql, [account_id, inv_id]);
    // 如果是重复收藏，rows[0] 会是 undefined，这里可以直接返回
    return data.rows[0];
  } catch (error) {
    console.error("addFavorite error:", error);
    throw error;
  }
}

/**
 * Remove favorite
 */
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = `
      DELETE FROM public.favorite
      WHERE account_id = $1 AND inv_id = $2;
    `;
    const data = await pool.query(sql, [account_id, inv_id]);
    return data.rowCount; // 删除了多少条
  } catch (error) {
    console.error("removeFavorite error:", error);
    throw error;
  }
}

/**
 * Check if this vehicle is already favorited by this user
 */
async function isFavorite(account_id, inv_id) {
  try {
    const sql = `
      SELECT 1
      FROM public.favorite
      WHERE account_id = $1 AND inv_id = $2
      LIMIT 1;
    `;
    const data = await pool.query(sql, [account_id, inv_id]);
    return data.rowCount > 0;
  } catch (error) {
    console.error("isFavorite error:", error);
    throw error;
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  isFavorite,
};
