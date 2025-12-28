# 🔐 Login Credentials - Quick Reference

**Password for ALL users**: `Password123!`

---

## 🏛️ Federal Ministry of Justice

### Super Admin
- **Email**: `federal.superadmin@moj.gov.ng`
- **Password**: `Password123!`
- **Access**: Full system access across all states

### App Administrator
- **Email**: `federal.appadmin@moj.gov.ng`
- **Password**: `Password123!`
- **Access**: Application administration

### Federal Level Users
- **Level 1**: `federal.level1@moj.gov.ng` (Read Only)
- **Level 2**: `federal.level2@moj.gov.ng` (Create Cases)
- **Level 3**: `federal.level3@moj.gov.ng` (Approve/Reject)
- **Level 4**: `federal.level4@moj.gov.ng` (Request Deletions)
- **Level 5**: `federal.level5@moj.gov.ng` (Approve Deletions)

---

## 🏙️ Lagos State

### Super Admin
- **Email**: `lagos.superadmin@justice.lg.gov.ng`
- **Password**: `Password123!`

### Level Users
- **Level 1**: `lagos.level1@justice.lg.gov.ng`
- **Level 2**: `lagos.level2@justice.lg.gov.ng`
- **Level 3**: `lagos.level3@justice.lg.gov.ng`
- **Level 4**: `lagos.level4@justice.lg.gov.ng`
- **Level 5**: `lagos.level5@justice.lg.gov.ng`

---

## 🏛️ FCT (Federal Capital Territory)

### Super Admin
- **Email**: `fct.superadmin@justice.gov.ng`
- **Password**: `Password123!`

### Level Users
- **Level 1**: `fct.level1@justice.gov.ng`
- **Level 2**: `fct.level2@justice.gov.ng`
- **Level 3**: `fct.level3@justice.gov.ng`
- **Level 4**: `fct.level4@justice.gov.ng`
- **Level 5**: `fct.level5@justice.gov.ng`

---

## 🎯 How to Login

1. Go to `http://localhost:3000`
2. Click "Staff Login"
3. **Select your state** from the dropdown
4. Enter email and password
5. Click "Sign In"

---

## 📊 Access Levels Explained

| Level | Permissions |
|-------|-------------|
| **Level 1** | Read only - View cases and reports |
| **Level 2** | Create cases, add evidence, add witnesses |
| **Level 3** | Approve/reject cases, update status, reassign |
| **Level 4** | Request deletions, archive cases, close cases |
| **Level 5** | Approve deletions, restore cases, bulk operations |
| **Super Admin** | User management, system configuration, audit logs |
| **App Admin** | Full system access, cross-state, federal oversight |

---

## 🔧 Troubleshooting

### "401 Unauthorized" Error
- ✅ **FIXED**: Database has been re-seeded
- Try logging in again with credentials above

### Can't Login?
1. Make sure you selected the correct state
2. Check email is typed correctly
3. Password is case-sensitive: `Password123!`
4. Clear browser cache and try again

### Need to Reset Database?
```bash
npx prisma db push --force-reset
npx ts-node prisma/seed.ts
```

---

## 🎊 Quick Test Login

**Recommended for testing**:
- **Email**: `lagos.superadmin@justice.lg.gov.ng`
- **Password**: `Password123!`
- **State**: Select "Lagos State"

This account has full access to test all features!

---

**Last Updated**: November 11, 2025  
**Status**: ✅ All credentials active and working

