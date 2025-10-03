const ProviderProfile = require("../models/ProviderProfile");

class ProviderService {
  // Create provider profile
  async createProfile(userId, profileData, files) {
    // Check if profile already exists
    const existingProfile = await ProviderProfile.findOne({ userId });
    if (existingProfile) {
      throw new Error("Provider profile already exists");
    }

    // In production, upload files to cloud storage (S3, Cloudinary, etc.)
    // For now, storing base64 encoded files
    const certificateAttachment =
      files?.certificateAttachment?.[0]?.buffer?.toString("base64") || null;
    const instituteAttachment =
      files?.instituteAttachment?.[0]?.buffer?.toString("base64") || null;
    const licenseAttachment =
      files?.licenseAttachment?.[0]?.buffer?.toString("base64") || null;

    // Create provider profile
    const providerProfile = new ProviderProfile({
      userId,
      fieldOfSpecialization: profileData.fieldOfSpecialization,
      subSpecialty: profileData.subSpecialty,
      certificationName: profileData.certificationName,
      institutionName: profileData.institutionName,
      yearOfCertification: Number.parseInt(profileData.yearOfCertification),
      certificateAttachment,
      instituteName: profileData.instituteName,
      from: new Date(profileData.from),
      to: new Date(profileData.to),
      instituteAttachment,
      country: profileData.country,
      state: profileData.state,
      licenseAttachment,
    });

    await providerProfile.save();

    return providerProfile;
  }

  // Get provider profile by user ID
  async getProfileByUserId(userId) {
    const profile = await ProviderProfile.findOne({ userId });
    if (!profile) {
      throw new Error("Provider profile not found");
    }
    return profile;
  }
}

module.exports = new ProviderService();
