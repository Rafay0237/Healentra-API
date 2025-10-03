const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")

require("../swagger/auth.swagger")

router.post("/signup", authController.signup.bind(authController))
router.post("/verify-otp", authController.verifyOTP.bind(authController))
router.post("/resend-otp", authController.resendOTP.bind(authController))
router.post("/login", authController.login.bind(authController))

module.exports = router
