/* ******************************************
 * Primary server file
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
require("dotenv").config()
const path = require("path")

const app = express()

/* ***********************
 * View Engine and Static Files
 *************************/
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

/* ***********************
 * Routes
 *************************/
const staticRoutes = require("./routes/static")
const inventoryRoutes = require("./routes/inventoryRoute")
const errorRoutes = require("./routes/errorRoute")

// 挂载路由
app.use("/", staticRoutes)        // 首页、静态页
app.use("/inv", inventoryRoutes)  // 分类视图 + 详情页
app.use("/error", errorRoutes)    // 故意触发 500 的路由

/* ***********************
 * 404 Not Found Handler
 *************************/
app.use((req, res, next) => {
  const err = new Error("Page Not Found")
  err.status = 404
  next(err)
})

/* ***********************
 * Global Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  console.error("ERROR:", err.message)

  const status = err.status || 500
  const utilities = require("./utilities")
  const nav = await utilities.getNav()

  res.status(status).render("errors/error", {
    title: status === 404 ? "404 - Page Not Found" : "500 - Server Error",
    message: err.message,
    nav,
  })
})

/* ***********************
 * Start Server
 *************************/
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
