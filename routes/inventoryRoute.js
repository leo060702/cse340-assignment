/**
 * routes/inventoryRoute.js
 * W04 – Classification + Inventory Form Validation & Stickiness
 */

const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventoryController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");

/* ===============================
   Inventory Management – W04
   =============================== */

// Inventory Management main view   /inv
router.get(
  "/",
  utilities.handleErrors(inventoryController.buildManagementView)
);

/* ===============================
   Add Classification – W04
   =============================== */

// Display "Add Classification" page
router.get(
  "/add-classification",
  utilities.handleErrors(inventoryController.buildAddClassificationView)
);

// Process "Add Classification" POST
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(inventoryController.addClassification)
);

/* ===============================
   Add Inventory – W04
   =============================== */

// Display "Add Inventory" page
router.get(
  "/add-inventory",
  utilities.handleErrors(inventoryController.buildAddInventoryView)
);

// Process "Add Inventory" POST
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(inventoryController.addInventory)
);

/* ===============================
   Existing routes from W03
   =============================== */

// Classification page:  /inv/type/:classificationId
router.get(
  "/type/:classificationId",
  utilities.handleErrors(inventoryController.buildByClassificationId)
);

// Vehicle detail page:  /inv/detail/:invId
router.get(
  "/detail/:invId",
  utilities.handleErrors(inventoryController.buildDetailView)
);

module.exports = router;
