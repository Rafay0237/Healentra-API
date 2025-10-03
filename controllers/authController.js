const authService = require("../services/authService")

class AuthController {
  async signup(req, res) {
    try {
      const { email, firstName, lastName, city, phoneNumber, password } = req.body

      // Validate required fields
      if (!email || !firstName || !lastName || !city || !phoneNumber || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        })
      }

      // Store signup data temporarily (in production, use Redis or session)
      const result = await authService.sendSignupOTP(req.body)

      res.status(200).json({
        success: true,
        message: "OTP sent to your email. Please verify to complete registration.",
        data: result,
      })
    } catch (error) {
      console.error("Signup error:", error)
      res.status(500).json({
        success: false,
        message: error.message || "Error sending OTP",
      })
    }
  }

  async verifyOTP(req, res) {
    try {
      const { email, otp, firstName, lastName, city, phoneNumber, password } = req.body

      // Validate required fields
      if (!email || !otp || !firstName || !lastName || !city || !phoneNumber || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        })
      }

      const userData = { firstName, lastName, city, phoneNumber, password }
      const user = await authService.verifyOTPAndRegister(email, otp, userData)
      const token = authService.generateToken(user._id, user.role)

      res.status(201).json({
        success: true,
        message: "Email verified and provider registered successfully",
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            onBoarded: user.onBoarded,
          },
        },
      })
    } catch (error) {
      console.error("OTP verification error:", error)
      res.status(400).json({
        success: false,
        message: error.message || "Error verifying OTP",
      })
    }
  }

  async resendOTP(req, res) {
    try {
      const { email } = req.body

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        })
      }

      const result = await authService.resendOTP(email)

      res.status(200).json({
        success: true,
        message: "OTP resent successfully",
        data: result,
      })
    } catch (error) {
      console.error("Resend OTP error:", error)
      res.status(500).json({
        success: false,
        message: error.message || "Error resending OTP",
      })
    }
  }

  // POST /api/auth/login - Login for both provider and admin
  async login(req, res) {
    try {
      const { email, password } = req.body

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        })
      }

      const user = await authService.login(email, password)
      const token = authService.generateToken(user._id, user.role)

      res.json({
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            onBoarded: user.onBoarded,
          },
        },
      })
    } catch (error) {
      console.error("Login error:", error)
      const statusCode = error.statusCode || 401
      res.status(statusCode).json({
        success: false,
        message: error.message || "Error logging in",
      })
    }
  }
}

module.exports = new AuthController()
