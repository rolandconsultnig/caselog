# 🔍 Authentication Troubleshooting

## Current Issue
Getting 401 Unauthorized when trying to login.

## Steps Taken
1. ✅ Fixed bcrypt import in `prisma/seed.ts`
2. ✅ Re-seeded database successfully
3. ✅ Fixed bcrypt import in `lib/auth.ts`
4. ✅ Added error handling to audit log creation
5. ⏳ Testing login again

## Test Credentials
- **Email**: `lagos.superadmin@justice.lg.gov.ng`
- **Password**: `Password123!`
- **State**: Lagos State

## Debugging Steps

### 1. Check if user exists in database
Open Prisma Studio (running in background):
```
http://localhost:5555
```

Navigate to `User` table and verify:
- Email: `lagos.superadmin@justice.lg.gov.ng` exists
- Password is hashed
- `isActive` is `true`
- `tenantId` is set

### 2. Check database connection
The seed script worked, so database connection is OK.

### 3. Check NextAuth configuration
- ✅ `NEXTAUTH_SECRET` should be set in `.env`
- ✅ `NEXTAUTH_URL` should be `http://localhost:3000`

### 4. Check browser console
Look for specific error messages that might give more details.

### 5. Try different user
If Lagos doesn't work, try Federal:
- **Email**: `federal.superadmin@moj.gov.ng`
- **Password**: `Password123!`

## Possible Causes

1. **Environment Variables Missing**
   - Check if `.env` file has `NEXTAUTH_SECRET`
   - Check if `DATABASE_URL` is correct

2. **Password Hashing Mismatch**
   - Seed uses bcrypt to hash
   - Auth uses bcrypt to compare
   - Both should match

3. **Tenant Relationship**
   - User must have valid `tenantId`
   - Tenant must exist in database

4. **AuditLog Issue**
   - Fixed by adding try-catch
   - Won't block login now

## Next Steps

1. **Refresh browser** (Ctrl+F5)
2. **Try login again**
3. **Check Prisma Studio** to verify user exists
4. **Check terminal** for any error messages

## Manual Test Query

You can test the user exists with:
```sql
SELECT * FROM "User" WHERE email = 'lagos.superadmin@justice.lg.gov.ng';
```

Should return a user with:
- Hashed password
- isActive = true
- tenantId set
- accessLevel = SUPER_ADMIN

