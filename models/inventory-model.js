/**
 * models/inventory-model.js
 * W03 + W04 compatible inventory data access
 */

const pool = require("../database/");

/* ===============================
   GET CLASSIFICATIONS (for nav/select)
   =============================== */
async function getClassifications() {
  const sql =
    "SELECT * FROM public.classification ORDER BY classification_name";
  return await pool.query(sql); // ✅ return full data, not just rows
}

/* ===============================
   ADD CLASSIFICATION (W04)
   =============================== */
async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO public.classification (classification_name)
      VALUES ($1)
      RETURNING *;
    `;
    const data = await pool.query(sql, [classification_name]);
    return data.rows[0];
  } catch (err) {
    console.error("addClassification error:", err);
    return null;
  }
}

/* ===============================
   GET INVENTORY BY CLASSIFICATION (W03)
   =============================== */
async function getInventoryByClassificationId(classificationId) {
  const sql = `
    SELECT i.*, c.classification_name
    FROM public.inventory AS i
    JOIN public.classification AS c
      ON i.classification_id = c.classification_id
    WHERE i.classification_id = $1
    ORDER BY i.inv_make, i.inv_model;
  `;
  const data = await pool.query(sql, [classificationId]);
  return data.rows;
}

/* ===============================
   GET SINGLE VEHICLE BY ID (W03)
   =============================== */
async function getVehicleById(invId) {
  const sql = `
    SELECT i.*, c.classification_name
    FROM public.inventory AS i
    JOIN public.classification AS c
      ON i.classification_id = c.classification_id
    WHERE i.inv_id = $1;
  `;
  const data = await pool.query(sql, [invId]);
  return data.rows[0];
}

/* ===============================
   ADD INVENTORY ITEM (W04)
   =============================== */
async function addInventoryItem(inv) {
  try {
    const sql = `
      INSERT INTO public.inventory
      (inv_make, inv_model, inv_year, inv_description,
       inv_image, inv_thumbnail, inv_price, inv_miles,
       inv_color, classification_id)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;

    const params = [
      inv.inv_make,
      inv.inv_model,
      inv.inv_year,
      inv.inv_description,
      inv.inv_image,
      inv.inv_thumbnail,
      inv.inv_price,
      inv.inv_miles,
      inv.inv_color,
      inv.classification_id,
    ];

    const data = await pool.query(sql, params);
    return data.rows[0];
  } catch (err) {
    console.error("addInventoryItem error:", err);
    return null;
  }
}

module.exports = {
  getClassifications,
  addClassification,
  getInventoryByClassificationId,
  getVehicleById,
  addInventoryItem,
};
