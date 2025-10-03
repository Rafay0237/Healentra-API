const express = require("express")
const router = express.Router()
const { authenticate, isAdmin } = require("../middleware/auth")
const adminController = require("../controllers/adminController")

require("../swagger/admin.swagger")

router.get("/providers", authenticate, isAdmin, adminController.getAllProviders.bind(adminController))
router.get("/providers/:userId", authenticate, isAdmin, adminController.getProviderDetails.bind(adminController))
router.put("/providers/:userId/onboard", authenticate, isAdmin, adminController.onboardProvider.bind(adminController))

module.exports = router
