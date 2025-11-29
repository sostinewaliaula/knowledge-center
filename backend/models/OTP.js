import { query, queryOne } from '../config/database.js';
import { generateOTP, getOTPExpiration, isOTPExpired } from '../utils/otp.js';

export class OTPCode {
  /**
   * Create OTP code for email
   */
  static async create(email) {
    // Invalidate any existing OTPs for this email
    await this.invalidateAll(email);
    
    const code = generateOTP();
    const expiresAt = getOTPExpiration();
    
    const sql = `
      INSERT INTO otp_codes (email, code, expires_at)
      VALUES (?, ?, ?)
    `;
    
    await query(sql, [email, code, expiresAt]);
    
    return code;
  }

  /**
   * Verify OTP code
   */
  static async verify(email, code) {
    const sql = `
      SELECT * FROM otp_codes
      WHERE email = ? AND code = ? AND used = 0
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const otpRecord = await queryOne(sql, [email, code]);
    
    if (!otpRecord) {
      return { valid: false, error: 'Invalid OTP code' };
    }
    
    if (isOTPExpired(otpRecord.expires_at)) {
      return { valid: false, error: 'OTP code has expired' };
    }
    
    return { valid: true, otpRecord };
  }

  /**
   * Mark OTP as used
   */
  static async markAsUsed(id) {
    const sql = 'UPDATE otp_codes SET used = 1 WHERE id = ?';
    await query(sql, [id]);
  }

  /**
   * Invalidate all OTPs for an email
   */
  static async invalidateAll(email) {
    const sql = 'UPDATE otp_codes SET used = 1 WHERE email = ? AND used = 0';
    await query(sql, [email]);
  }

  /**
   * Clean up expired OTPs (optional utility)
   */
  static async cleanupExpired() {
    const sql = 'DELETE FROM otp_codes WHERE expires_at < NOW()';
    await query(sql);
  }
}

