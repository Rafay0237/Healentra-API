require("dotenv").config()
const express = require("express")
const cors = require("cors")
const swaggerSpec = require("./config/swagger")
const connectDB = require("./config/database")

// Import routes
const authRoutes = require("./routes/auth")
const providerRoutes = require("./routes/provider")
const adminRoutes = require("./routes/admin")

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve raw Swagger spec JSON
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.send(swaggerSpec)
})

// ✅ Swagger UI via CDN (no local static assets)
app.get("/api-docs", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Healentra API Docs</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = () => {
            SwaggerUIBundle({
              url: '/swagger.json',
              dom_id: '#swagger-ui',
              presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
              layout: "BaseLayout"
            })
          }
        </script>
      </body>
    </html>
  `)
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/provider", providerRoutes)
app.use("/api/admin", adminRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
