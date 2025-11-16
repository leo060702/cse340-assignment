// routes/inventoryRoute.js
const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// 分类视图（之前活动已经做过的，如果你函数名不同就改一下）
router.get("/type/:classificationId",
  inventoryController.buildByClassificationId
);

// 车辆详情页：/inv/detail/1
router.get("/detail/:invId",
  inventoryController.buildDetailView
);

module.exports = router;
