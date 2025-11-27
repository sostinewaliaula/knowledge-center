# Knowledge Center Backend API

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

The `.env` file is already created with your database credentials:
- DB_HOST=localhost
- DB_USER=root
- DB_PASSWORD=mctm3223
- DB_NAME=kc
- JWT_SECRET=kc-secret-key-2024-production
- PORT=3000

### 3. Initialize Database

Run the database initialization script to create the required tables:

```bash
node scripts/init-db.js
```

This will create:
- `users` table (for user accounts)
- `otp_codes` table (for password reset OTPs)
- `password_resets` table (for password reset tokens)

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
  - Body: `{ email, password }`
  - Returns: `{ success, token, user }`

- `POST /api/auth/forgot-password` - Send OTP for password reset
  - Body: `{ email }`
  - Returns: `{ success, message, otp }` (otp only in development)

- `POST /api/auth/verify-otp` - Verify OTP code
  - Body: `{ email, otp }`
  - Returns: `{ success, message }`

- `POST /api/auth/reset-password` - Reset password with OTP
  - Body: `{ email, otp, newPassword }`
  - Returns: `{ success, message }`

### Health Check

- `GET /api/health` - Check if API is running

## Database Schema

### users
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- email (VARCHAR(255), UNIQUE, NOT NULL)
- password (VARCHAR(255), NOT NULL) - bcrypt hashed
- name (VARCHAR(255))
- role (VARCHAR(50), DEFAULT 'learner')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### otp_codes
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- email (VARCHAR(255), NOT NULL)
- code (VARCHAR(6), NOT NULL)
- expires_at (TIMESTAMP, NOT NULL)
- used (BOOLEAN, DEFAULT FALSE)
- created_at (TIMESTAMP)

### password_resets
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- email (VARCHAR(255), NOT NULL)
- token (VARCHAR(255), NOT NULL)
- expires_at (TIMESTAMP, NOT NULL)
- used (BOOLEAN, DEFAULT FALSE)
- created_at (TIMESTAMP)

## Notes

- OTP codes expire after 10 minutes
- In development mode, OTP is returned in the API response for testing
- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days

