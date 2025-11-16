// controllers/inventoryController.js
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

/**
 * Vehicle detail view  /inv/detail/:invId
 */
async function buildDetailView(req, res, next) {
  const invId = Number(req.params.invId);
  if (Number.isNaN(invId)) {
    const err = new Error("Invalid vehicle id");
    err.status = 400;
    return next(err);
  }

  try {
    const vehicle = await invModel.getVehicleById(invId);

    if (!vehicle) {
      const err = new Error("Vehicle not found");
      err.status = 404;
      return next(err);
    }

    const nav = await utilities.getNav();
    const content = utilities.buildVehicleHTML(vehicle);
    const title = `${vehicle.inv_make} ${vehicle.inv_model}`;

    res.render("inventory/detail", {
      title,
      nav,
      content,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { buildDetailView };
