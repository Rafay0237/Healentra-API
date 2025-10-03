const providerService = require("../services/providerService");

class ProviderController {
  // POST /api/provider/profile - Create provider profile
  async createProfile(req, res) {
    try {
      const {
        fieldOfSpecialization,
        certificationName,
        institutionName,
        yearOfCertification,
        instituteName,
        from,
        to,
        country,
        state,
      } = req.body;

      // Validate required fields based on schema
      if (
        !fieldOfSpecialization ||
        !certificationName ||
        !institutionName ||
        !yearOfCertification ||
        !instituteName ||
        !from ||
        !to ||
        !country ||
        !state
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // File attachments are optional in schema → no need to force check here

      const providerProfile = await providerService.createProfile(
        req.user._id,
        req.body,
        req.files
      );

      res.status(201).json({
        success: true,
        message:
          "Provider profile created successfully. Waiting for admin approval.",
        data: {
          profileId: providerProfile._id,
        },
      });
    } catch (error) {
      console.error("Create profile error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Error creating provider profile",
      });
    }
  }

  // GET /api/provider/profile - Get own provider profile
  async getProfile(req, res) {
    try {
      const profile = await providerService.getProfileByUserId(req.user._id);

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      console.error("Get profile error:", error);
      const statusCode =
        error.message === "Provider profile not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Error fetching provider profile",
      });
    }
  }
}

module.exports = new ProviderController();
