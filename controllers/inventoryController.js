/**
 * controllers/inventoryController.js
 * W04 – Add Classification + Add Inventory (client/server validation + stickiness)
 * 保留 W03 分类/详情功能
 */

const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

/* ===============================
   W04: Inventory Management View
   =============================== */
async function buildManagementView(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

/* ===============================
   W04: Add Classification Views
   =============================== */

// GET: show add-classification form
async function buildAddClassificationView(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name: "",
    });
  } catch (err) {
    next(err);
  }
}

// POST: handle add-classification submission
async function addClassification(req, res, next) {
  try {
    const { classification_name } = req.body;

    const result = await invModel.addClassification(classification_name);

    if (result) {
      req.flash("notice", "Classification added successfully.");
      const nav = await utilities.getNav(); // rebuild nav to include new class

      return res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
      });
    }

    // insert failed
    req.flash("notice", "Sorry, the classification insert failed.");
    const nav = await utilities.getNav();
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name,
    });
  } catch (err) {
    next(err);
  }
}

/* ===============================
   W04: Add Inventory Views
   =============================== */

// GET: show add-inventory form
async function buildAddInventoryView(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      classification_id: "",
    });
  } catch (err) {
    next(err);
  }
}

// POST: handle add-inventory submission
async function addInventory(req, res, next) {
  try {
    const newInv = req.body;

    const result = await invModel.addInventoryItem(newInv);

    if (result) {
      req.flash("notice", "Vehicle added successfully.");
      const nav = await utilities.getNav();

      return res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
      });
    }

    // insert failed
    req.flash("notice", "Sorry, the vehicle insert failed.");
    const nav = await utilities.getNav();
    const classificationList =
      await utilities.buildClassificationList(newInv.classification_id);

    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      ...newInv, // sticky everything back into form
    });
  } catch
