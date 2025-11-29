import { User } from '../models/User.js';
import { Role } from '../models/Role.js';
import { OTPCode } from '../models/OTP.js';
import { generateToken } from '../utils/jwt.js';
import { sendOTPEmail } from '../utils/email.js';

/**
 * User login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Verify password
    const isValid = await User.verifyPassword(email, password);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Get user with role information
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role_name || 'learner'
    });

    res.json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user info
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request password reset OTP
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Check if user exists
    const user = await User.findByEmail(email);
    
    // Don't reveal if user exists or not for security
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset code has been sent.'
      });
    }

    // Generate and save OTP
    const otp = await OTPCode.create(email);

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
      
      const response = {
        success: true,
        message: 'Password reset code has been sent to your email.'
      };

      // In development, include OTP in response for testing
      if (process.env.NODE_ENV === 'development') {
        response.otp = otp;
      }

      res.json(response);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      res.status(500).json({
        success: false,
        error: 'Failed to send email. Please try again later.'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP code
 */
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Email and OTP code are required'
      });
    }

    const result = await OTPCode.verify(email, otp);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password with OTP
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Email, OTP code, and new password are required'
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long'
      });
    }

    // Verify OTP
    const result = await OTPCode.verify(email, otp);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    // Update password
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await User.update(user.id, { password: newPassword });

    // Mark OTP as used
    await OTPCode.markAsUsed(result.otpRecord.id);

    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

