# Knowledge Center - LMS Platform

A modern Learning Management System (LMS) built for Caava Group employees.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MariaDB/MySQL

## Quick Start

### Frontend Setup

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### Backend Setup

```bash
cd server
npm install
npm run init-db
npm run dev
```

Backend runs on `http://localhost:3000`

### Database Configuration

The backend is configured to use:
- Host: localhost
- User: root
- Password: mctm3223
- Database: kc

Update these in `server/.env` if needed.

### Create Test User

```bash
cd server
npm run create-user
```

Follow the prompts to create a user account.

## Project Structure

```
kc/
├── src/                    # Frontend source
│   ├── pages/             # Page components
│   │   ├── auth/         # Authentication pages
│   │   ├── learner/      # Learner pages
│   │   ├── admin/        # Admin pages
│   │   └── marketing/    # Marketing pages
│   ├── components/       # Reusable components
│   └── utils/            # Utilities (API client, etc.)
├── server/               # Backend server
│   ├── config/          # Database config
│   ├── routes/          # API routes
│   ├── utils/           # Utilities
│   └── scripts/         # Database scripts
└── public/              # Static assets
```

## Features

- ✅ User authentication (login)
- ✅ Password reset with OTP
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Learner dashboard
- ✅ Learning content page
- ✅ Admin reports page
- ✅ Landing page

## API Endpoints

See `server/README.md` for detailed API documentation.
