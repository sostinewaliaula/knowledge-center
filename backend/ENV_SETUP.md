# Environment Variables Setup

Create a `.env` file in the `backend` folder with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration (MySQL/MariaDB)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=kc_lms

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Email Configuration (for OTP and notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@knowledgecenter.com

# Frontend URL (for links in emails)
FRONTEND_URL=http://localhost:5173
```

## Quick Setup Instructions

1. Copy this file to `.env` in the backend folder
2. Update `DB_PASSWORD` with your MySQL/MariaDB password
3. Update `JWT_SECRET` with a strong random string
4. Update `CORS_ORIGIN` with your frontend URL (if different)
5. Configure email settings if you want email functionality

## Important Notes

- Never commit the `.env` file to version control
- Use different JWT secrets for development and production
- Use strong, unique passwords for database access
- Email configuration is optional - OTP will be logged to console in development mode if not configured

