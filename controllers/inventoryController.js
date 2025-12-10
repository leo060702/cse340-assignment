/**
 * controllers/inventoryController.js
 * W03 + W04 compatible controller
 */

const invModel = require("../models/inventory-model");
const favoriteModel = require("../models/favorite-model"); // ★ 新增：收藏表
const utilities = require("../utilities");

/* ===============================
   W04: Inventory Management View
   =============================== */
async function buildManagementView(req, res, next) {
  const nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  });
}

/* ===============================
   W04: Add Classification Views
   =============================== */

// GET: show add-classification form
async function buildAddClassificationView(req, res, next) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: "",
  });
}

// POST: handle add-classification submission
async function addClassification(req, res, next) {
  const { classification_name } = req.body;

  const result = await invModel.addClassification(classification_name);

  if (result) {
    req.flash("notice", "Classification added successfully.");
    const nav = await utilities.getNav(); // rebuild nav

    return res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    });
  }

  // insert failed
  req.flash("notice", "Sorry, the classification insert failed.");
  const nav = await utilities.getNav();
  res.status(500).render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name,
  });
}

/* ===============================
   W04: Add Inventory Views
   =============================== */

// GET: show add-inventory form
async function buildAddInventoryView(req, res, next) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    classification_id: "",
  });
}

// POST: handle add-inventory submission
async function addInventory(req, res, next) {
  const newInv = req.body;

  const result = await invModel.addInventoryItem(newInv);

  if (result) {
    req.flash("notice", "Vehicle added successfully.");
    const nav = await utilities.getNav();

    return res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    });
  }

  // insert failed
  req.flash("notice", "Sorry, the vehicle insert failed.");
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(
    newInv.classification_id
  );

  res.status(500).render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    // sticky all fields
    inv_make: newInv.inv_make || "",
    inv_model: newInv.inv_model || "",
    inv_year: newInv.inv_year || "",
    inv_description: newInv.inv_description || "",
    inv_image: newInv.inv_image || "",
    inv_thumbnail: newInv.inv_thumbnail || "",
    inv_price: newInv.inv_price || "",
    inv_miles: newInv.inv_miles || "",
    inv_color: newInv.inv_color || "",
    classification_id: newInv.classification_id || "",
  });
}

/* ===============================
   W03: Existing Features (keep)
   =============================== */

/**
 * Classification view /inv/type/:classificationId
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
 * Vehicle detail view /inv/detail/:invId
 * 现在直接把 vehicle 传给 detail.ejs，
 * 再加上 isFavorite 用来控制按钮状态
 */
async function buildDetailView(req, res, next) {
  const invId = Number(req.params.invId);
  if (Number.isNaN(invId)) {
    const err = new Error("Invalid vehicle id");
    err.status = 400;
    return next(err);
  }

  try {
    // 1. 取车辆
    const vehicle = await invModel.getVehicleById(invId);
    if (!vehicle) {
      const err = new Error("Vehicle not found");
      err.status = 404;
      return next(err);
    }

    const nav = await utilities.getNav();

    // 2. 是否已收藏（默认 false）
    let isFavorite = false;
    const accountData = res.locals.accountData;
    const account_id = accountData?.account_id;

    if (account_id) {
      try {
        const fav = await favoriteModel.getFavorite(account_id, invId);
        if (fav) isFavorite = true;
      } catch (favErr) {
        console.error("check favorite error:", favErr);
        // 收藏查询出错不影响页面显示，所以不抛出
      }
    }

    const title = `${vehicle.inv_make} ${vehicle.inv_model}`;

    // 3. 渲染 detail.ejs，传 vehicle + isFavorite
    res.render("inventory/detail", {
      title,
      nav,
      vehicle,
      isFavorite,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  // W04
  buildManagementView,
  buildAddClassificationView,
  addClassification,
  buildAddInventoryView,
  addInventory,

  // W03
  buildByClassificationId,
  buildDetailView,
};
