# Admin Login Credentials

## Default Admin User

**Email:** `admin@caavagroup.com`  
**Name:** Admin User  
**Role:** admin

## Password

The password in the sample data is hashed, so you need to **set a new password** to login.

## Setting Admin Password

### Option 1: Reset Password Script (Recommended)

```bash
cd backend
node scripts/reset-admin-password.js
```

This will prompt you to:
1. Enter admin email (default: `admin@caavagroup.com`)
2. Enter new password (minimum 8 characters)

### Option 2: Create New Admin User

```bash
cd backend
node scripts/create-user.js
```

Then select the admin role when prompted.

### Option 3: Use Default Password (Development Only)

For development, you can quickly set a default password:

```bash
cd backend
echo "admin@caavagroup.com" | node scripts/reset-admin-password.js
```

Then enter: `admin123` (or any password of your choice)

## List All Admin Users

To see all admin users in the database:

```bash
cd backend
node scripts/list-admin-users.js
```

## Quick Setup (One-time)

Run this to set admin password to `admin123`:

```bash
cd backend
node scripts/set-default-admin-password.js
```

(You may need to create this script)

## Login

Once you have the password:

1. Go to: `http://localhost:5173/login`
2. Email: `admin@caavagroup.com`
3. Password: (the password you set)
4. Click "Sign In"
5. You'll be redirected to `/admin` dashboard

## Security Note

⚠️ **For production**, make sure to:
- Use a strong password
- Change the default admin password
- Enable 2FA if possible
- Use environment variables for sensitive data

