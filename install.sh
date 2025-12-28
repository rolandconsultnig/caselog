#!/bin/bash

# CaseLogPro2 Installation Script
# This script automates the setup process for Unix-based systems (macOS/Linux)

set -e  # Exit on error

echo "=========================================="
echo "CaseLogPro2 Installation Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version) found${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}✗ PostgreSQL is not installed${NC}"
    echo "Please install PostgreSQL 14+ from https://www.postgresql.org/"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL $(psql --version | awk '{print $3}') found${NC}"

echo ""
echo "Step 1: Installing dependencies..."
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""
echo "Step 2: Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    
    # Generate NEXTAUTH_SECRET
    SECRET=$(openssl rand -base64 32)
    
    # Update .env file (macOS compatible)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|NEXTAUTH_SECRET=\"your-secret-key-here-generate-with-openssl-rand-base64-32\"|NEXTAUTH_SECRET=\"$SECRET\"|g" .env
    else
        sed -i "s|NEXTAUTH_SECRET=\"your-secret-key-here-generate-with-openssl-rand-base64-32\"|NEXTAUTH_SECRET=\"$SECRET\"|g" .env
    fi
    
    echo -e "${GREEN}✓ NEXTAUTH_SECRET generated${NC}"
else
    echo -e "${YELLOW}⚠ .env file already exists, skipping...${NC}"
fi

echo ""
echo "Step 3: Setting up database..."
echo "Please enter your PostgreSQL password when prompted."
echo ""

# Database credentials
DB_NAME="caselogpro2"
DB_USER="caselogpro_user"
DB_PASS="CaseLogPro2024!"

# Create database and user
psql -U postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database already exists"
psql -U postgres -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';" 2>/dev/null || echo "User already exists"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null

# Update DATABASE_URL in .env
DB_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME?schema=public"
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|DATABASE_URL=\".*\"|DATABASE_URL=\"$DB_URL\"|g" .env
else
    sed -i "s|DATABASE_URL=\".*\"|DATABASE_URL=\"$DB_URL\"|g" .env
fi

echo -e "${GREEN}✓ Database created${NC}"

echo ""
echo "Step 4: Initializing database schema..."
npm run db:generate
npm run db:push
echo -e "${GREEN}✓ Database schema created${NC}"

echo ""
echo "Step 5: Seeding database with Nigerian states..."
npm run db:seed
echo -e "${GREEN}✓ Database seeded${NC}"

echo ""
echo "=========================================="
echo -e "${GREEN}Installation Complete! 🎉${NC}"
echo "=========================================="
echo ""
echo "To start the application, run:"
echo -e "${YELLOW}  npm run dev${NC}"
echo ""
echo "Then open your browser to:"
echo -e "${YELLOW}  http://localhost:3000${NC}"
echo ""
echo "Demo Login Credentials:"
echo "  Email: federal.level2@moj.gov.ng"
echo "  Password: Password123!"
echo ""
echo "For more information, see:"
echo "  - README.md for full documentation"
echo "  - QUICKSTART.md for quick start guide"
echo "  - SETUP.md for detailed setup instructions"
echo ""

