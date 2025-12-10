// routes/favoriteRoute.js

const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const utilities = require("../utilities/");

// ------------------------------
// View all favorites (GET /favorite)
// ------------------------------
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(favoriteController.listFavorites)
);

// ------------------------------
// Add favorite (POST /favorite/add)
// ------------------------------
router.post(
  "/add",
  utilities.checkLogin,
  utilities.handleErrors(favoriteController.addFavorite)
);

// ------------------------------
// Remove favorite (POST /favorite/remove)
// ------------------------------
router.post(
  "/remove",
  utilities.checkLogin,
  utilities.handleErrors(favoriteController.removeFavorite)
);

module.exports = router;
