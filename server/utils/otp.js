// Generate 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via email (simplified version)
export async function sendOTPEmail(email, otp) {
  // In production, use nodemailer or similar service
  // For now, just log it
  console.log(`OTP for ${email}: ${otp}`);
  
  // TODO: Implement actual email sending
  // Example with nodemailer:
  /*
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Knowledge Center - Password Reset OTP',
    html: `
      <h2>Password Reset Request</h2>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `
  });
  */
  
  return true;
}

