/**
 * models/account-model.js
 * Account data access functions
 */

const pool = require("../database/");

/**
 * Create new account (registration)
 */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql = `
      INSERT INTO public.account
        (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES
        ($1, $2, $3, $4, 'Client')
      RETURNING *;
    `;
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("registerAccount error:", error);
    throw error;
  }
}

/**
 * Get account by email
 */
async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM public.account WHERE account_email = $1;";
    const data = await pool.query(sql, [account_email]);
    return data.rows[0];
  } catch (error) {
    console.error("getAccountByEmail error:", error);
    throw error;
  }
}

/**
 * Check if email already exists (for register / update)
 */
async function checkExistingEmail(account_email) {
  try {
    const sql =
      "SELECT account_id, account_email FROM public.account WHERE account_email = $1;";
    const data = await pool.query(sql, [account_email]);
    return data.rows[0]; // undefined if not found
  } catch (error) {
    console.error("checkExistingEmail error:", error);
    throw error;
  }
}

/**
 * Get account by ID
 */
async function getAccountById(account_id) {
  try {
    const sql = "SELECT * FROM public.account WHERE account_id = $1;";
    const data = await pool.query(sql, [account_id]);
    return data.rows[0];
  } catch (error) {
    console.error("getAccountById error:", error);
    throw error;
  }
}

/**
 * Update account basic info
 */
async function updateAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  try {
    const sql = `
      UPDATE public.account
      SET
        account_firstname = $1,
        account_lastname  = $2,
        account_email     = $3
      WHERE account_id    = $4
      RETURNING *;
    `;
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("updateAccount error:", error);
    throw error;
  }
}

/**
 * Update account password (hash already)
 */
async function updatePassword(account_password, account_id) {
  try {
    const sql = `
      UPDATE public.account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *;
    `;
    const data = await pool.query(sql, [account_password, account_id]);
    return data.rows[0];
  } catch (error) {
    console.error("updatePassword error:", error);
    throw error;
  }
}

module.exports = {
  registerAccount,
  getAccountByEmail,
  checkExistingEmail,
  getAccountById,
  updateAccount,
  updatePassword,
};
