@echo off
REM CaseLogPro2 Installation Script for Windows
REM This script automates the setup process

echo ==========================================
echo CaseLogPro2 Installation Script
echo ==========================================
echo.

REM Check if Node.js is installed
echo Checking prerequisites...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found
node --version

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] PostgreSQL is not installed
    echo Please install PostgreSQL 14+ from https://www.postgresql.org/
    pause
    exit /b 1
)
echo [OK] PostgreSQL found
psql --version

echo.
echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed

echo.
echo Step 2: Setting up environment...
if not exist .env (
    copy .env.example .env
    echo [OK] .env file created
    echo.
    echo IMPORTANT: You need to update .env file with:
    echo 1. Generate NEXTAUTH_SECRET by running:
    echo    node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
    echo 2. Update DATABASE_URL with your PostgreSQL credentials
    echo.
    pause
) else (
    echo [WARNING] .env file already exists, skipping...
)

echo.
echo Step 3: Setting up database...
echo Please ensure PostgreSQL is running and you have the password ready.
echo.
echo Creating database and user...
echo You will be prompted for the PostgreSQL password.
echo.

REM Database credentials
set DB_NAME=caselogpro2
set DB_USER=caselogpro_user
set DB_PASS=CaseLogPro2024!

REM Create database
psql -U postgres -c "CREATE DATABASE %DB_NAME%;" 2>nul
psql -U postgres -c "CREATE USER %DB_USER% WITH ENCRYPTED PASSWORD '%DB_PASS%';" 2>nul
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE %DB_NAME% TO %DB_USER%;" 2>nul

echo [OK] Database setup complete

echo.
echo Step 4: Initializing database schema...
call npm run db:generate
if errorlevel 1 (
    echo [ERROR] Failed to generate Prisma client
    pause
    exit /b 1
)

call npm run db:push
if errorlevel 1 (
    echo [ERROR] Failed to push database schema
    pause
    exit /b 1
)
echo [OK] Database schema created

echo.
echo Step 5: Seeding database with Nigerian states...
call npm run db:seed
if errorlevel 1 (
    echo [ERROR] Failed to seed database
    pause
    exit /b 1
)
echo [OK] Database seeded

echo.
echo ==========================================
echo Installation Complete!
echo ==========================================
echo.
echo To start the application, run:
echo   npm run dev
echo.
echo Then open your browser to:
echo   http://localhost:3000
echo.
echo Demo Login Credentials:
echo   Email: federal.level2@moj.gov.ng
echo   Password: Password123!
echo.
echo For more information, see:
echo   - README.md for full documentation
echo   - QUICKSTART.md for quick start guide
echo   - SETUP.md for detailed setup instructions
echo.
pause

