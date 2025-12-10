/**
 * controllers/favoriteController.js
 * Handles add/remove/list vehicle favorites
 */

const favoriteModel = require("../models/favorite-model");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

/**
 * Add favorite
 * POST /favorite/add
 */
async function addFavorite(req, res, next) {
  try {
    const accountData = res.locals.accountData;
    const account_id = accountData?.account_id;
    const inv_id = Number(req.body.inv_id);

    if (!account_id) {
      req.flash("notice", "Please log in to add favorites.");
      return res.redirect("/account/login");
    }

    await favoriteModel.addFavorite(account_id, inv_id);

    req.flash("notice", "Vehicle added to your favorites.");
    return res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    console.error("addFavorite error:", error);
    next(error);
  }
}

/**
 * Remove favorite
 * POST /favorite/remove
 */
async function removeFavorite(req, res, next) {
  try {
    const accountData = res.locals.accountData;
    const account_id = accountData?.account_id;
    const inv_id = Number(req.body.inv_id);

    if (!account_id) {
      req.flash("notice", "Please log in first.");
      return res.redirect("/account/login");
    }

    await favoriteModel.removeFavorite(account_id, inv_id);

    req.flash("notice", "Vehicle removed from favorites.");
    return res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    console.error("removeFavorite error:", error);
    next(error);
  }
}

/**
 * List favorites for current user
 * GET /favorite
 */
async function listFavorites(req, res, next) {
  try {
    const nav = await utilities.getNav();

    const accountData = res.locals.accountData;
    if (!accountData) {
      req.flash("notice", "Please log in to view your favorites.");
      return res.redirect("/account/login");
    }

    const account_id = accountData.account_id;

    // 1. 先从 favorite 表拿到当前用户收藏的 inv_id 列表
    const favorites = await favoriteModel.getFavoritesByAccountId(account_id);

    // 2. 再根据 inv_id 查询每一辆车的详情
    const vehicles = [];
    for (const fav of favorites) {
      const vehicle = await invModel.getVehicleById(fav.inv_id);
      if (vehicle) {
        vehicles.push({
          ...vehicle,
          favorite_created_at: fav.created_at,
        });
      }
    }

    return res.render("favorite/list", {
      title: "My Favorite Vehicles",
      nav,
      errors: null,
      vehicles,
    });
  } catch (error) {
    console.error("listFavorites error:", error);
    next(error);
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  listFavorites,
};
