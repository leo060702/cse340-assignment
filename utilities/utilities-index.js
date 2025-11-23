// utilities/index.js
const invModel = require("../models/inventory-model");

/**
 * Wrap async route handlers to forward errors to Express error middleware.
 */
function handleErrors(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

/**
 * Build the navigation HTML from classifications.
 */
async function getNav() {
  const data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';

  data.forEach((row) => {
    list += `<li><a href="/inv/type/${row.classification_id}" title="View our ${row.classification_name} inventory">${row.classification_name}</a></li>`;
  });

  list += "</ul>";
  return list;
}

/**
 * Build a grid/list of vehicles for a classification view.
 */
async function buildClassificationGrid(data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      const title = `${vehicle.inv_make} ${vehicle.inv_model}`;
      grid += `
        <li>
          <a href="/inv/detail/${vehicle.inv_id}" title="View ${title} details">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${title} on CSE Motors">
          </a>
          <div class="namePrice">
            <h2>
              <a href="/inv/detail/${vehicle.inv_id}" title="View ${title} details">${title}</a>
            </h2>
            <span>${formatPriceUSD(vehicle.inv_price)}</span>
          </div>
        </li>`;
    });
    grid += "</ul>";
  } else {
    grid = "<p class='notice'>Sorry, no matching vehicles could be found.</p>";
  }
  return grid;
}

/**
 * Format price like $12,345.00
 */
function formatPriceUSD(num) {
  return Number(num).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

/**
 * Format mileage like 12,345 miles
 */
function formatMiles(num) {
  return `${Number(num).toLocaleString("en-US")} miles`;
}

/**
 * Build the vehicle detail HTML required in W03.
 */
function buildVehicleHTML(vehicle) {
  const price = formatPriceUSD(vehicle.inv_price);
  const miles = formatMiles(vehicle.inv_miles);

  return `
    <section class="vehicle-detail">
      <div class="vehicle-detail__image">
        <img src="${vehicle.inv_image}"
             alt="Image of ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}">
      </div>

      <div class="vehicle-detail__info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>

        <p class="vehicle-detail__price"><strong>Price:</strong> ${price}</p>
        <p class="vehicle-detail__miles"><strong>Mileage:</strong> ${miles}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>

        <p><strong>Description:</strong><br>
           ${vehicle.inv_description}
        </p>
      </div>
    </section>
  `;
}

module.exports = {
  handleErrors,
  getNav,
  buildClassificationGrid,
  buildVehicleHTML,
  formatPriceUSD,
  formatMiles,
};
