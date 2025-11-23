/**
 * utilities/index.js
 * Updated for W04 – Dynamic Nav, Classification List, Grid, Error Handling
 */

const invModel = require("../models/inventory-model");

/* ===============================
   NAVIGATION – dynamic from DB
   =============================== */
async function getNav() {
  try {
    const data = await invModel.getClassifications();
    let nav = `
      <nav>
        <a href="/">Home</a>
        <a href="/inv">Inventory Management</a>
    `;

    data.rows.forEach((row) => {
      nav += `
        <a href="/inv/type/${row.classification_id}">
          ${row.classification_name}
        </a>
      `;
    });

    nav += `</nav>`;

    return nav;
  } catch (err) {
    // fallback nav
    return `
      <nav>
        <a href="/">Home</a>
        <a href="/inv">Inventory</a>
      </nav>
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
   VEHICLE DETAIL HTML (W03)
   You already had this – keep it
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

module.exports = {
  getNav,
  buildClassificationList,
  buildClassificationGrid,
  buildVehicleHTML,
  handleErrors,
};
