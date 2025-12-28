# Environment Variables Setup Guide

This document explains how to configure environment variables for the SGBV Case Management System.

---

## 📋 Required Environment Variables

### 1. Database Configuration

```env
DATABASE_URL="postgresql://user:password@localhost:5456/caselog?schema=public"
```

**Description**: PostgreSQL database connection string  
**Format**: `postgresql://[user]:[password]@[host]:[port]/[database]?schema=public`

---

### 2. NextAuth Configuration

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here
```

**Description**:
- `NEXTAUTH_URL`: The canonical URL of your site (use your production URL in production)
- `NEXTAUTH_SECRET`: A random secret key used to encrypt tokens (generate with `openssl rand -base64 32`)

---

### 3. Email Service Configuration

The system uses Nodemailer for sending email notifications. Configure these variables to enable email functionality:

```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_SECURE=false
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@yourdomain.com
```

#### Gmail Setup:
1. Enable 2-Step Verification on your Google Account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Enter "SGBV System" and generate
   - Use the generated password in `EMAIL_SERVER_PASSWORD`

#### Other SMTP Providers:
- **Outlook/Hotmail**: `smtp-mail.outlook.com`, port `587`
- **Yahoo**: `smtp.mail.yahoo.com`, port `587`
- **Custom SMTP**: Use your provider's SMTP settings

**Note**: If email variables are not configured, the system will log email content to console instead of sending.

---

### 4. SMS Service Configuration (Twilio)

The system uses Twilio for sending SMS notifications. Configure these variables to enable SMS functionality:

```env
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Twilio Setup:
1. Sign up for a Twilio account at https://www.twilio.com
2. Get your Account SID and Auth Token from the Twilio Console
3. Purchase a phone number or use a trial number
4. Add the phone number in E.164 format (e.g., `+1234567890`)

**Note**: If SMS variables are not configured, the system will log SMS content to console instead of sending.

---

## 🚀 Quick Setup

### Step 1: Copy the example file
```bash
cp .env.example .env
```

### Step 2: Edit `.env` file
Open `.env` in your text editor and fill in the values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5456/caselog?schema=public"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Email (Optional - system works without it)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_SECURE=false
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# SMS (Optional - system works without it)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 3: Generate NextAuth Secret
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## ✅ Verification

### Test Email Configuration
The system will automatically test email configuration when sending the first email. Check the console logs for:
- ✅ `Email sent to [email]` - Configuration successful
- ⚠️ `Email service not fully configured` - Missing variables (emails logged to console)

### Test SMS Configuration
The system will automatically test SMS configuration when sending the first SMS. Check the console logs for:
- ✅ `SMS sent to [phone]` - Configuration successful
- ⚠️ `SMS service not configured` - Missing variables (SMS logged to console)

---

## 🔒 Security Best Practices

1. **Never commit `.env` to version control**
   - `.env` is already in `.gitignore`
   - Use `.env.example` for documentation

2. **Use strong secrets**
   - Generate random strings for `NEXTAUTH_SECRET`
   - Use app-specific passwords for email

3. **Rotate credentials regularly**
   - Change passwords periodically
   - Update secrets after security incidents

4. **Use environment-specific files**
   - `.env.local` for local development
   - `.env.production` for production (set via hosting platform)

---

## 📧 Email Templates Available

The system includes these email templates:
- `caseCreated` - New case notification
- `caseAssigned` - Case assignment notification
- `caseStatusChanged` - Status update notification
- `documentUploaded` - Document upload notification
- `passwordReset` - Password reset link
- `notification` - General notification

---

## 📱 SMS Templates Available

The system includes these SMS templates:
- `caseCreated` - New case notification
- `caseAssigned` - Case assignment notification
- `caseStatusChanged` - Status update notification
- `appointmentReminder` - Appointment reminder
- `passwordReset` - Password reset code
- `emergencyAlert` - Emergency alert
- `courtHearing` - Court hearing notification
- `evidenceCollected` - Evidence collection notification
- `verdictReached` - Verdict notification

---

## 🆘 Troubleshooting

### Email Not Sending
1. Check SMTP credentials are correct
2. Verify firewall allows SMTP port (587)
3. For Gmail, ensure App Password is used (not regular password)
4. Check spam folder

### SMS Not Sending
1. Verify Twilio credentials are correct
2. Check phone number format (must be E.164: +1234567890)
3. Verify Twilio account has credits
4. Check Twilio console for error messages

### Database Connection Issues
1. Verify PostgreSQL is running
2. Check DATABASE_URL format
3. Verify user has database access
4. Check firewall allows database port

---

## 📚 Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/about/)
- [Twilio Documentation](https://www.twilio.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)

