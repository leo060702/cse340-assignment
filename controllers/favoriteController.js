/**
 * controllers/favoriteController.js
 * Handles add/remove vehicle favorites
 */

const favoriteModel = require("../models/favorite-model");

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

module.exports = {
  addFavorite,
  removeFavorite,
};
