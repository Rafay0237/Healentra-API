const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Verify JWT token
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    })
  }
}

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    })
  }
  next()
}

// Check if user is provider
exports.isProvider = (req, res, next) => {
  if (req.user.role !== "provider") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Provider only.",
    })
  }
  next()
}
