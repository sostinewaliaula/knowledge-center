# Quick Start - 5 Minutes

Get the backend up and running quickly!

## 1. Install Dependencies
```bash
cd backend
npm install
```

## 2. Create Database
In HeidiSQL:
```sql
CREATE DATABASE kc_lms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 3. Create .env File
Create `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=kc_lms
JWT_SECRET=change-this-to-a-random-string
CORS_ORIGIN=http://localhost:5173
PORT=3000
```

## 4. Run Migrations
```bash
npm run migrate
```

## 5. Start Server
```bash
npm run dev
```

✅ Done! Backend running on `http://localhost:3000`

## Test It
Open: `http://localhost:3000/api/health`

For detailed setup, see `SETUP.md`

