# Knowledge Center Backend API

A modern, independent backend API for the Knowledge Center LMS platform.

## Features

- ✅ RESTful API architecture
- ✅ MySQL/MariaDB database support
- ✅ JWT-based authentication
- ✅ Password reset with OTP via email
- ✅ Role-based access control (RBAC)
- ✅ Database migrations system
- ✅ CORS configuration
- ✅ Environment-based configuration
- ✅ Error handling middleware
- ✅ Request validation

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy the `.env.example` file to `.env` and update with your configuration:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and other settings.

**Important:** Update these values:
- `DB_PASSWORD` - Your MySQL/MariaDB password
- `JWT_SECRET` - A strong secret key for JWT tokens
- `CORS_ORIGIN` - Frontend URL (e.g., `http://localhost:5173`)
- Email configuration if using password reset

### 3. Create Database

Using HeidiSQL or MySQL command line:

```sql
CREATE DATABASE kc_lms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Run Migrations

This will create all necessary tables:

```bash
npm run migrate
```

### 5. Create Admin User (Optional)

```bash
npm run create-user
```

### 6. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:3000` (or your configured PORT).

## Database Setup

### Using HeidiSQL

1. Open HeidiSQL
2. Create a new session with your MySQL/MariaDB credentials
3. Connect to your server
4. Create a new database: `kc_lms`
5. Set character set to `utf8mb4` and collation to `utf8mb4_unicode_ci`
6. Run migrations: `npm run migrate`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (if enabled)
- `POST /api/auth/forgot-password` - Request password reset OTP
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/me` - Get current user info (protected)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Roles
- `GET /api/roles` - Get all roles
- `GET /api/roles/:id` - Get role by ID
- `POST /api/roles` - Create role (admin only)
- `PUT /api/roles/:id` - Update role (admin only)
- `DELETE /api/roles/:id` - Delete role (admin only)

### Health Check
- `GET /api/health` - API health status
- `GET /api` - API information

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 3306 |
| `DB_USER` | Database user | root |
| `DB_PASSWORD` | Database password | - |
| `DB_NAME` | Database name | kc_lms |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:5173 |

## Database Schema

The migrations will create the following tables:
- `users` - User accounts
- `roles` - User roles (admin, learner, instructor, etc.)
- `user_roles` - User-role assignments
- `otp_codes` - OTP codes for password reset
- `password_resets` - Password reset tokens

## Project Structure

```
backend/
├── config/
│   └── database.js       # Database connection configuration
├── controllers/          # Route controllers
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── role.controller.js
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── errorHandler.js  # Error handling middleware
├── migrations/           # Database migrations
│   ├── migrate.js
│   ├── status.js
│   └── *.sql           # SQL migration files
├── models/              # Database models/queries
│   ├── User.js
│   └── Role.js
├── routes/              # API routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── role.routes.js
├── scripts/             # Utility scripts
│   └── create-user.js
├── utils/
│   ├── jwt.js          # JWT utilities
│   ├── bcrypt.js       # Password hashing
│   ├── otp.js          # OTP generation
│   └── email.js        # Email utilities
├── .env.example        # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js           # Main server file
```

## Deployment

This backend is designed to be deployed independently. Update your frontend `.env` file with:

```
VITE_API_URL=https://your-backend-url.com/api
```

The backend will handle CORS based on your `CORS_ORIGIN` environment variable.

## Security Notes

- Always use strong JWT secrets in production
- Use HTTPS in production
- Keep your `.env` file secure and never commit it
- Use environment variables for all sensitive configuration
- Regularly update dependencies

## License

ISC

