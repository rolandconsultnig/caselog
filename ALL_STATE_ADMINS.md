# 🏛️ All Nigerian State Admin Credentials

## 📋 Overview
- **Total States**: 37 (36 States + 1 Federal Capital Territory)
- **Access Level**: LEVEL_4 (State Administrator)
- **Password**: `admin123` (uniform for all state admins)
- **Security**: Tenant isolation - each admin can only access their own state

---

## 🔐 Login Credentials

### 🌐 Federal Admin (Can Access ALL States)
```
Username: nadmin.admin
Password: admin123
Access: SUPER_ADMIN
Organization: Federal Ministry of Justice
Special: Can access all 37 states
```

### 🏛️ State Admins (State-Restricted Access)

#### North Central States
```
1. benue.admin      - Benue State      (BE)
2. kogi.admin       - Kogi State       (KO)
3. kwara.admin      - Kwara State      (KW)
4. nasarawa.admin   - Nasarawa State   (NA)
5. niger.admin      - Niger State      (NI)
6. plateau.admin    - Plateau State    (PL)
7. fct.admin        - FCT - Abuja      (FC)
```

#### North East States
```
8. adamawa.admin    - Adamawa State    (AD)
9. bauchi.admin     - Bauchi State     (BA)
10. borno.admin     - Borno State      (BO)
11. gombe.admin     - Gombe State      (GO)
12. taraba.admin    - Taraba State     (TA)
13. yobe.admin      - Yobe State       (YO)
```

#### North West States
```
14. jigawa.admin    - Jigawa State     (JI)
15. kaduna.admin    - Kaduna State     (KD)
16. kano.admin      - Kano State       (KN)
17. katsina.admin   - Katsina State    (KT)
18. kebbi.admin     - Kebbi State      (KE)
19. sokoto.admin    - Sokoto State     (SO)
20. zamfara.admin   - Zamfara State    (ZA)
```

#### South East States
```
21. abia.admin      - Abia State       (AB)
22. anambra.admin   - Anambra State    (AN)
23. ebonyi.admin    - Ebonyi State     (EB)
24. enugu.admin     - Enugu State      (EN)
25. imo.admin       - Imo State        (IM)
```

#### South South States
```
26. akwaibom.admin  - Akwa Ibom State  (AK)
27. bayelsa.admin   - Bayelsa State    (BY)
28. crossriver.admin - Cross River State (CR)
29. delta.admin     - Delta State      (DE)
30. edo.admin       - Edo State        (ED)
31. rivers.admin    - Rivers State     (RI)
```

#### South West States
```
32. ekiti.admin     - Ekiti State      (EK)
33. lagos.admin     - Lagos State      (LA)
34. ogun.admin      - Ogun State       (OG)
35. ondo.admin      - Ondo State       (ON)
36. osun.admin      - Osun State       (OS)
37. oyo.admin       - Oyo State        (OY)
```

---

## 🔒 Security Features

### ✅ Tenant Isolation
- Each state admin can **ONLY** access data from their assigned state
- Cannot view, edit, or manage users/cases from other states
- Automatic access control enforcement at database level

### ✅ Role-Based Access
- **Level 4 (State Admin)**: Full state-level management
- **SUPER_ADMIN (nadmin.admin)**: Federal oversight of all states

### ✅ Audit Logging
- All admin actions are logged with user details
- Track user creation, case management, and system changes

---

## 🌐 Access Information

### Login URL
- **Local**: http://localhost:3550/auth/signin
- **LAN**: http://192.168.56.1:3550/auth/signin (or other network IPs)

### Credentials Format
- **Username**: `{statename}.admin` (e.g., `lagos.admin`)
- **Password**: `admin123`
- **Federal Admin**: `nadmin.admin` (access to all states)

---

## 📱 Admin Capabilities

### State Admin (Level 4)
- ✅ Create, edit, delete users within their state
- ✅ Create Investigator & Prosecutor accounts
- ✅ Manage cases within their state
- ✅ Modify approved cases (Level 4 privilege)
- ✅ View state-level reports and analytics
- ❌ Cannot access other states' data

### Federal Admin (nadmin.admin)
- ✅ Access all 37 states
- ✅ Manage federal users
- ✅ Oversight of all state operations
- ✅ Cross-state reporting and analytics
- ✅ System-wide administration

---

## 🧪 Testing Examples

### Test State Isolation
1. **Login as `lagos.admin`** → Should only see Lagos State data
2. **Login as `kano.admin`** → Should only see Kano State data
3. **Login as `nadmin.admin`** → Can access all states

### Test User Management
1. **State Admin** → Can only create users for their state
2. **Federal Admin** → Can create users for any state

---

## 📞 Support

- **Documentation**: STATE_ADMIN_USER_MANAGEMENT.md
- **Environment Setup**: ENVIRONMENT_SETUP.md
- **Issues**: Check browser console for authentication errors

---

**Created**: January 3, 2026  
**Version**: 1.0  
**Status**: ✅ All 37 state admins active and functional
