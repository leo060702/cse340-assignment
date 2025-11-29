/**
 * utilities/account-validation.js
 * Validation rules for account routes (register, login, update, password)
 */

const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");

/* ==========================
 * Registration Validation
 * ========================== */
const registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required."),

    body("account_email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail()
      .custom(async (account_email) => {
        const existing = await accountModel.checkExistingEmail(account_email);
        if (existing) {
          throw new Error("Email already exists. Please log in or use another email.");
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long."),
  ];
};

const checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    // get nav via utilities already set in res.locals.nav
    return res.status(400).render("account/register", {
      title: "Register",
      nav: res.locals.nav,
      errors: errors.array(),
      account_firstname,
      account_lastname,
      account_email,
    });
  }
  next();
};

/* ==========================
 * Login Validation
 * ========================== */
const loginRules = () => {
  return [
    body("account_email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail(),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ];
};

const checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("account/login", {
      title: "Login",
      nav: res.locals.nav,
      errors: errors.array(),
      account_email,
    });
  }
  next();
};

/* ==========================
 * Update Account Validation
 * (First name, last name, email)
 * ========================== */
const updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required."),

    body("account_email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail()
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id;
        const existing = await accountModel.checkExistingEmail(account_email);
        // 如果查到相同 email，但 account_id 不同，则不允许
        if (existing && String(existing.account_id) !== String(account_id)) {
          throw new Error("That email is already in use by another account.");
        }
      }),
  ];
};

const checkUpdateAccountData = async (req, res, next) => {
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  } = req.body;

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const accountData = {
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    };

    return res.status(400).render("account/update", {
      title: "Update Account",
      nav: res.locals.nav,
      errors: errors.array(),
      accountData,
    });
  }
  next();
};

/* ==========================
 * Update Password Validation
 * ========================== */
const updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long."),
  ];
};

const checkUpdatePasswordData = async (req, res, next) => {
  const { account_id } = req.body;

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    // 为了在错误时还能显示原本 update 页面字段，我们需要从数据库再查一次
    const accountData = await accountModel.getAccountById(account_id);

    return res.status(400).render("account/update", {
      title: "Update Account",
      nav: res.locals.nav,
      errors: errors.array(),
      accountData,
    });
  }
  next();
};

module.exports = {
  registrationRules,
  checkRegData,
  loginRules,
  checkLoginData,
  updateAccountRules,
  checkUpdateAccountData,
  updatePasswordRules,
  checkUpdatePasswordData,
};
