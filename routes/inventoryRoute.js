// routes/inventoryRoute.js
const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const utilities = require("../utilities");

// 分类视图 /inv/type/:classificationId
router.get(
  "/type/:classificationId",
  utilities.handleErrors(inventoryController.buildByClassificationId)
);

// 车辆详情页 /inv/detail/:invId
router.get(
  "/detail/:invId",
  utilities.handleErrors(inventoryController.buildDetailView)
);

module.exports = router;
