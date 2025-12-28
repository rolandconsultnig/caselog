# Setup Guide - CaseLogPro2

Quick start guide to get CaseLogPro2 running on your local machine.

## System Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **Node.js**: Version 18.0 or higher
- **PostgreSQL**: Version 14.0 or higher
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 2GB free space

## Step-by-Step Installation

### 1. Install Prerequisites

#### Install Node.js

**Windows:**
- Download from https://nodejs.org/
- Run installer and follow prompts

**macOS:**
```bash
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify installation:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

#### Install PostgreSQL

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Run installer (remember the password you set!)

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Verify installation:
```bash
psql --version  # Should show PostgreSQL 14.x or higher
```

### 2. Set Up Database

#### Create Database

**Windows/macOS/Linux:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql prompt:
CREATE DATABASE caselogpro2;
CREATE USER caselogpro_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE caselogpro2 TO caselogpro_user;
\q
```

### 3. Clone and Install Application

```bash
# Navigate to your projects directory
cd /path/to/your/projects

# Clone the repository (or unzip if provided as archive)
git clone <repository-url>
# OR
# unzip CaselogPro2.zip

# Navigate into project
cd CaselogPro2

# Install dependencies
npm install
```

This will take 2-5 minutes depending on your internet speed.

### 4. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit the .env file
# Windows: notepad .env
# macOS/Linux: nano .env
```

Update the following values in `.env`:

```env
# Database connection
DATABASE_URL="postgresql://caselogpro_user:your_secure_password@localhost:5432/caselogpro2?schema=public"

# NextAuth configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-this-using-command-below"

# Application
NODE_ENV="development"
```

Generate `NEXTAUTH_SECRET`:
```bash
# Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# macOS/Linux:
openssl rand -base64 32
```

Copy the generated value and paste it as `NEXTAUTH_SECRET` in your `.env` file.

### 5. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database with Nigerian states and demo users
npm run db:seed
```

You should see output confirming:
- ✅ Created 37 tenants (36 states + FCT + Federal)
- ✅ Created demo users for Federal, Lagos, and FCT

### 6. Start Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in 2.5s
```

### 7. Access the Application

Open your browser and navigate to: **http://localhost:3000**

You'll be redirected to the login page.

## Demo Login Credentials

### Federal Ministry of Justice

| Role | Email | Access Level |
|------|-------|--------------|
| Super Admin | federal.superadmin@moj.gov.ng | Full system access |
| App Admin | federal.appadmin@moj.gov.ng | Application admin |
| Level 5 | federal.level5@moj.gov.ng | Full approval authority |
| Level 4 | federal.level4@moj.gov.ng | Delete requester |
| Level 3 | federal.level3@moj.gov.ng | Approver |
| Level 2 | federal.level2@moj.gov.ng | Case creator |
| Level 1 | federal.level1@moj.gov.ng | Read only |

### Lagos State

| Role | Email | Access Level |
|------|-------|--------------|
| Super Admin | lagos.superadmin@justice.lg.gov.ng | State admin |
| Level 5 | lagos.level5@justice.lg.gov.ng | Full approval authority |
| Level 4 | lagos.level4@justice.lg.gov.ng | Delete requester |
| Level 3 | lagos.level3@justice.lg.gov.ng | Approver |
| Level 2 | lagos.level2@justice.lg.gov.ng | Case creator |
| Level 1 | lagos.level1@justice.lg.gov.ng | Read only |

### FCT (Abuja)

| Role | Email | Access Level |
|------|-------|--------------|
| Super Admin | fct.superadmin@justice.gov.ng | FCT admin |
| Level 1-5 | fct.level1@justice.gov.ng to fct.level5@justice.gov.ng | Various levels |

**Default Password for ALL users:** `Password123!`

⚠️ **Important:** Change these passwords immediately in production!

## Testing the Application

### 1. Login as Federal Level 2 User

- Email: `federal.level2@moj.gov.ng`
- Password: `Password123!`

### 2. Create a Test Case

1. Click "Create New Case" in the sidebar
2. Fill in the form:
   - Form of SGBV: Select "Rape"
   - Victim Name: "Test Victim"
   - Victim Age: 25
   - Victim Gender: Female
   - Perpetrator Name: "Test Perpetrator"
   - Offence Name: "Rape"
   - Nature of Offence: "Test description"
3. Click "Save Case"

### 3. Approve the Case (as Level 3 User)

1. Logout (click your name → Sign Out)
2. Login as: `federal.level3@moj.gov.ng`
3. Go to "Cases" in sidebar
4. Click "View" on your test case
5. Click "Approve" button

### 4. View Statistics

1. Click "Statistics" in sidebar
2. View case breakdown by type and status

### 5. Test Federal Oversight

1. Login as Federal Super Admin: `federal.superadmin@moj.gov.ng`
2. Dashboard shows cases from all states
3. Can view and manage cases across all states

## Common Issues and Solutions

### Issue: Database Connection Error

**Error:** `Can't reach database server`

**Solution:**
1. Check PostgreSQL is running:
   ```bash
   # Windows: Check Services
   # macOS/Linux:
   sudo systemctl status postgresql
   ```
2. Verify DATABASE_URL in `.env` is correct
3. Test connection:
   ```bash
   psql -U caselogpro_user -d caselogpro2
   ```

### Issue: Port 3000 Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Or use different port:
PORT=3001 npm run dev
```

### Issue: Prisma Client Not Generated

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
npm run db:generate
```

### Issue: Module Not Found

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database Schema Out of Sync

**Error:** `Database schema is not in sync`

**Solution:**
```bash
npm run db:push
```

## Next Steps

1. **Explore Features:**
   - Create cases with different SGBV types
   - Test approval workflow
   - Request case deletion
   - View statistics

2. **Customize:**
   - Add your organization's branding
   - Configure email notifications
   - Integrate biometric devices

3. **Production Deployment:**
   - Read [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Set up production database
   - Configure SSL/HTTPS
   - Set up backups

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database
npm run db:seed
```

## Project Structure

```
CaselogPro2/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication config
│   ├── permissions.ts    # Authorization logic
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── public/               # Static files
├── types/                # TypeScript type definitions
├── .env                  # Environment variables (create this)
├── .env.example          # Example environment file
├── package.json          # Dependencies
├── README.md             # Main documentation
├── SETUP.md              # This file
└── DEPLOYMENT.md         # Deployment guide
```

## Getting Help

If you encounter issues:

1. Check this guide's "Common Issues" section
2. Review error messages carefully
3. Check the console/terminal for detailed errors
4. Verify all environment variables are set correctly
5. Ensure PostgreSQL is running
6. Try restarting the development server

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Ready to start?** Follow the steps above and you'll be up and running in 15-20 minutes!

