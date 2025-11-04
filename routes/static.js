const express = require("express")
const path = require("path")
const router = express.Router()

// Static files
router.use(express.static(path.join(__dirname, "../public")))
router.use("/css", express.static(path.join(__dirname, "../public/css")))
router.use("/js", express.static(path.join(__dirname, "../public/js")))
router.use("/images", express.static(path.join(__dirname, "../public/images")))

// ✅ Add route to render EJS home page
router.get("/", (req, res) => {
  res.render("index", {
    title: "CSE 340 Assignment",
    message: "Hello from EJS template on Render!"
  })
})

module.exports = router
