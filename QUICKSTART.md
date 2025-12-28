# Quick Start Guide - CaseLogPro2

Get up and running with CaseLogPro2 in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ PostgreSQL 14+ installed (`psql --version`)
- ✅ Git installed (optional)

## 5-Minute Setup

### Step 1: Get the Code (30 seconds)

```bash
# If using Git
git clone <repository-url>
cd CaselogPro2

# OR if you have a zip file
unzip CaselogPro2.zip
cd CaselogPro2
```

### Step 2: Install Dependencies (2 minutes)

```bash
npm install
```

### Step 3: Set Up Database (1 minute)

```bash
# Create database
psql -U postgres -c "CREATE DATABASE caselogpro2;"
psql -U postgres -c "CREATE USER caselogpro_user WITH ENCRYPTED PASSWORD 'SecurePass123';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE caselogpro2 TO caselogpro_user;"
```

### Step 4: Configure Environment (30 seconds)

```bash
# Copy environment file
cp .env.example .env

# Generate secret key
openssl rand -base64 32
```

Edit `.env` file:
```env
DATABASE_URL="postgresql://caselogpro_user:SecurePass123@localhost:5432/caselogpro2?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<paste-generated-secret-here>"
NODE_ENV="development"
```

### Step 5: Initialize Database (1 minute)

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### Step 6: Start the Application (10 seconds)

```bash
npm run dev
```

## 🎉 You're Ready!

Open your browser: **http://localhost:3000**

## Quick Login

Try these demo accounts:

### Federal Ministry (Can see all states)
```
Email: federal.level2@moj.gov.ng
Password: Password123!
```

### Lagos State
```
Email: lagos.level2@justice.lg.gov.ng
Password: Password123!
```

### FCT (Abuja)
```
Email: fct.level2@justice.gov.ng
Password: Password123!
```

## Quick Test

1. **Login** with any Level 2+ account
2. Click **"Create New Case"**
3. Fill in the form:
   - Form of SGBV: Rape
   - Victim Name: Test Victim
   - Victim Age: 25
   - Perpetrator Name: Test Perpetrator
   - Offence Name: Rape
   - Nature of Offence: Test description
4. Click **"Save Case"**
5. View your case in the **Cases** list

## All Access Levels

| Level | Email Pattern | Capabilities |
|-------|--------------|--------------|
| Level 1 | `*.level1@*` | Read only |
| Level 2 | `*.level2@*` | Create cases |
| Level 3 | `*.level3@*` | Approve/reject |
| Level 4 | `*.level4@*` | Request deletion |
| Level 5 | `*.level5@*` | Approve deletion |
| Super Admin | `*.superadmin@*` | Full access |

Replace `*` with `federal`, `lagos`, or `fct`

## Common Commands

```bash
# Start development server
npm run dev

# View database in browser
npm run db:studio

# Reset database
npm run db:push
npm run db:seed

# Check for errors
npm run lint
```

## Troubleshooting

### Can't connect to database?
```bash
# Check PostgreSQL is running
# Windows: Check Services
# macOS/Linux:
sudo systemctl status postgresql
```

### Port 3000 in use?
```bash
# Use different port
PORT=3001 npm run dev
```

### Module not found?
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- 📖 Read the full [README.md](./README.md)
- 🔧 Check [SETUP.md](./SETUP.md) for detailed setup
- 🚀 See [DEPLOYMENT.md](./DEPLOYMENT.md) for production
- 📚 Review [API.md](./API.md) for API docs

## Need Help?

1. Check error messages in terminal
2. Review [SETUP.md](./SETUP.md) for detailed instructions
3. Verify all environment variables are set
4. Ensure PostgreSQL is running
5. Try restarting the dev server

---

**Happy case managing! 🎯**

