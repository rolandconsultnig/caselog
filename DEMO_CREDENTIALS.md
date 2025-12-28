# Demo Login Credentials

Quick reference for all demo accounts in the system.

---

## 🔑 Universal Password

**All accounts use the same password:**
```
Password123!
```

---

## 🏛️ Federal Ministry of Justice

### Super Admin
```
Email: federal.superadmin@moj.gov.ng
Password: Password123!
Access: Full system access, all states
```

### App Admin
```
Email: federal.appadmin@moj.gov.ng
Password: Password123!
Access: Application administration
```

### Level 1 (Read Only)
```
Email: federal.level1@moj.gov.ng
Password: Password123!
Access: View cases only
```

### Level 2 (Create Cases)
```
Email: federal.level2@moj.gov.ng
Password: Password123!
Access: View + Create cases
```

### Level 3 (Approve/Reject + Reports)
```
Email: federal.level3@moj.gov.ng
Password: Password123!
Access: View + Create + Approve/Reject + Reports
```

### Level 4 (Request Deletions)
```
Email: federal.level4@moj.gov.ng
Password: Password123!
Access: Level 3 + Request deletions
```

### Level 5 (Approve Deletions)
```
Email: federal.level5@moj.gov.ng
Password: Password123!
Access: Level 4 + Approve deletions
```

---

## 🏙️ Lagos State

### Super Admin
```
Email: lagos.superadmin@justice.lg.gov.ng
Password: Password123!
Access: Full Lagos State access
```

### Level 1 (Read Only)
```
Email: lagos.level1@justice.lg.gov.ng
Password: Password123!
Access: View Lagos cases only
```

### Level 2 (Create Cases)
```
Email: lagos.level2@justice.lg.gov.ng
Password: Password123!
Access: View + Create Lagos cases
```

### Level 3 (Approve/Reject + Reports)
```
Email: lagos.level3@justice.lg.gov.ng
Password: Password123!
Access: View + Create + Approve/Reject + Reports
```

### Level 4 (Request Deletions)
```
Email: lagos.level4@justice.lg.gov.ng
Password: Password123!
Access: Level 3 + Request deletions
```

### Level 5 (Approve Deletions)
```
Email: lagos.level5@justice.lg.gov.ng
Password: Password123!
Access: Level 4 + Approve deletions
```

---

## 🏛️ FCT (Federal Capital Territory)

### Super Admin
```
Email: fct.superadmin@justice.gov.ng
Password: Password123!
Access: Full FCT access
```

### Level 1 (Read Only)
```
Email: fct.level1@justice.gov.ng
Password: Password123!
Access: View FCT cases only
```

### Level 2 (Create Cases)
```
Email: fct.level2@justice.gov.ng
Password: Password123!
Access: View + Create FCT cases
```

### Level 3 (Approve/Reject + Reports)
```
Email: fct.level3@justice.gov.ng
Password: Password123!
Access: View + Create + Approve/Reject + Reports
```

### Level 4 (Request Deletions)
```
Email: fct.level4@justice.gov.ng
Password: Password123!
Access: Level 3 + Request deletions
```

### Level 5 (Approve Deletions)
```
Email: fct.level5@justice.gov.ng
Password: Password123!
Access: Level 4 + Approve deletions
```

---

## 📊 Access Level Summary

| Level | Read | Create | Approve | Reports | Delete Request | Delete Approve |
|-------|------|--------|---------|---------|----------------|----------------|
| Level 1 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Level 2 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Level 3 | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Level 4 | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Level 5 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Super Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| App Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🎯 Recommended Test Accounts

### For Testing Basic Features:
```
State: Lagos State
Email: lagos.level2@justice.lg.gov.ng
Password: Password123!
```

### For Testing Reports:
```
State: Lagos State
Email: lagos.level3@justice.lg.gov.ng
Password: Password123!
```

### For Testing Full Features:
```
State: Lagos State
Email: lagos.superadmin@justice.lg.gov.ng
Password: Password123!
```

### For Testing Federal Access:
```
State: Federal Ministry of Justice (Federal)
Email: federal.level3@moj.gov.ng
Password: Password123!
```

---

## 🚨 Important Notes

### Other States:
- **Only Lagos, FCT, and Federal have demo users**
- Other states require admin to create users
- Contact system administrator for other state credentials

### Security:
- ⚠️ **Change passwords in production!**
- These are demo credentials only
- Not suitable for production use

### Creating Users for Other States:
1. Login as Federal Super Admin
2. Navigate to Users section
3. Create new user
4. Assign to specific state
5. Set access level

---

## 🔄 How to Login

### Step 1: Select State
1. Go to `http://localhost:3000`
2. Click "Staff Login"
3. Select your state from dropdown
4. Click "Continue to Login"

### Step 2: Enter Credentials
1. Enter email address
2. Enter password: `Password123!`
3. Click "Sign In"

### Step 3: Access Dashboard
- You'll be redirected to dashboard
- Selected state shown in sidebar
- Access based on your level

---

## 📱 Quick Copy-Paste

### Lagos Level 3 (Most Common):
```
lagos.level3@justice.lg.gov.ng
Password123!
```

### Federal Level 3:
```
federal.level3@moj.gov.ng
Password123!
```

### FCT Level 3:
```
fct.level3@justice.gov.ng
Password123!
```

---

## 🐛 Troubleshooting

### "Invalid email or password":
- ✅ Check you selected correct state
- ✅ Verify email is typed correctly
- ✅ Password is case-sensitive: `Password123!`
- ✅ Ensure database is seeded

### "Failed to load states":
- ✅ Run: `npx tsx prisma/seed.ts`
- ✅ Check database connection

### "Demo users only available for...":
- ✅ Select Lagos, FCT, or Federal
- ✅ Or create users for other states

---

## 📚 Related Documentation

- **[TWO_STEP_LOGIN_FEATURE.md](./TWO_STEP_LOGIN_FEATURE.md)** - Login flow
- **[STATE_SELECTION_FEATURE.md](./STATE_SELECTION_FEATURE.md)** - State selection
- **[ACCESS_CONTROL.md](./ACCESS_CONTROL.md)** - Permissions guide

---

**Last Updated**: November 2024
**Status**: ✅ Active Demo Accounts

