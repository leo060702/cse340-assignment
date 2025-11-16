// utilities/index.js

/**
 * Build navigation bar
 * You may already have a nav from the previous assignment.
 * If your original version is different, I can help merge them.
 */
async function getNav() {
  // 你也可以根据数据库分类动态生成导航。
  // 暂时返回一个简单版本，确保项目不会报错。
  return `
    <nav>
      <a href="/">Home</a>
      <a href="/inv/type/1">Cars</a>
      <a href="/inv/type/2">SUV</a>
      <a href="/inv/type/3">Trucks</a>
    </nav>
  `;
}

/** Format price in USD: $12,345.00 */
function formatPriceUSD(num) {
  return Number(num).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

/** Format miles: 12,345 miles */
function formatMiles(num) {
  return `${Number(num).toLocaleString("en-US")} miles`;
}

/**
 * Build vehicle detail HTML
 * This matches Assignment 3's requirement.
 */
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

module.exports = {
  getNav,
  buildVehicleHTML,
};
