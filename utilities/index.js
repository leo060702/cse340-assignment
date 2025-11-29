/**
 * utilities/index.js
 * Dynamic Nav, Classification List, Grid, Error Handling, Auth Middleware
 */

const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ===============================
   NAVIGATION – dynamic from DB
   =============================== */
async function getNav() {
  try {
    const data = await invModel.getClassifications();

    let nav = "<ul>";
    nav += `
      <li><a href="/" title="Home Page">Home</a></li>
      <li><a href="/inv" title="Inventory Management">Inventory Management</a></li>
    `;

    data.rows.forEach((row) => {
      nav += `
        <li>
          <a href="/inv/type/${row.classification_id}"
             title="See ${row.classification_name} vehicles">
            ${row.classification_name}
          </a>
        </li>
      `;
    });

    nav += "</ul>";
    return nav;
  } catch (err) {
    // fallback nav
    return `
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/inv">Inventory</a></li>
      </ul>
    `;
  }
}

/* ===============================
   BUILD CLASSIFICATION LIST (select)
   Used in Add Inventory form
   =============================== */
async function buildClassificationList(selectedId = null) {
  const data = await invModel.getClassifications();
  let list = `<select name="classification_id" id="classificationList" required>`;
  list += `<option value="">Choose a Classification</option>`;

  data.rows.forEach((row) => {
    list += `<option value="${row.classification_id}"`;
    if (Number(selectedId) === row.classification_id) {
      list += " selected";
    }
    list += `>${row.classification_name}</option>`;
  });

  list += `</select>`;
  return list;
}

/* ===============================
   CLASSIFICATION GRID (W03)
   =============================== */
async function buildClassificationGrid(data) {
  if (!data || data.length === 0) {
    return `<p class="notice">No vehicles found in this classification.</p>`;
  }

  let grid = '<ul id="inv-display">';

  data.forEach((vehicle) => {
    grid += `
      <li>
        <a href="/inv/detail/${vehicle.inv_id}">
          <img src="${vehicle.inv_thumbnail}" 
               alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
        </a>
        <h3>
          <a href="/inv/detail/${vehicle.inv_id}">
            ${vehicle.inv_make} ${vehicle.inv_model}
          </a>
        </h3>
        <span>$${Number(vehicle.inv_price).toLocaleString("en-US")}</span>
      </li>
    `;
  });

  grid += "</ul>";
  return grid;
}

/* ===============================
   VEHICLE DETAIL HTML (W03 + W04)
   =============================== */
function formatPriceUSD(num) {
  return Number(num).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatMiles(num) {
  return `${Number(num).toLocaleString("en-US")} miles`;
}

function buildVehicleHTML(vehicle) {
  const price = formatPriceUSD(vehicle.inv_price);
  const miles = formatMiles(vehicle.inv_miles);

  return `
    <section class="vehicle-detail">
      <div class="vehicle-detail__image">
        <img src="${vehicle.inv_image}" 
             alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </div>

      <div class="vehicle-detail__info">
        <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>

        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Mileage:</strong> ${miles}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>

        <p><strong>Description:</strong><br>
           ${vehicle.inv_description}
        </p>
      </div>
    </section>
  `;
}

/* ===============================
   ERROR HANDLER WRAPPER
   =============================== */
function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/* ===============================
   AUTH HELPERS (JWT, LOGIN, ROLE)
   =============================== */

/**
 * 从 Cookie 头里解析 jwt token（不依赖 cookie-parser）
 */
function getJWTFromRequest(req) {
  // 如果你以后装了 cookie-parser，也兼容：
  if (req.cookies && req.cookies.jwt) {
    return req.cookies.jwt;
  }

  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith("jwt=")) {
      return cookie.substring(4); // "jwt=".length === 4
    }
  }

  return null;
}

/**
 * JWT 中间件：检查 token，设置 res.locals.loggedin / accountData
 */
function checkJWTToken(req, res, next) {
  const token = getJWTFromRequest(req);

  if (!token) {
    res.locals.loggedin = false;
    res.locals.accountData = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.locals.loggedin = true;
    res.locals.accountData = payload;
  } catch (err) {
    console.error("checkJWTToken: invalid token", err.message);
    res.locals.loggedin = false;
    res.locals.accountData = null;
  }

  return next();
}

/**
 * 需要已登录的页面：未登录就跳转到 /account/login
 */
function checkLogin(req, res, next) {
  if (res.locals.loggedin && res.locals.accountData) {
    return next();
  }

  req.flash("notice", "Please log in to continue.");
  return res.redirect("/account/login");
}

/**
 * 只允许 Employee / Admin 访问（inventory 管理等）
 */
function checkAccountType(req, res, next) {
  const accountData = res.locals.accountData;

  if (
    res.locals.loggedin &&
    accountData &&
    accountData.account_type &&
    accountData.account_type.toLowerCase() !== "client"
  ) {
    return next();
  }

  req.flash("notice", "You do not have permission to access that page.");
  return res.redirect("/account/");
}

module.exports = {
  getNav,
  buildClassificationList,
  buildClassificationGrid,
  buildVehicleHTML,
  handleErrors,
  checkJWTToken,
  checkLogin,
  checkAccountType,
};
/**
 * utilities/index.js
 * Dynamic Nav, Classification List, Grid, Error Handling, Auth Middleware
 */

const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ===============================
   NAVIGATION – dynamic from DB
   =============================== */
async function getNav() {
  try {
    const data = await invModel.getClassifications();

    let nav = "<ul>";
    nav += `
      <li><a href="/" title="Home Page">Home</a></li>
      <li><a href="/inv" title="Inventory Management">Inventory Management</a></li>
    `;

    data.rows.forEach((row) => {
      nav += `
        <li>
          <a href="/inv/type/${row.classification_id}"
             title="See ${row.classification_name} vehicles">
            ${row.classification_name}
          </a>
        </li>
      `;
    });

    nav += "</ul>";
    return nav;
  } catch (err) {
    // fallback nav
    return `
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/inv">Inventory</a></li>
      </ul>
    `;
  }
}

/* ===============================
   BUILD CLASSIFICATION LIST (select)
   Used in Add Inventory form
   =============================== */
async function buildClassificationList(selectedId = null) {
  const data = await invModel.getClassifications();
  let list = `<select name="classification_id" id="classificationList" required>`;
  list += `<option value="">Choose a Classification</option>`;

  data.rows.forEach((row) => {
    list += `<option value="${row.classification_id}"`;
    if (Number(selectedId) === row.classification_id) {
      list += " selected";
    }
    list += `>${row.classification_name}</option>`;
  });

  list += `</select>`;
  return list;
}

/* ===============================
   CLASSIFICATION GRID (W03)
   =============================== */
async function buildClassificationGrid(data) {
  if (!data || data.length === 0) {
    return `<p class="notice">No vehicles found in this classification.</p>`;
  }

  let grid = '<ul id="inv-display">';

  data.forEach((vehicle) => {
    grid += `
      <li>
        <a href="/inv/detail/${vehicle.inv_id}">
          <img src="${vehicle.inv_thumbnail}" 
               alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
        </a>
        <h3>
          <a href="/inv/detail/${vehicle.inv_id}">
            ${vehicle.inv_make} ${vehicle.inv_model}
          </a>
        </h3>
        <span>$${Number(vehicle.inv_price).toLocaleString("en-US")}</span>
      </li>
    `;
  });

  grid += "</ul>";
  return grid;
}

/* ===============================
   VEHICLE DETAIL HTML (W03 + W04)
   =============================== */
function formatPriceUSD(num) {
  return Number(num).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatMiles(num) {
  return `${Number(num).toLocaleString("en-US")} miles`;
}

function buildVehicleHTML(vehicle) {
  const price = formatPriceUSD(vehicle.inv_price);
  const miles = formatMiles(vehicle.inv_miles);

  return `
    <section class="vehicle-detail">
      <div class="vehicle-detail__image">
        <img src="${vehicle.inv_image}" 
             alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </div>

      <div class="vehicle-detail__info">
        <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>

        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Mileage:</strong> ${miles}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>

        <p><strong>Description:</strong><br>
           ${vehicle.inv_description}
        </p>
      </div>
    </section>
  `;
}

/* ===============================
   ERROR HANDLER WRAPPER
   =============================== */
function handleErrors(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/* ===============================
   AUTH HELPERS (JWT, LOGIN, ROLE)
   =============================== */

/**
 * 从 Cookie 头里解析 jwt token（不依赖 cookie-parser）
 */
function getJWTFromRequest(req) {
  // 如果你以后装了 cookie-parser，也兼容：
  if (req.cookies && req.cookies.jwt) {
    return req.cookies.jwt;
  }

  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith("jwt=")) {
      return cookie.substring(4); // "jwt=".length === 4
    }
  }

  return null;
}

/**
 * JWT 中间件：检查 token，设置 res.locals.loggedin / accountData
 */
function checkJWTToken(req, res, next) {
  const token = getJWTFromRequest(req);

  if (!token) {
    res.locals.loggedin = false;
    res.locals.accountData = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.locals.loggedin = true;
    res.locals.accountData = payload;
  } catch (err) {
    console.error("checkJWTToken: invalid token", err.message);
    res.locals.loggedin = false;
    res.locals.accountData = null;
  }

  return next();
}

/**
 * 需要已登录的页面：未登录就跳转到 /account/login
 */
function checkLogin(req, res, next) {
  if (res.locals.loggedin && res.locals.accountData) {
    return next();
  }

  req.flash("notice", "Please log in to continue.");
  return res.redirect("/account/login");
}

/**
 * 只允许 Employee / Admin 访问（inventory 管理等）
 */
function checkAccountType(req, res, next) {
  const accountData = res.locals.accountData;

  if (
    res.locals.loggedin &&
    accountData &&
    accountData.account_type &&
    accountData.account_type.toLowerCase() !== "client"
  ) {
    return next();
  }

  req.flash("notice", "You do not have permission to access that page.");
  return res.redirect("/account/");
}

module.exports = {
  getNav,
  buildClassificationList,
  buildClassificationGrid,
  buildVehicleHTML,
  handleErrors,
  checkJWTToken,
  checkLogin,
  checkAccountType,
};
