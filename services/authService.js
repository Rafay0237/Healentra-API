const jwt = require("jsonwebtoken")
const User = require("../models/User")
const OTP = require("../models/OTP")
const emailService = require("./emailService")

class AuthService {
  // Generate JWT token
  generateToken(userId, role) {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "7d" })
  }

  // Register a new provider
  async registerProvider(userData) {
    const { email, firstName, lastName, city, phoneNumber, password } = userData

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error("User already exists with this email")
    }

    // Create new user
    const user = new User({
      email,
      firstName,
      lastName,
      city,
      phoneNumber,
      password,
      role: "provider",
      onBoarded: false,
    })

    await user.save()

    return user
  }

  // Login user
  async login(email, password) {
    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error("Invalid credentials")
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      throw new Error("Invalid credentials")
    }

    // Check if provider is onboarded (skip check for admin)
    if (user.role === "provider" && !user.onBoarded) {
      const error = new Error("Your profile is under review. Please wait for admin approval.")
      error.statusCode = 403
      throw error
    }

    return user
  }

  // Create admin user
  async createAdmin(userData) {
    const { email, firstName, lastName, password } = userData

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error("User already exists with this email")
    }

    // Create admin user
    const user = new User({
      email,
      firstName,
      lastName,
      city: "N/A",
      phoneNumber: "N/A",
      password,
      role: "admin",
      onBoarded: true,
    })

    await user.save()

    return user
  }

  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async sendSignupOTP(userData) {
    const { email, firstName, lastName, city, phoneNumber, password } = userData

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error("User already exists with this email")
    }

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email })

    // Generate OTP
    const otp = this.generateOTP()

    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Save OTP to database
    const otpDoc = new OTP({
      email,
      otp,
      expiresAt,
    })
    await otpDoc.save()

    // Send OTP email
    await emailService.sendOTPEmail(email, otp, firstName)

    return { email, message: "OTP sent successfully" }
  }

  async verifyOTPAndRegister(email, otpCode, userData) {
    // Find OTP record
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 })

    if (!otpRecord) {
      throw new Error("OTP not found or expired")
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id })
      throw new Error("OTP has expired")
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id })
      throw new Error("Maximum verification attempts exceeded")
    }

    // Verify OTP
    const isOTPValid = await otpRecord.compareOTP(otpCode)

    if (!isOTPValid) {
      // Increment attempts
      otpRecord.attempts += 1
      await otpRecord.save()
      throw new Error("Invalid OTP")
    }

    // OTP is valid, create user
    const user = new User({
      email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      city: userData.city,
      phoneNumber: userData.phoneNumber,
      password: userData.password,
      role: "provider",
      onBoarded: false,
    })

    await user.save()

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id })

    return user
  }

  async resendOTP(email) {
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error("User already registered with this email")
    }

    // Delete existing OTPs
    await OTP.deleteMany({ email })

    // Generate new OTP
    const otp = this.generateOTP()

    // Set expiration time
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Save OTP
    const otpDoc = new OTP({
      email,
      otp,
      expiresAt,
    })
    await otpDoc.save()

    // Send OTP email
    await emailService.sendOTPEmail(email, otp)

    return { email, message: "OTP resent successfully" }
  }
}

module.exports = new AuthService()
