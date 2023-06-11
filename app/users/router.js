var express = require("express")
var router = express.Router()
const { index, actionSignIn, actionLogOut } = require("./controller")

router.get("/", index)
router.post("/", actionSignIn)
router.get("/logout", actionLogOut)

module.exports = router
