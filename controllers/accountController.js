/**
 * controllers/accountController.js
 * Handles account views & processes (login, register, management, update, logout)
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const accountModel = require("../models/account-model");
const utilities = require("../utilities/");

const accountController = {};

/* ================
 *  VIEW BUILDERS
 * ================ */

// GET /account/login
accountController.buildLogin = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
};

// GET /account/register
accountController.buildRegister = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
};

// GET /account/  (Account Management)
accountController.buildAccountManagement = async function (req, res, next) {
  const nav = await utilities.getNav();
  const accountData = res.locals.accountData; // from JWT middleware

  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    accountData,
  });
};

// GET /account/update/:account_id
accountController.buildUpdateAccount = async function (req, res, next) {
  const nav = await utilities.getNav();
  const account_id = req.params.account_id;
  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    accountData,
  });
};

/* ====================
 *  PROCESSORS
 * ==================== */

// POST /account/register
accountController.registerAccount = async function (req, res, next) {
  const nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const newAccount = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (newAccount) {
      req.flash(
        "notice",
        "Congratulations, your account has been created. Please log in."
      );
      return res.redirect("/account/login");
    }

    req.flash("notice", "Sorry, the registration failed.");
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

// POST /account/login
accountController.accountLogin = async function (req, res, next) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      req.flash("notice", "Please check your credentials.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      });
    }

    const match = await bcrypt.compare(
      account_password,
      accountData.account_password
    );
    if (!match) {
      req.flash("notice", "Please check your credentials.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      });
    }

    const payload = {
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_type: accountData.account_type,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: false, // set true in production https
    });

    req.flash("notice", "You are now logged in.");
    return res.redirect("/account/");
  } catch (error) {
    next(error);
  }
};

// POST /account/update  (update basic info)
accountController.updateAccount = async function (req, res, next) {
  const nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  } = req.body;

  try {
    const updatedAccount = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    );

    if (!updatedAccount) {
      req.flash("notice", "Update failed. Please try again.");
      return res.redirect(`/account/update/${account_id}`);
    }

    // refresh JWT so header welcome is correct
    const payload = {
      account_id: updatedAccount.account_id,
      account_firstname: updatedAccount.account_firstname,
      account_lastname: updatedAccount.account_lastname,
      account_email: updatedAccount.account_email,
      account_type: updatedAccount.account_type,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: false,
    });

    req.flash("notice", "Account information updated.");
    return res.redirect("/account/");
  } catch (error) {
    next(error);
  }
};

// POST /account/update-password
accountController.updatePassword = async function (req, res, next) {
  const nav = await utilities.getNav();
  const { account_password, account_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const result = await accountModel.updatePassword(
      hashedPassword,
      account_id
    );

    if (!result) {
      req.flash("notice", "Password update failed. Please try again.");
    } else {
      req.flash("notice", "Password updated successfully.");
    }

    return res.redirect("/account/");
  } catch (error) {
    next(error);
  }
};

// GET /account/logout
accountController.logout = async function (req, res, next) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
};

module.exports = accountController;
