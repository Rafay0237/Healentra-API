const express = require("express")
const router = express.Router()
const multer = require("multer")
const { authenticate, isProvider } = require("../middleware/auth")
const providerController = require("../controllers/providerController")

require("../swagger/provider.swagger")

// Configure multer for file uploads (in-memory storage for demo)
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

router.post(
  "/profile",
  authenticate,
  isProvider,
  upload.fields([
    { name: "certificateAttachment", maxCount: 1 },
    { name: "instituteAttachment", maxCount: 1 },
    { name: "licenseAttachment", maxCount: 1 },
  ]),
  providerController.createProfile.bind(providerController),
)

router.get("/profile", authenticate, isProvider, providerController.getProfile.bind(providerController))

module.exports = router
