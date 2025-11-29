import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create email transporter
const createTransporter = () => {
  // In development, use a mock transporter
  if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_HOST) {
    return {
      sendMail: async (options) => {
        console.log('\n📧 Email (Development Mode - Not Sent):');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('Body:', options.text || options.html);
        console.log('---\n');
        return { messageId: 'dev-message-id' };
      }
    };
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const transporter = createTransporter();
const FROM_EMAIL = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@knowledgecenter.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Send password reset OTP email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} Email send result
 */
export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: FROM_EMAIL,
    to: email,
    subject: 'Password Reset Code - Knowledge Center',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #9333EA 0%, #10B981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-code { background: white; border: 2px dashed #9333EA; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #9333EA; margin: 20px 0; border-radius: 8px; letter-spacing: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Knowledge Center</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>You have requested to reset your password. Use the following code to proceed:</p>
            <div class="otp-code">${otp}</div>
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>Knowledge Center LMS &copy; ${new Date().getFullYear()}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Code - Knowledge Center
      
      You have requested to reset your password. Use the following code to proceed:
      
      ${otp}
      
      This code will expire in 10 minutes.
      
      If you didn't request this, please ignore this email.
      
      Knowledge Center LMS
    `
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    
    // In development, also log the OTP for easy testing
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n🔑 OTP for ${email}: ${otp}\n`);
    }
    
    return result;
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Send welcome email
 * @param {string} email - Recipient email
 * @param {string} name - User name
 * @returns {Promise<Object>} Email send result
 */
export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: FROM_EMAIL,
    to: email,
    subject: 'Welcome to Knowledge Center',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #9333EA 0%, #10B981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #9333EA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Knowledge Center!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Your account has been successfully created. You can now access the Knowledge Center LMS platform.</p>
            <a href="${FRONTEND_URL}/login" class="button">Login to Your Account</a>
            <p>Thank you for joining us!</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email send error:', error);
    // Don't throw error for welcome emails as they're not critical
    return null;
  }
};

