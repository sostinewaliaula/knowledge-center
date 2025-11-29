# Backend Setup Guide

This guide will help you set up the Knowledge Center backend API from scratch.

## Prerequisites

- Node.js (v16 or higher)
- MySQL or MariaDB installed and running
- HeidiSQL (or any MySQL client)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create Database

Using HeidiSQL or MySQL command line:

1. Open HeidiSQL
2. Connect to your MySQL/MariaDB server
3. Create a new database:
   ```sql
   CREATE DATABASE kc_lms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` folder. You can copy the template from `ENV_SETUP.md`:

**Minimum required configuration:**

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=kc_lms

JWT_SECRET=your-super-secret-key-here
CORS_ORIGIN=http://localhost:5173
```

**Full configuration example:**

See `ENV_SETUP.md` for all available options.

### 4. Run Database Migrations

This will create all necessary tables and insert default roles:

```bash
npm run migrate
```

Expected output:
```
🔄 Starting database migrations...
✅ Executed: 001_initial_schema.sql
✅ Successfully executed 1 migration(s)!
```

### 5. Verify Migration Status

Check which migrations have been executed:

```bash
npm run migrate:status
```

### 6. Create Your First User (Optional)

Create an admin user:

```bash
npm run create-user
```

Follow the prompts:
- Enter email
- Enter name (optional)
- Enter password (min 8 characters)
- Select role (1 = Admin, 2 = Learner, etc.)

### 7. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

You should see:
```
🚀 Knowledge Center API Server
═══════════════════════════════════════
📍 Server running on http://localhost:3000
🌍 Environment: development
🔗 CORS Origin: http://localhost:5173
📡 API Base URL: http://localhost:3000/api
═══════════════════════════════════════

✅ Database connected successfully
```

### 8. Test the API

Test the health endpoint:
```bash
curl http://localhost:3000/api/health
```

Or open in browser: `http://localhost:3000/api/health`

## Default Roles

The migration creates these default roles:

- **admin** - Administrator (Full system access)
- **learner** - Learner (Access to learning content)
- **instructor** - Instructor (Can create and manage courses)
- **auditor** - Auditor (Read-only access)

## Troubleshooting

### Database Connection Error

If you see `❌ Database connection error`:

1. Check if MySQL/MariaDB is running
2. Verify database credentials in `.env`
3. Make sure the database `kc_lms` exists
4. Check firewall settings

### Migration Errors

If migrations fail:

1. Make sure the database exists
2. Check database user has CREATE TABLE permissions
3. Verify no conflicting tables exist
4. Check migration logs for specific errors

### CORS Errors in Frontend

If you see CORS errors:

1. Make sure `CORS_ORIGIN` in `.env` matches your frontend URL
2. Restart the backend server after changing `.env`
3. Check browser console for exact CORS error

## Next Steps

1. Configure your frontend to connect to this backend (see frontend `.env.example`)
2. Test authentication endpoints
3. Start building your LMS features!

## API Documentation

See `README.md` for complete API endpoint documentation.

