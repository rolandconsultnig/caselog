# Two-Step State-Specific Login Feature

## Overview
Enhanced login flow with state selection followed by state-branded login page featuring coat of arms and state logo.

---

## 🎯 New Login Flow

### Step 1: State Selection
**URL**: `/auth/select-state`

Users first select their state from a dropdown, then proceed to the state-specific login page.

### Step 2: State Login Page
**URL**: `/auth/signin/[tenantId]`

Each state has its own branded login page with:
- State coat of arms
- State name and ministry
- State-specific branding
- Customized demo credentials

---

## 📁 Files Created/Modified

### New Files
1. **`app/auth/select-state/page.tsx`** - State selection page
2. **`app/auth/signin/[tenantId]/page.tsx`** - Dynamic state-specific login page

### Modified Files
1. **`app/auth/signin/page.tsx`** - Now redirects to state selection
2. **`app/(public)/page.tsx`** - Updated Staff Login links

---

## 🎨 User Experience

### Step 1: State Selection Page

#### Features:
- Clean, focused interface
- Dropdown with all 37 states + Federal
- "Continue to Login" button
- Back to Home link

#### Visual Flow:
```
┌─────────────────────────────────────┐
│   🛡️ National SGBV Case Portal      │
│   Select Your State                 │
├─────────────────────────────────────┤
│   📍 State / Federal Ministry       │
│   [Dropdown: Select your state  ▼] │
│                                     │
│   [Continue to Login →]             │
│                                     │
│   ← Back to Home                    │
└─────────────────────────────────────┘
```

---

### Step 2: State-Specific Login Page

#### Header Section (Green Gradient):
- **Coat of Arms**: Large circular badge
  - Federal: Building icon
  - States: Shield icon
- **State Name**: Bold, prominent
- **Ministry Label**: "Ministry of Justice" or "Federal Ministry of Justice"
- **Portal Label**: "SGBV Case Management Portal"

#### Login Form:
- Email input
- Password input
- Sign In button
- "Change State" link (returns to selection)
- State-specific demo credentials

#### Visual Layout:
```
┌─────────────────────────────────────┐
│  ╔═══════════════════════════════╗  │
│  ║   [Green Gradient Header]     ║  │
│  ║                               ║  │
│  ║        ⚪ Coat of Arms         ║  │
│  ║                               ║  │
│  ║      LAGOS STATE              ║  │
│  ║   Ministry of Justice         ║  │
│  ║  SGBV Case Management Portal  ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
│  Staff Login                        │
│  Enter your credentials             │
│                                     │
│  📧 Email Address                   │
│  [Input field]                      │
│                                     │
│  🔒 Password                        │
│  [Input field]                      │
│                                     │
│  [Sign In]                          │
│                                     │
│  ← Change State                     │
│                                     │
│  Demo Credentials:                  │
│  Email: lagos.level3@...            │
│  Password: Password123!             │
└─────────────────────────────────────┘
```

---

## 🎨 Design Elements

### Color Scheme

#### State Selection Page:
- Background: Green gradient (from-green-50 to-green-100)
- Primary button: Green-600
- Accent: Green-700 on hover

#### State Login Page:
- Header: Green gradient (from-green-600 to-green-700)
- Coat of Arms: White circular background
- Text: White on green header, dark on white body

### Icons

#### State Selection:
- 🛡️ Shield (main logo)
- 📍 Map pin (state selector)
- → Arrow right (continue button)

#### State Login:
- 🏛️ Building (Federal coat of arms)
- 🛡️ Shield (State coat of arms)
- ← Arrow left (change state link)

---

## 🔄 Navigation Flow

### Entry Points:
1. **Public Homepage** → Staff Login button → State Selection
2. **Direct URL** `/auth/signin` → Auto-redirect to State Selection
3. **Direct URL** `/auth/select-state` → State Selection

### Flow Diagram:
```
Public Page
    ↓
[Staff Login Button]
    ↓
State Selection Page (/auth/select-state)
    ↓
[Select State + Continue]
    ↓
State Login Page (/auth/signin/[tenantId])
    ↓
[Enter Credentials + Sign In]
    ↓
Dashboard
```

### Back Navigation:
```
State Login Page
    ↓
[Change State Link]
    ↓
State Selection Page
    ↓
[Back to Home Link]
    ↓
Public Homepage
```

---

## 🎯 State-Specific Features

### Coat of Arms Display

#### Federal Ministry:
- Icon: Building2 (🏛️)
- Color: Green-600
- Background: White circular badge
- Size: 64x64px

#### State Ministries:
- Icon: Shield (🛡️)
- Color: Green-600
- Background: White circular badge
- Size: 64x64px

**Future Enhancement**: Replace icons with actual state coat of arms images

### State Branding

Each state login page displays:
1. **State Name**: e.g., "Lagos State", "Kano State"
2. **Ministry**: "Ministry of Justice"
3. **Portal Type**: "SGBV Case Management Portal"
4. **Copyright**: "© 2024 [State Name]. All rights reserved."

### Demo Credentials

#### Federal:
```
Email: federal.level3@moj.gov.ng
Password: Password123!
```

#### States (Example - Lagos):
```
Email: lagos.level3@justice.gov.ng
Password: Password123!
```

---

## 💾 Session Storage

### Stored Data:
```javascript
sessionStorage.setItem('selectedTenantId', 'uuid');
sessionStorage.setItem('selectedTenantName', 'Lagos State');
```

### Usage:
- Persists state selection across pages
- Displayed in dashboard sidebar
- Used for state-specific filtering
- Cleared on logout

---

## 🔐 Security

### Authentication:
- ✅ State selection is for UI/branding only
- ✅ Actual authentication via NextAuth
- ✅ User permissions based on database tenant
- ✅ Cannot bypass authentication by URL manipulation

### Validation:
- ✅ Invalid tenant ID redirects to state selection
- ✅ Required field validation
- ✅ Email format validation
- ✅ Form disabled during submission

---

## 📱 Responsive Design

### Mobile (<768px):
- Full-width cards
- Stacked layout
- Touch-friendly buttons (min 44px)
- Readable text sizes

### Tablet (768px-1024px):
- Centered card (max-width: 28rem)
- Balanced spacing
- Optimized for portrait/landscape

### Desktop (>1024px):
- Centered card (max-width: 28rem)
- Generous padding
- Hover effects on buttons

---

## 🎨 Future Enhancements

### Planned Features:

#### 1. Actual Coat of Arms Images
```typescript
// Replace icon with actual image
<Image
  src={`/images/coat-of-arms/${stateCode}.png`}
  alt={`${stateName} Coat of Arms`}
  width={64}
  height={64}
/>
```

#### 2. State Logos
```typescript
// Add state ministry logo
<Image
  src={`/images/logos/${stateCode}-ministry.png`}
  alt={`${stateName} Ministry Logo`}
  width={120}
  height={40}
/>
```

#### 3. State Color Schemes
```typescript
// Custom colors per state
const stateColors = {
  lagos: { primary: '#0066cc', secondary: '#004499' },
  kano: { primary: '#cc0000', secondary: '#990000' },
  // ... other states
};
```

#### 4. State-Specific Backgrounds
- Custom background images
- State landmarks
- Cultural patterns

#### 5. Multi-Language Support
- Hausa for northern states
- Yoruba for southwestern states
- Igbo for southeastern states

#### 6. Remember Last State
```typescript
// Store last selected state
localStorage.setItem('lastSelectedState', tenantId);

// Auto-select on return visit
const lastState = localStorage.getItem('lastSelectedState');
if (lastState) {
  setSelectedState(lastState);
}
```

---

## 🧪 Testing Checklist

### State Selection Page:
- [ ] Dropdown loads all states
- [ ] Federal shows "(Federal)" label
- [ ] States sorted alphabetically
- [ ] Cannot continue without selection
- [ ] Loading state displays
- [ ] Back to Home link works
- [ ] Redirects to correct state login

### State Login Page:
- [ ] Correct state name displays
- [ ] Coat of arms shows correctly
- [ ] Federal vs State differentiation
- [ ] Email/password validation
- [ ] Sign in functionality
- [ ] Change State link works
- [ ] Demo credentials display
- [ ] Session storage updated
- [ ] Redirects to dashboard

### Navigation:
- [ ] /auth/signin redirects to selection
- [ ] Public page links work
- [ ] Back navigation functional
- [ ] Invalid tenant ID handled

---

## 🐛 Troubleshooting

### Issue: State selection doesn't load states
**Solution**: 
- Check database is seeded
- Run `npx tsx prisma/seed.ts`
- Check API endpoint `/api/tenants`

### Issue: Login page shows wrong state
**Solution**:
- Clear session storage
- Go back to state selection
- Select correct state

### Issue: Coat of arms not showing
**Solution**:
- Icons are placeholders (Shield/Building)
- Add actual images in future enhancement

### Issue: Can't access state login directly
**Solution**:
- Must go through state selection first
- Direct URL access validates tenant ID
- Invalid ID redirects to selection

---

## 📊 URL Structure

### Routes:
```
/                           → Public homepage
/auth/select-state          → State selection page
/auth/signin                → Redirects to select-state
/auth/signin/[tenantId]     → State-specific login
/dashboard                  → Dashboard (after login)
```

### Example URLs:
```
/auth/signin/uuid-lagos     → Lagos State login
/auth/signin/uuid-federal   → Federal Ministry login
/auth/signin/uuid-kano      → Kano State login
```

---

## 💡 Benefits

### For Users:
- ✅ Clear state identification
- ✅ Professional state branding
- ✅ Reduced login confusion
- ✅ Visual confirmation of correct state
- ✅ Familiar state symbols (coat of arms)

### For States:
- ✅ Individual state identity
- ✅ Professional appearance
- ✅ State pride and ownership
- ✅ Customizable branding

### For Administrators:
- ✅ Better audit trail
- ✅ Clear state routing
- ✅ Reduced support tickets
- ✅ Easy state identification

---

## 📚 Related Documentation

- **[STATE_SELECTION_FEATURE.md](./STATE_SELECTION_FEATURE.md)** - Original state selection
- **[README.md](./README.md)** - Main documentation
- **[SETUP.md](./SETUP.md)** - Setup instructions
- **[DESIGN_ARCHITECTURE.md](./DESIGN_ARCHITECTURE.md)** - Design system

---

## ✅ Summary

The two-step login process provides:
- ✅ Professional state-specific branding
- ✅ Clear visual state identification
- ✅ Improved user experience
- ✅ Foundation for state customization
- ✅ Scalable architecture for 37 states

**Status**: ✅ Complete and Ready
**Version**: 2.0.0
**Last Updated**: November 2024

---

## 🎉 Quick Start

1. **Navigate to**: `http://localhost:3000`
2. **Click**: "Staff Login" button
3. **Select**: Your state from dropdown
4. **Click**: "Continue to Login"
5. **See**: State-branded login page with coat of arms
6. **Enter**: Credentials and sign in
7. **View**: Dashboard with state indicator

**The enhanced two-step login is now live!** 🚀

