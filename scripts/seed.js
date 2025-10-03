require("dotenv").config()
const mongoose = require("mongoose")
const authService = require("../services/authService")

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Create admin user
    const adminData = {
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      password: "admin123",
    }

    try {
      const admin = await authService.createAdmin(adminData)
      console.log("✅ Admin user created successfully")
      console.log("Email:", admin.email)
      console.log("Password: admin123")
      console.log("Role:", admin.role)
    } catch (error) {
      if (error.message.includes("already exists")) {
        console.log("ℹ️  Admin user already exists")
      } else {
        throw error
      }
    }

    console.log("\n🎉 Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
