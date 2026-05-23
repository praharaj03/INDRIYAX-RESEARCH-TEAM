# Admin Session Management

## Overview
The admin panel now has complete session management with automatic expiration. When a session ends, the admin will be required to re-enter their username and password.

## Features Implemented

### 1. **Proxy Protection** (`proxy.ts`)
- Automatically checks for valid admin session on all `/admin/*` routes
- Redirects to login page if session is missing or expired
- Preserves the original URL to redirect back after successful login
- Excludes login page and auth API from session checks
- Redirects logged-in users away from login page to dashboard

### 2. **Session Cookie Management**
- Session stored as HTTP-only cookie named `admin_session`
- Default duration: **8 hours** (configurable)
- Secure flag enabled in production
- SameSite: lax for CSRF protection

### 3. **Logout Functionality**
- Logout button added to the admin topbar (top-right corner)
- Clears the session cookie
- Redirects to login page
- Shows loading state during logout

### 4. **Configurable Session Duration**
- Set via `ADMIN_SESSION_DURATION` environment variable (in hours)
- Default: 8 hours if not specified
- Can be adjusted based on security requirements

## Configuration

### Environment Variables (`.env.local`)

```env
# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=indriyax@admin2025

# Session duration in hours (default: 8)
ADMIN_SESSION_DURATION=8
```

### Adjusting Session Duration

To change how long an admin stays logged in:

1. Open `.env.local`
2. Modify `ADMIN_SESSION_DURATION` value (in hours)
3. Restart the development server

**Examples:**
- `ADMIN_SESSION_DURATION=1` → 1 hour session
- `ADMIN_SESSION_DURATION=24` → 24 hour session
- `ADMIN_SESSION_DURATION=0.5` → 30 minutes session

## How It Works

### Login Flow
1. Admin enters username and password
2. Server validates credentials
3. If valid, creates session cookie with expiration
4. Admin is redirected to dashboard (or original requested page)

### Session Validation
1. Every admin page request is intercepted by the proxy
2. Proxy checks for `admin_session` cookie
3. If cookie is missing or expired → redirect to login
4. If cookie is valid → allow access
5. If already logged in and trying to access login page → redirect to dashboard

### Logout Flow
1. Admin clicks logout button in topbar
2. API call clears the session cookie
3. Admin is redirected to login page

### Automatic Expiration
- After the configured duration (default 8 hours), the cookie expires
- Next request to any admin page will redirect to login
- Admin must re-enter credentials to continue

## Security Features

✅ **HTTP-only cookies** - Cannot be accessed via JavaScript (XSS protection)  
✅ **Secure flag in production** - Cookie only sent over HTTPS  
✅ **SameSite protection** - Prevents CSRF attacks  
✅ **Server-side validation** - Proxy checks every request  
✅ **Automatic expiration** - Sessions don't last forever  
✅ **Path restriction** - Cookie only sent to `/admin` routes  

## Files Modified

1. **`proxy.ts`** (updated) - Session validation and route protection
2. **`components/admin/AdminTopbar.tsx`** - Added logout button
3. **`app/api/admin/auth/route.ts`** - Configurable session duration
4. **`.env.local`** - Added `ADMIN_SESSION_DURATION` configuration

## Testing

### Test Session Expiration
1. Login to admin panel
2. Wait for session duration to expire (or manually delete the `admin_session` cookie)
3. Try to access any admin page
4. Should be redirected to login page

### Test Logout
1. Login to admin panel
2. Click the "Logout" button in the top-right corner
3. Should be redirected to login page
4. Try to access admin pages - should require login again

### Test Session Persistence
1. Login to admin panel
2. Navigate between different admin pages
3. Should remain logged in without re-entering credentials
4. Close browser and reopen (within session duration)
5. Should still be logged in

## Troubleshooting

**Issue: Admin keeps getting logged out immediately**
- Check if `ADMIN_SESSION_DURATION` is set to a very low value
- Ensure system time is correct (affects cookie expiration)

**Issue: Session doesn't expire**
- Verify `ADMIN_SESSION_DURATION` is set correctly
- Check browser cookie settings
- Clear browser cache and cookies

**Issue: Logout button not working**
- Check browser console for errors
- Verify `/api/admin/auth/logout` endpoint is accessible
- Ensure JavaScript is enabled

## Production Recommendations

1. **Use strong credentials**: Change default admin username and password
2. **Set appropriate session duration**: Balance security vs. convenience
3. **Enable HTTPS**: Ensures secure cookie transmission
4. **Monitor sessions**: Log admin login/logout events
5. **Consider 2FA**: Add two-factor authentication for extra security
6. **Regular password rotation**: Change admin password periodically

## Future Enhancements (Optional)

- [ ] Add "Remember Me" option for longer sessions
- [ ] Implement session activity tracking
- [ ] Add idle timeout (auto-logout after inactivity)
- [ ] Multiple admin users with different permissions
- [ ] Session management dashboard
- [ ] Email notifications on login
- [ ] Two-factor authentication (2FA)
