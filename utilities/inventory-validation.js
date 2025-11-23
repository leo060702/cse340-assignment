/**
 * utilities/inventory-validation.js
 * W04 – Server-side validation + stickiness
 */

const { body, validationResult } = require("express-validator");
const utilities = require(".");

/* ===============================
   Add Classification Validation
   =============================== */
const classificationRules = () => [
  body("classification_name")
    .trim()
    .notEmpty()
    .withMessage("Classification name is required.")
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("Classification cannot contain spaces or special characters."),
];

const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();

    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name || "",
    });
  }

  next();
};

/* ===============================
   Add Inventory Validation
   =============================== */
const inventoryRules = () => [
  body("classification_id")
    .notEmpty()
    .withMessage("Please choose a classification.")
    .isInt()
    .withMessage("Classification must be a valid ID."),

  body("inv_make")
    .trim()
    .notEmpty()
    .withMessage("Make is required."),

  body("inv_model")
    .trim()
    .notEmpty()
    .withMessage("Model is required."),

  body("inv_description")
    .trim()
    .notEmpty()
    .withMessage("Description is required."),

  body("inv_image")
    .trim()
    .notEmpty()
    .withMessage("Image path is required."),

  body("inv_thumbnail")
    .trim()
    .notEmpty()
    .withMessage("Thumbnail path is required."),

  body("inv_price")
    .trim()
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a number 0 or higher."),

  body("inv_year")
    .trim()
    .notEmpty()
    .withMessage("Year is required.")
    .isInt({ min: 1900, max: 2099 })
    .withMessage("Year must be a 4-digit number."),

  body("inv_miles")
    .trim()
    .notEmpty()
    .withMessage("Miles is required.")
    .isInt({ min: 0 })
    .withMessage("Miles must be digits only (no commas)."),

  body("inv_color")
    .trim()
    .notEmpty()
    .withMessage("Color is required."),
];

const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();

    // 让下拉菜单记住用户选的分类（stickiness）
    const classificationList = await utilities.buildClassificationList(
      req.body.classification_id
    );

    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: errors.array(),

      // stickiness: 把所有输入值带回去
      inv_make: req.body.inv_make || "",
      inv_model: req.body.inv_model || "",
      inv_year: req.body.inv_year || "",
      inv_description: req.body.inv_description || "",
      inv_image: req.body.inv_image || "",
      inv_thumbnail: req.body.inv_thumbnail || "",
      inv_price: req.body.inv_price || "",
      inv_miles: req.body.inv_miles || "",
      inv_color: req.body.inv_color || "",
      classification_id: req.body.classification_id || "",
    });
  }

  next();
};

module.exports = {
  classificationRules,
  checkClassificationData,
  inventoryRules,
  checkInventoryData,
};
