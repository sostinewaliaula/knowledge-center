# Authentication & Authorization Setup

## Overview

The authentication system is now fully connected between frontend and backend with role-based access control.

## Backend Setup

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/me` - Get current user (protected)

### Middleware

- `authenticateToken` - Verifies JWT token
- `requireRole(...roles)` - Checks if user has required role
- `requireAdmin` - Shorthand for admin-only access

### User Roles

- `admin` - Full system access
- `learner` - Access to learner dashboard
- `instructor` - Can create/manage courses
- `auditor` - Read-only access

## Frontend Setup

### Protected Routes

All admin routes are protected using the `ProtectedRoute` component:

```tsx
<Route path="/admin" element={
  <ProtectedRoute requiredRole="admin">
    <AdminDashboard />
  </ProtectedRoute>
} />
```

### Login Flow

1. User enters email and password
2. Frontend calls `api.login(email, password)`
3. Backend validates credentials and returns JWT token + user info
4. Token and user stored in localStorage
5. User redirected based on role:
   - `admin` → `/admin`
   - `learner` → `/learner`
   - Other roles → `/learner`

### Route Protection

- **Admin routes** (`/admin/*`) - Only accessible by users with `admin` role
- **Learner routes** (`/learner/*`) - Accessible by authenticated users
- **Public routes** (`/`, `/login`, `/forgot-password`) - No authentication required

### Security Features

1. **JWT Tokens** - Secure token-based authentication
2. **Role-based Access Control** - Routes protected by user role
3. **Automatic Redirects** - Unauthorized users redirected to appropriate page
4. **Token Validation** - Tokens verified on every protected route access

## Testing Login

### Test Credentials

Use the sample users from the database:

**Admin:**
- Email: `admin@caavagroup.com`
- Password: (check database or create new admin user)

**Learner:**
- Email: `john.kamau@caavagroup.com`
- Password: (check database or create new user)

### Creating Test Users

```bash
# Create admin user
node scripts/create-user.js
```

Or use the sample data migration which includes test users.

## Environment Variables

Make sure these are set in `.env`:

```env
# Backend
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=kc
JWT_SECRET=your_jwt_secret_key
PORT=3000
CORS_ORIGIN=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3000/api
```

## API Response Format

### Login Response

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role_name": "admin",
    "role_display_name": "Administrator"
  }
}
```

## Next Steps

1. ✅ Login functionality connected
2. ✅ Admin routes protected
3. ✅ Role-based redirects working
4. ⏭️ Add logout functionality
5. ⏭️ Add token refresh mechanism
6. ⏭️ Add session timeout handling

