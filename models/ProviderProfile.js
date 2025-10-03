const mongoose = require("mongoose")

const providerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fieldOfSpecialization: {
      type: String,
      required: true,
      trim: true,
    },
    subSpecialty: {
      type: String,
      trim: true,
    },

    // Certification details
    certificationName: { type: String, trim: true },
    institutionName: { type: String, trim: true }, // for certifying body
    yearOfCertification: { type: Number },
    certificateAttachment: { type: String },

    // Education details
    instituteName: { type: String, trim: true }, // for university/hospital
    from: { type: Date },
    to: { type: Date },
    instituteAttachment: { type: String },

    // Location
    country: { type: String, trim: true },
    state: { type: String, trim: true },

    // License
    licenseAttachment: { type: String },
  },
  { timestamps: true },
)

module.exports = mongoose.model("ProviderProfile", providerProfileSchema)
