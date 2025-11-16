// models/inventory-model.js
const pool = require("../database/");

// ……你原来的函数

async function getVehicleById(invId) {
  try {
    const sql = "SELECT * FROM public.inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [invId]); // parameterized
    return data.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  // ……你原来导出的函数
  getVehicleById,
};
