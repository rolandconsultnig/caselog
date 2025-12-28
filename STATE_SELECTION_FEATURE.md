# State Selection on Login Feature

## Overview
Users must now select their state from a dropdown before logging in. The selected state determines which state dashboard they access.

---

## 🎯 Feature Details

### Login Flow
1. User opens login page (`/auth/signin`)
2. Dropdown loads all available states (from database)
3. User selects their state
4. User enters email and password
5. Upon successful login, user is routed to dashboard for selected state
6. Selected state is displayed in the sidebar

---

## 📁 Files Created/Modified

### New Files
- **`app/api/tenants/route.ts`** - API endpoint to fetch all states/tenants

### Modified Files
- **`app/auth/signin/page.tsx`** - Added state dropdown and selection logic
- **`components/layout/DashboardLayout.tsx`** - Added selected state display in sidebar

---

## 🔧 Implementation Details

### 1. State Dropdown (`/auth/signin`)

#### Features:
- **Dynamic Loading**: States are fetched from the database via API
- **Federal Indicator**: Federal Ministry shows "(Federal)" label
- **Required Field**: Users must select a state before logging in
- **Loading State**: Shows "Loading states..." while fetching
- **Validation**: Form won't submit without state selection

#### UI Elements:
```typescript
<select id="state" required>
  <option value="">Select your state</option>
  <option value="state-id">State Name</option>
  <option value="federal-id">Federal Ministry (Federal)</option>
</select>
```

---

### 2. API Endpoint (`/api/tenants`)

#### Endpoint: `GET /api/tenants`

**Response Format:**
```json
[
  {
    "id": "uuid",
    "name": "Lagos State",
    "type": "STATE"
  },
  {
    "id": "uuid",
    "name": "Federal Ministry of Justice",
    "type": "FEDERAL"
  }
]
```

**Features:**
- Returns all tenants (states + federal)
- Sorted alphabetically by name
- Includes tenant type for UI differentiation

---

### 3. Session Storage

#### Stored Data:
```javascript
sessionStorage.setItem('selectedTenantId', 'uuid');
sessionStorage.setItem('selectedTenantName', 'State Name');
```

**Purpose:**
- Persist state selection across page reloads
- Display selected state in dashboard
- Enable state-specific filtering

---

### 4. Dashboard Display

#### Sidebar State Indicator:
- **Location**: Above logout button in sidebar
- **Design**: Green badge with map pin icon
- **Content**: 
  - Label: "Current State"
  - Value: Selected state name

#### Visual:
```
┌─────────────────────────┐
│  📍 Current State        │
│  Lagos State            │
└─────────────────────────┘
```

---

## 🎨 UI/UX Enhancements

### Login Page Updates

#### Form Order:
1. **State Selection** (dropdown with map pin icon)
2. **Email Address** (text input)
3. **Password** (password input)
4. **Sign In Button** (disabled until state selected)

#### Visual Indicators:
- Map pin icon next to "Select State" label
- Disabled state for dropdown while loading
- Success toast shows selected state name
- Form validation prevents submission without state

---

## 🔐 Security & Validation

### Client-Side Validation:
- ✅ State selection required
- ✅ Email format validation
- ✅ Password required
- ✅ Form disabled during submission

### Server-Side:
- ✅ Authentication still handled by NextAuth
- ✅ User permissions based on their actual tenant (not selected state)
- ✅ State selection is for UI routing only

---

## 📊 Available States

The dropdown includes all states from the database:

### Federal:
- Federal Ministry of Justice (Federal)

### States (36 + FCT):
- Abia State
- Adamawa State
- Akwa Ibom State
- Anambra State
- Bauchi State
- Bayelsa State
- Benue State
- Borno State
- Cross River State
- Delta State
- Ebonyi State
- Edo State
- Ekiti State
- Enugu State
- FCT (Federal Capital Territory)
- Gombe State
- Imo State
- Jigawa State
- Kaduna State
- Kano State
- Katsina State
- Kebbi State
- Kogi State
- Kwara State
- Lagos State
- Nasarawa State
- Niger State
- Ogun State
- Ondo State
- Osun State
- Oyo State
- Plateau State
- Rivers State
- Sokoto State
- Taraba State
- Yobe State
- Zamfara State

---

## 🚀 Usage Instructions

### For End Users:

1. **Navigate to Login Page**
   ```
   http://localhost:3000/auth/signin
   ```

2. **Select Your State**
   - Click the "Select State" dropdown
   - Choose your state from the list
   - Federal users select "Federal Ministry of Justice (Federal)"

3. **Enter Credentials**
   - Email: your.email@example.com
   - Password: your password

4. **Sign In**
   - Click "Sign In" button
   - You'll be routed to the dashboard
   - Selected state will be shown in sidebar

5. **View Selected State**
   - Look at the sidebar (above logout button)
   - Green badge shows your current state

---

## 🔄 State Switching

### Current Implementation:
- State is selected at login
- Persists throughout session
- Cleared on logout

### Future Enhancement (Planned):
- Add state switcher in dashboard
- Allow users to switch states without re-login
- Dropdown in header for quick switching

---

## 💡 Benefits

### For Users:
- ✅ Clear state context
- ✅ Prevents confusion about which state data they're viewing
- ✅ Visual confirmation of selected state
- ✅ Easy to verify correct state access

### For Administrators:
- ✅ Better audit trail (know which state user intended to access)
- ✅ Reduced support tickets about "wrong data"
- ✅ Clear state-based routing

### For Federal Users:
- ✅ Can select specific state to view
- ✅ Clear indication when viewing federal vs state data
- ✅ Flexible state access

---

## 🧪 Testing Checklist

### Login Page:
- [ ] Dropdown loads all states
- [ ] Federal state shows "(Federal)" label
- [ ] States are sorted alphabetically
- [ ] Cannot submit without selecting state
- [ ] Loading state shows while fetching
- [ ] Error handling if API fails
- [ ] Success toast shows selected state

### Dashboard:
- [ ] Selected state displays in sidebar
- [ ] State badge shows correct name
- [ ] State persists on page reload
- [ ] State clears on logout

### Edge Cases:
- [ ] No states in database (error handling)
- [ ] API timeout (error handling)
- [ ] Invalid state selection (validation)
- [ ] Session storage disabled (fallback)

---

## 🔧 Technical Notes

### Session Storage vs Database:
- **Session Storage**: Used for UI display only
- **Database**: User's actual tenant determines permissions
- **Security**: Selected state doesn't override user permissions

### Why Session Storage?
- ✅ Fast access (no API calls)
- ✅ Persists across page reloads
- ✅ Automatically cleared on logout
- ✅ Client-side only (no server load)

### API Caching:
- States list is fetched once on login page load
- Cached in component state
- No re-fetching on form submission

---

## 📈 Future Enhancements

### Planned Features:

1. **State Switcher in Dashboard**
   - Dropdown in header
   - Switch states without re-login
   - Remember last selected state

2. **Recent States**
   - Show recently accessed states
   - Quick access to frequently used states

3. **State-Specific Branding**
   - State logo in dashboard
   - State colors/theme
   - State-specific welcome message

4. **Multi-State Access**
   - Select multiple states at once
   - Compare data across states
   - Federal users: view all states simultaneously

5. **State Permissions**
   - Restrict state selection based on user permissions
   - Only show states user has access to
   - Federal users see all states

---

## 🐛 Troubleshooting

### Issue: Dropdown is empty
**Solution**: 
- Check database has tenant records
- Run `npx prisma db seed` to populate states
- Check API endpoint `/api/tenants` returns data

### Issue: Selected state doesn't show in dashboard
**Solution**:
- Check browser console for errors
- Verify session storage is enabled
- Clear browser cache and try again

### Issue: Can't submit form
**Solution**:
- Ensure state is selected
- Check all required fields are filled
- Look for validation errors

### Issue: Wrong state displays
**Solution**:
- Logout and login again
- Clear session storage
- Select correct state on login

---

## 📚 Related Documentation

- **[README.md](./README.md)** - Main documentation
- **[SETUP.md](./SETUP.md)** - Setup instructions
- **[API.md](./API.md)** - API reference
- **[LATEST_UPDATES.md](./LATEST_UPDATES.md)** - Recent updates

---

## ✅ Summary

The state selection feature provides:
- ✅ Clear state context for users
- ✅ Better user experience
- ✅ Reduced confusion about data access
- ✅ Visual confirmation of selected state
- ✅ Foundation for future multi-state features

**Status**: ✅ Complete and Ready
**Version**: 1.0.0
**Last Updated**: November 2024

