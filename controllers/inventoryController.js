// controllers/inventoryController.js
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

/**
 * 分类视图 /inv/type/:classificationId
 */
async function buildByClassificationId(req, res, next) {
  const classificationId = Number(req.params.classificationId)
  if (Number.isNaN(classificationId)) {
    const err = new Error("Invalid classification id")
    err.status = 400
    return next(err)
  }

  try {
    const vehicles = await invModel.getInventoryByClassificationId(classificationId)

    if (!vehicles || vehicles.length === 0) {
      const err = new Error("No vehicles found for this classification")
      err.status = 404
      return next(err)
    }

    const nav = await utilities.getNav()

    // 如果 utilities 里有 buildClassificationGrid，就用它，
    // 没有就用一个简单的后备 HTML 列表。
    let content = ""
    if (typeof utilities.buildClassificationGrid === "function") {
      content = utilities.buildClassificationGrid(vehicles)
    } else {
      const items = vehicles
        .map((v) => {
          const title = `${v.inv_year} ${v.inv_make} ${v.inv_model}`
          return `<li>
            <a href="/inv/detail/${v.inv_id}">${title}</a>
          </li>`
        })
        .join("")
      content = `<ul class="inventory-list">${items}</ul>`
    }

    const title =
      (vehicles[0].classification_name || "Vehicle") + " Inventory"

    res.render("inventory/classification", {
      title,
      nav,
      content,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Vehicle detail view  /inv/detail/:invId
 */
async function buildDetailView(req, res, next) {
  const invId = Number(req.params.invId)
  if (Number.isNaN(invId)) {
    const err = new Error("Invalid vehicle id")
    err.status = 400
    return next(err)
  }

  try {
    const vehicle = await invModel.getVehicleById(invId)

    if (!vehicle) {
      const err = new Error("Vehicle not found")
      err.status = 404
      return next(err)
    }

    const nav = await utilities.getNav()
    const content = utilities.buildVehicleHTML(vehicle)
    const title = `${vehicle.inv_make} ${vehicle.inv_model}`

    res.render("inventory/detail", {
      title,
      nav,
      content,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  buildByClassificationId,
  buildDetailView,
}
