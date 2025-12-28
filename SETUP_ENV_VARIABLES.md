# Environment Variables Setup Instructions

## ✅ Database Migration Complete

The database migration has been successfully completed. The following models have been added:
- `SearchHistory` - Stores user search history
- `SavedSearch` - Stores user saved searches

---

## 📝 Environment Variables Configuration

Your `.env` file exists. Please add or update the following variables:

### Email Service Configuration

Add these lines to your `.env` file:

```env
# Email Service Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_SECURE=false
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@yourdomain.com
```

**For Gmail Setup:**
1. Enable 2-Step Verification on your Google Account
2. Go to Google Account → Security → 2-Step Verification → App passwords
3. Generate an App Password for "Mail"
4. Use the generated password in `EMAIL_SERVER_PASSWORD`

**For Other SMTP Providers:**
- Outlook: `smtp-mail.outlook.com`, port `587`
- Yahoo: `smtp.mail.yahoo.com`, port `587`
- Custom: Use your provider's SMTP settings

---

### SMS Service Configuration (Twilio)

Add these lines to your `.env` file:

```env
# SMS Service Configuration (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

**Twilio Setup:**
1. Sign up at https://www.twilio.com
2. Get Account SID and Auth Token from Twilio Console
3. Purchase a phone number or use trial number
4. Format phone number as E.164: `+1234567890`

---

## 🔍 How to Check Current Configuration

Run this command to see if email/SMS variables are already set:

```powershell
Get-Content .env | Select-String -Pattern "EMAIL|TWILIO"
```

---

## ⚠️ Important Notes

1. **Optional Configuration**: Both email and SMS services are optional. The system will work without them, but will log notifications to console instead of sending.

2. **Security**: Never commit your `.env` file to version control. It's already in `.gitignore`.

3. **Restart Required**: After updating `.env`, restart your development server:
   ```bash
   npm run dev
   ```

---

## ✅ Verification

After configuring:

1. **Email**: Create a new case or trigger an email notification. Check console for:
   - ✅ `Email sent to [email]` - Success
   - ⚠️ `Email service not fully configured` - Missing variables

2. **SMS**: Send an SMS via the API. Check console for:
   - ✅ `SMS sent to [phone]` - Success
   - ⚠️ `SMS service not configured` - Missing variables

---

## 📚 Full Documentation

See `ENVIRONMENT_SETUP.md` for complete setup instructions and troubleshooting.

---

## 🎯 Quick Copy-Paste Template

Add this to your `.env` file:

```env
# ============================================
# EMAIL SERVICE CONFIGURATION
# ============================================
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_SECURE=false
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password-here
EMAIL_FROM=noreply@yourdomain.com

# ============================================
# SMS SERVICE CONFIGURATION (TWILIO)
# ============================================
TWILIO_ACCOUNT_SID=your-twilio-account-sid-here
TWILIO_AUTH_TOKEN=your-twilio-auth-token-here
TWILIO_PHONE_NUMBER=+1234567890
```

Replace the placeholder values with your actual credentials.

