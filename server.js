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

// 1) 视图引擎：EJS
app.set("view engine", "ejs")
// 2) 指定 EJS 模板目录（确保你的 index.ejs 在 ./views 里）
app.set("views", path.join(__dirname, "views"))

// 3) 静态资源目录（可选：如果有 public/ 放 css/js/img）
app.use(express.static(path.join(__dirname, "public")))

// 4) 路由
const staticRoutes = require("./routes/static")
app.use("/", staticRoutes)  // 挂在根路径

/* ***********************
 * Local Server Information
 * Use PORT from env (Render 会注入 PORT)
 *************************/
const port = process.env.PORT || 3000

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
