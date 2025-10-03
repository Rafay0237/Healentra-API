const adminService = require("../services/adminService")

class AdminController {
  // GET /api/admin/providers - Get all provider profiles with user data
  async getAllProviders(req, res) {
    try {
      const providers = await adminService.getAllProviders()

      res.json({
        success: true,
        count: providers.length,
        data: providers,
      })
    } catch (error) {
      console.error("Get providers error:", error)
      res.status(500).json({
        success: false,
        message: error.message || "Error fetching providers",
      })
    }
  }

  // GET /api/admin/providers/:userId - Get specific provider details
  async getProviderDetails(req, res) {
    try {
      const { userId } = req.params
      const providerData = await adminService.getProviderDetails(userId)

      res.json({
        success: true,
        data: providerData,
      })
    } catch (error) {
      console.error("Get provider details error:", error)
      const statusCode = error.message.includes("not found") ? 404 : 500
      res.status(statusCode).json({
        success: false,
        message: error.message || "Error fetching provider details",
      })
    }
  }

  // PUT /api/admin/providers/:userId/onboard - Mark provider as onboarded
  async onboardProvider(req, res) {
    try {
      const { userId } = req.params
      const user = await adminService.onboardProvider(userId)

      res.json({
        success: true,
        message: "Provider onboarded successfully",
        data: {
          userId: user._id,
          email: user.email,
          onBoarded: user.onBoarded,
        },
      })
    } catch (error) {
      console.error("Onboard provider error:", error)
      const statusCode = error.message.includes("not found") ? 404 : 400
      res.status(statusCode).json({
        success: false,
        message: error.message || "Error onboarding provider",
      })
    }
  }
}

module.exports = new AdminController()
