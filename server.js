/* ****************************************** 
 * Primary server file
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
require("dotenv").config();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

// 工具函数（getNav、handleErrors、checkJWTToken、checkLogin 等）
const utilities = require("./utilities");

const app = express();

/* ***********************
 * Express Middleware
 *************************/

// Enable POST form processing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cse340secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Flash messages
app.use(flash());

// Make flash messages available to all EJS views
app.use((req, res, next) => {
  res.locals.messages = req.flash("notice"); // 和 req.flash("notice", "...") 对应
  res.locals.errors = null; // default
  next();
});

// 🔐 JWT 中间件：检查登录状态，设置 res.locals.loggedin / res.locals.accountData
if (typeof utilities.checkJWTToken === "function") {
  app.use(utilities.checkJWTToken);
}

/* ***********************
 * Global Navigation Middleware
 *************************/
app.use(async (req, res, next) => {
  res.locals.nav = await utilities.getNav();
  next();
});

/* ***********************
 * View Engine and Static Files
 *************************/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

/* ***********************
 * Routes
 *************************/
// 路由 require 放在这里
const staticRoutes = require("./routes/static");
const inventoryRoutes = require("./routes/inventoryRoute");
const errorRoutes = require("./routes/errorRoute");
const accountRoutes = require("./routes/accountRoute");
const favoriteRoute = require("./routes/favoriteRoute"); // ✅ 新增收藏路由

// Mount routes
app.use("/", staticRoutes);
app.use("/inv", inventoryRoutes);
app.use("/account", accountRoutes);
app.use("/favorite", favoriteRoute);   // ✅ 在这里挂载 /favorite
app.use("/error", errorRoutes);

/* ***********************
 * 404 Not Found Handler
 *************************/
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

/* ***********************
 * Global Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  console.error("ERROR:", err.message);

  const status = err.status || 500;
  const nav = await utilities.getNav();

  res.locals.messages = res.locals.messages || [];

  res.status(status).render("errors/error", {
    title: status === 404 ? "404 - Page Not Found" : "500 - Server Error",
    message: err.message,
    nav,
  });
});

/* ***********************
 * Start Server
 *************************/
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
