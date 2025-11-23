// models/inventory-model.js
const pool = require("../database/");

/**
 * Get all classifications for nav and selects
 */
async function getClassifications() {
  const data = await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
  return data.rows;
}

/**
 * Get inventory list by classification id
 */
async function getInventoryByClassificationId(classificationId) {
  const sql = `
    SELECT i.*, c.classification_name
    FROM public.inventory AS i
    JOIN public.classification AS c
      ON i.classification_id = c.classification_id
    WHERE i.classification_id = $1
    ORDER BY i.inv_make, i.inv_model
  `;
  const data = await pool.query(sql, [classificationId]);
  return data.rows;
}

/**
 * Get one vehicle by inv_id (prepared statement)
 */
async function getVehicleById(invId) {
  const sql = "SELECT * FROM public.inventory WHERE inv_id = $1";
  const data = await pool.query(sql, [invId]);
  return data.rows[0];
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
};
