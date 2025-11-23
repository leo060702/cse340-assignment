// controllers/inventoryController.js
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

/**
 * 分类视图 /inv/type/:classificationId
 */
async function buildByClassificationId(req, res, next) {
  const classificationId = Number(req.params.classificationId);
  if (Number.isNaN(classificationId)) {
    const err = new Error("Invalid classification id");
    err.status = 400;
    return next(err);
  }

  try {
    const data = await invModel.getInventoryByClassificationId(classificationId);
    const nav = await utilities.getNav();
    const grid = await utilities.buildClassificationGrid(data);
    const className = data[0]?.classification_name || "Vehicles";

    res.render("inventory/classification", {
      title: className,
      nav,
      grid,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 车辆详情视图 /inv/detail/:invId
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

module.exports = {
  buildByClassificationId,
  buildDetailView,
};
