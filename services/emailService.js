const nodemailer = require("nodemailer")

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  // Send OTP email
  async sendOTPEmail(email, otp, firstName) {
    const mailOptions = {
      from: `"Provider Onboarding" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - OTP Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
            </div>
            <div class="content">
              <p>Hello ${firstName || "there"},</p>
              <p>Thank you for signing up! Please use the following OTP code to verify your email address:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <p><strong>This code will expire in 10 minutes.</strong></p>
              <p>If you didn't request this code, please ignore this email.</p>
              
              <div class="footer">
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    try {
      await this.transporter.sendMail(mailOptions)
      return true
    } catch (error) {
      console.error("Error sending OTP email:", error)
      throw new Error("Failed to send OTP email")
    }
  }

  // Send onboarding confirmation email
  async sendOnboardingEmail(email, firstName) {
    const mailOptions = {
      from: `"Provider Onboarding" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Congratulations! You're Onboarded",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-icon { font-size: 64px; text-align: center; margin: 20px 0; }
            .button { display: inline-block; background: #11998e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome Aboard! 🎉</h1>
            </div>
            <div class="content">
              <div class="success-icon">✅</div>
              <p>Hello ${firstName},</p>
              <p><strong>Congratulations!</strong> Your provider profile has been reviewed and approved by our admin team.</p>
              <p>You are now officially onboarded and can access all features of the platform.</p>
              <p>You can now log in to your account and start using our services.</p>
              
              <div style="text-align: center;">
                <a href="#" class="button">Login to Dashboard</a>
              </div>
              
              <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
              
              <div class="footer">
                <p>Thank you for joining us!</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    try {
      await this.transporter.sendMail(mailOptions)
      return true
    } catch (error) {
      console.error("Error sending onboarding email:", error)
      throw new Error("Failed to send onboarding email")
    }
  }
}

module.exports = new EmailService()
