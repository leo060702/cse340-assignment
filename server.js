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

// Make flash messages + nav available to all EJS views
app.use((req, res, next) => {
  res.locals.messages = req.flash("notice");
  res.locals.errors = null; // default
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
const staticRoutes = require("./routes/static");
const inventoryRoutes = require("./routes/inventoryRoute");
const errorRoutes = require("./routes/errorRoute");

// Mount routes
app.use("/", staticRoutes);
app.use("/inv", inventoryRoutes);
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
  const utilities = require("./utilities");
  const nav = await utilities.getNav();

  // Allow the view to show error messages
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
