const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index - auto-delete when expiresAt is reached
    },
  },
  {
    timestamps: true,
  },
)

// Hash OTP before saving
otpSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.otp = await bcrypt.hash(this.otp, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare OTP
otpSchema.methods.compareOTP = async function (candidateOTP) {
  return await bcrypt.compare(candidateOTP, this.otp)
}

module.exports = mongoose.model("OTP", otpSchema)
