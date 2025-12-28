# CaseLogPro2 - Complete File Structure

This document provides a complete overview of all files in the project.

## 📁 Root Directory

```
CaselogPro2/
├── 📄 package.json                 # Project dependencies and scripts
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 next.config.js               # Next.js configuration
├── 📄 tailwind.config.js           # Tailwind CSS configuration
├── 📄 postcss.config.js            # PostCSS configuration
├── 📄 middleware.ts                # Next.js middleware for route protection
├── 📄 .gitignore                   # Git ignore rules
├── 📄 .env.example                 # Environment variables template
└── 📄 .env                         # Environment variables (create from .env.example)
```

## 📚 Documentation Files

```
├── 📖 README.md                    # Main project documentation
├── 📖 QUICKSTART.md                # 5-minute quick start guide
├── 📖 SETUP.md                     # Detailed setup instructions
├── 📖 DEPLOYMENT.md                # Production deployment guide
├── 📖 API.md                       # Complete API documentation
├── 📖 CONTRIBUTING.md              # Contribution guidelines
├── 📖 PROJECT_SUMMARY.md           # Project overview and achievements
└── 📖 FILE_STRUCTURE.md            # This file
```

## 🔧 Installation Scripts

```
├── 📜 install.sh                   # Automated setup script (Unix/macOS/Linux)
└── 📜 install.bat                  # Automated setup script (Windows)
```

## 🎨 Application Directory (`app/`)

### Root Level
```
app/
├── 📄 layout.tsx                   # Root layout component
├── 📄 page.tsx                     # Home page (redirects to dashboard)
└── 📄 globals.css                  # Global CSS styles
```

### Authentication (`app/auth/`)
```
app/auth/
├── signin/
│   └── 📄 page.tsx                 # Login page
└── error/
    └── 📄 page.tsx                 # Authentication error page
```

### Dashboard (`app/dashboard/`)
```
app/dashboard/
├── 📄 page.tsx                     # Main dashboard with statistics
├── cases/
│   ├── 📄 page.tsx                 # Cases list page
│   ├── new/
│   │   └── 📄 page.tsx             # Create new case form
│   └── [id]/
│       └── 📄 page.tsx             # Case detail page
├── deletion-requests/
│   └── 📄 page.tsx                 # Deletion requests management
├── statistics/
│   └── 📄 page.tsx                 # Statistics and analytics page
└── admin/
    └── 📄 page.tsx                 # Admin panel
```

### API Routes (`app/api/`)

#### Authentication
```
app/api/auth/
└── [...nextauth]/
    └── 📄 route.ts                 # NextAuth.js authentication handler
```

#### Cases
```
app/api/cases/
├── 📄 route.ts                     # GET (list), POST (create)
└── [id]/
    ├── 📄 route.ts                 # GET (detail), PATCH (update), DELETE
    ├── approve/
    │   └── 📄 route.ts             # POST (approve case)
    └── reject/
        └── 📄 route.ts             # POST (reject case)
```

#### Deletion Requests
```
app/api/deletion-requests/
├── 📄 route.ts                     # GET (list), POST (create)
└── [id]/
    └── approve/
        └── 📄 route.ts             # POST (approve deletion)
```

#### Statistics
```
app/api/statistics/
└── 📄 route.ts                     # GET (dashboard statistics)
```

## 🧩 Components (`components/`)

### Layout Components
```
components/layout/
└── 📄 DashboardLayout.tsx          # Main dashboard layout with sidebar
```

### UI Components
```
components/ui/
├── 📄 Button.tsx                   # Reusable button component
├── 📄 Card.tsx                     # Card component with variants
├── 📄 Badge.tsx                    # Badge component for status
└── 📄 Table.tsx                    # Table components
```

### Providers
```
components/
└── 📄 Providers.tsx                # App-level providers (Auth, Query)
```

## 📚 Library Files (`lib/`)

```
lib/
├── 📄 auth.ts                      # NextAuth.js configuration
├── 📄 permissions.ts               # Authorization and permission logic
├── 📄 prisma.ts                    # Prisma database client
├── 📄 utils.ts                     # Utility helper functions
├── 📄 validations.ts               # Zod validation schemas
└── 📄 biometric.ts                 # Biometric integration placeholders
```

## 🗄️ Database (`prisma/`)

```
prisma/
├── 📄 schema.prisma                # Database schema (20 models, 10 enums)
└── 📄 seed.ts                      # Database seed script (37 tenants)
```

### Database Models (20)
1. Tenant
2. User
3. Case
4. Victim
5. DeceasedVictim
6. Perpetrator
7. LegalGuardian
8. InvestigatingOfficer
9. Witness
10. Evidence
11. Offence
12. CourtRecord
13. Prosecutor
14. Judgement
15. DeletionRequest
16. AuditLog

## 📝 Type Definitions (`types/`)

```
types/
└── 📄 next-auth.d.ts               # NextAuth.js type extensions
```

## 📦 Package Information

### Main Dependencies
- **next**: ^14.2.0 - React framework
- **react**: ^18.3.0 - UI library
- **@prisma/client**: ^5.18.0 - Database ORM
- **next-auth**: ^4.24.7 - Authentication
- **@tanstack/react-query**: ^5.51.1 - Data fetching
- **zod**: ^3.23.8 - Validation
- **tailwindcss**: ^3.4.6 - CSS framework
- **typescript**: ^5.5.3 - Type safety

### Dev Dependencies
- **prisma**: ^5.18.0 - Database toolkit
- **eslint**: ^8.57.0 - Code linting
- **ts-node**: ^10.9.2 - TypeScript execution

## 🎯 Key Features by File

### Authentication & Authorization
- `lib/auth.ts` - Authentication configuration
- `lib/permissions.ts` - Permission logic
- `middleware.ts` - Route protection
- `app/api/auth/[...nextauth]/route.ts` - Auth endpoints

### Case Management
- `app/dashboard/cases/page.tsx` - Case listing
- `app/dashboard/cases/new/page.tsx` - Case creation
- `app/dashboard/cases/[id]/page.tsx` - Case details
- `app/api/cases/route.ts` - Case CRUD operations

### Approval Workflow
- `app/api/cases/[id]/approve/route.ts` - Case approval
- `app/api/cases/[id]/reject/route.ts` - Case rejection

### Deletion Workflow
- `app/dashboard/deletion-requests/page.tsx` - Request management
- `app/api/deletion-requests/route.ts` - Request CRUD
- `app/api/deletion-requests/[id]/approve/route.ts` - Approval

### Statistics & Reporting
- `app/dashboard/page.tsx` - Main dashboard
- `app/dashboard/statistics/page.tsx` - Detailed statistics
- `app/api/statistics/route.ts` - Statistics API

### Administration
- `app/dashboard/admin/page.tsx` - Admin panel
- `prisma/seed.ts` - Database seeding

### Biometric Integration
- `lib/biometric.ts` - Biometric functions (placeholders)
- `prisma/schema.prisma` - Biometric ID fields

## 📊 File Statistics

### Total Files: 60+

**By Type:**
- TypeScript/TSX: 35 files
- Documentation: 8 files
- Configuration: 6 files
- Database: 2 files
- Scripts: 2 files
- CSS: 1 file

**By Category:**
- API Routes: 8 files
- Pages: 9 files
- Components: 6 files
- Library: 6 files
- Documentation: 8 files
- Configuration: 6 files
- Database: 2 files
- Other: 15 files

## 🔍 Finding Specific Functionality

### Authentication
- Configuration: `lib/auth.ts`
- Login page: `app/auth/signin/page.tsx`
- API: `app/api/auth/[...nextauth]/route.ts`
- Middleware: `middleware.ts`

### Authorization
- Permission logic: `lib/permissions.ts`
- Used in: All API routes and dashboard pages

### Case Management
- List: `app/dashboard/cases/page.tsx`
- Create: `app/dashboard/cases/new/page.tsx`
- Detail: `app/dashboard/cases/[id]/page.tsx`
- API: `app/api/cases/`

### Database
- Schema: `prisma/schema.prisma`
- Client: `lib/prisma.ts`
- Seed: `prisma/seed.ts`

### UI Components
- Location: `components/ui/`
- Layout: `components/layout/DashboardLayout.tsx`

### Utilities
- General: `lib/utils.ts`
- Validation: `lib/validations.ts`
- Biometric: `lib/biometric.ts`

## 🚀 Build Output (Generated)

When you run `npm run build`, Next.js generates:

```
.next/                              # Build output (not in repository)
├── cache/                          # Build cache
├── server/                         # Server-side code
├── static/                         # Static assets
└── types/                          # Generated types
```

## 📦 Node Modules (Generated)

```
node_modules/                       # Dependencies (not in repository)
└── [1000+ packages]                # Installed via npm install
```

## 🔒 Git Ignored Files

The following are not tracked in Git:
- `.env` - Environment variables
- `node_modules/` - Dependencies
- `.next/` - Build output
- `*.log` - Log files
- `.DS_Store` - macOS files

## 📝 Notes

1. **Environment File**: Always create `.env` from `.env.example`
2. **Database Files**: Prisma generates client code in `node_modules/@prisma/client`
3. **Build Files**: `.next/` directory is generated on build
4. **Type Safety**: All TypeScript files have corresponding `.d.ts` types

## 🔄 File Dependencies

### High-Level Flow
```
User Request
    ↓
middleware.ts (Auth check)
    ↓
app/dashboard/*/page.tsx (UI)
    ↓
app/api/*/route.ts (API)
    ↓
lib/permissions.ts (Authorization)
    ↓
lib/prisma.ts (Database)
    ↓
prisma/schema.prisma (Schema)
```

## 📚 Documentation Hierarchy

1. **QUICKSTART.md** - Start here (5 minutes)
2. **README.md** - Overview and features
3. **SETUP.md** - Detailed setup
4. **API.md** - API reference
5. **DEPLOYMENT.md** - Production deployment
6. **CONTRIBUTING.md** - Development guidelines
7. **PROJECT_SUMMARY.md** - Complete overview
8. **FILE_STRUCTURE.md** - This file

---

**Total Lines of Code**: ~15,000+
**Total Characters**: ~500,000+
**Languages**: TypeScript, CSS, Markdown
**Frameworks**: Next.js 14, React 18, Prisma 5

---

Last Updated: November 2024

