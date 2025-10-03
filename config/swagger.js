const swaggerJsdoc = require("swagger-jsdoc")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Healentra API",
      version: "1.0.0",
      description: "API for provider onboarding with admin approval system and OTP verification",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            email: { type: "string", format: "email" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            city: { type: "string" },
            phoneNumber: { type: "string" },
            role: { type: "string", enum: ["provider", "admin"] },
            onBoarded: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        ProviderProfile: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            fieldOfSpecialization: { type: "string" },
            subSpecialty: { type: "string" },
            certificationName: { type: "string" },
            institutionName: { type: "string" },
            yearOfCertification: { type: "number" },
            certificateAttachment: { type: "string" },
            instituteName: { type: "string" },
            from: { type: "string", format: "date" },
            to: { type: "string", format: "date" },
            instituteAttachment: { type: "string" },
            country: { type: "string" },
            state: { type: "string" },
            licenseAttachment: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication and OTP verification endpoints",
      },
      {
        name: "Provider",
        description: "Provider profile management endpoints",
      },
      {
        name: "Admin",
        description: "Admin endpoints for provider management",
      },
    ],
  },
  apis: ["./routes/*.js", "./swagger/*.js"],
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec
