/**
 * routes/accountRoute.js
 * Account routes
 */

const express = require("express");
const router = new express.Router();

const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

/* ==========
 *  VIEWS
 * ========== */

// Login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
);

// Register view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Account management (requires login)
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Account update view (requires login)
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
);

/* ================
 *  PROCESSORS
 * ================ */

// Registration process
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Login process
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Update account info
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
);

// Update password only
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

// Logout
router.get(
  "/logout",
  utilities.handleErrors(accountController.logout)
);

module.exports = router;
