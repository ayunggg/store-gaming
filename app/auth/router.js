var express = require("express")
var router = express.Router()
const { signUp, signIn } = require("./controller")
const multer = require("multer")
const os = require("os")

router.post("/signUp", multer({ dest: os.tmpdir() }).single("image"), signUp)
router.post("/signIn", signIn)

module.exports = router
