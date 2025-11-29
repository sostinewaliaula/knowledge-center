# Knowledge Center - Complete Setup Guide

This guide will help you set up both the frontend and backend of the Knowledge Center LMS.

## Architecture

- **Frontend**: React + TypeScript + Vite (runs on port 5173)
- **Backend**: Node.js + Express (runs on port 3000)
- **Database**: MySQL/MariaDB
- **Deployment**: Both frontend and backend can be deployed independently

## Quick Start

### Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create database:**
   - Open HeidiSQL
   - Create database: `kc_lms`
   - Set charset: `utf8mb4`, collation: `utf8mb4_unicode_ci`

4. **Configure environment:**
   - Copy `ENV_SETUP.md` content to `.env` file
   - Update database credentials
   - Set JWT_SECRET
   - Set CORS_ORIGIN to `http://localhost:5173`

5. **Run migrations:**
   ```bash
   npm run migrate
   ```

6. **Create admin user (optional):**
   ```bash
   npm run create-user
   ```

7. **Start backend:**
   ```bash
   npm run dev
   ```

Backend should be running on `http://localhost:3000`

### Frontend Setup

1. **Create environment file:**
   - Copy `.env.example` to `.env` in the root directory
   - Set `VITE_API_URL=http://localhost:3000/api`

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start frontend:**
   ```bash
   npm run dev
   ```

Frontend should be running on `http://localhost:5173`

## Environment Variables

### Backend (.env in backend folder)

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=kc_lms

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Server
PORT=3000
NODE_ENV=development
```

### Frontend (.env in root folder)

```env
VITE_API_URL=http://localhost:3000/api
```

## Database Setup with HeidiSQL

1. Open HeidiSQL
2. Click "New" to create a new session
3. Enter your MySQL/MariaDB credentials:
   - Network type: MySQL (TCP/IP)
   - Host: localhost (or your server IP)
   - User: root (or your MySQL user)
   - Password: your MySQL password
4. Click "Open" to connect
5. Create new database:
   - Right-click in the left panel → "Create new" → "Database"
   - Name: `kc_lms`
   - Character set: `utf8mb4`
   - Collation: `utf8mb4_unicode_ci`
6. Click "OK"

## Default Users

After running migrations, you can create users with the `create-user` script:

```bash
cd backend
npm run create-user
```

## Testing the Setup

1. **Backend health check:**
   - Open: `http://localhost:3000/api/health`
   - Should return: `{"status":"ok",...}`

2. **Frontend:**
   - Open: `http://localhost:5173`
   - Should see the landing page

3. **Login:**
   - Navigate to login page
   - Use credentials from the user you created

## Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Update `CORS_ORIGIN` to your frontend URL
3. Update database connection settings
4. Run migrations: `npm run migrate`
5. Start server: `npm start`

### Frontend Deployment

1. Update `.env` with your backend API URL:
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   ```
2. Build: `npm run build`
3. Deploy the `dist` folder to your hosting

## Troubleshooting

### Backend won't start
- Check database connection
- Verify `.env` file exists and has correct values
- Make sure MySQL/MariaDB is running
- Check port 3000 is not in use

### Frontend can't connect to backend
- Verify backend is running
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend `.env`
- Verify no firewall blocking connection

### Database errors
- Verify database exists
- Check database credentials
- Make sure migrations ran successfully
- Check user permissions

## Project Structure

```
kc/
├── backend/              # Backend API
│   ├── config/          # Database config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & error handling
│   ├── migrations/      # Database migrations
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts
│   ├── utils/           # Utilities
│   └── server.js        # Main server file
├── src/                 # Frontend source
│   ├── pages/           # Page components
│   ├── components/      # Reusable components
│   └── utils/           # Frontend utilities
└── .env                 # Frontend environment
```

## Support

For more details:
- Backend API docs: `backend/README.md`
- Backend setup: `backend/SETUP.md`
- Environment setup: `backend/ENV_SETUP.md`

