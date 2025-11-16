// routes/errorRoute.js
const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");

// 故意触发 500 错误
router.get("/trigger-error", errorController.triggerIntentionalError);

module.exports = router;
