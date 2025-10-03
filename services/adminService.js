const User = require("../models/User")
const ProviderProfile = require("../models/ProviderProfile")
const emailService = require("./emailService")

class AdminService {
  // Get all providers with their profiles
  async getAllProviders() {
    const providers = await ProviderProfile.find()
      .populate({
        path: "userId",
        select: "-password",
      })
      .sort({ createdAt: -1 })

    return providers
  }

  // Get specific provider details
  async getProviderDetails(userId) {
    const user = await User.findById(userId).select("-password")
    if (!user) {
      throw new Error("User not found")
    }

    const profile = await ProviderProfile.findOne({ userId })
    if (!profile) {
      throw new Error("Provider profile not found")
    }

    return { user, profile }
  }

  // Mark provider as onboarded
  async onboardProvider(userId) {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    if (user.role !== "provider") {
      throw new Error("User is not a provider")
    }

    // Check if provider profile exists
    const profile = await ProviderProfile.findOne({ userId })
    if (!profile) {
      throw new Error("Provider profile not found")
    }

    // Update onBoarded status
    user.onBoarded = true
    await user.save()

    try {
      await emailService.sendOnboardingEmail(user.email, user.firstName)
    } catch (error) {
      console.error("Failed to send onboarding email:", error)
      // Don't throw error, onboarding should still succeed
    }

    return user
  }
}

module.exports = new AdminService()
