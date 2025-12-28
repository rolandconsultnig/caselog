# CaseLogPro2 - Federated SGBV Case Management System

A comprehensive federated application for managing Sexual and Gender-Based Violence (SGBV) cases across Nigerian States with Federal Ministry of Justice oversight.

## 🎯 Overview

CaseLogPro2 is a multi-tenant case management system designed specifically for the Nigerian justice system. Each of the 36 states and FCT has their own standalone application instance, while the Federal Ministry of Justice maintains overall control and visibility across all states.

## ✨ Key Features

### Multi-Tenant Architecture
- **37 Tenants**: 36 Nigerian States + FCT + Federal Ministry of Justice
- **State Autonomy**: Each state manages their own cases independently
- **Federal Oversight**: Federal Ministry can view and query data from all states

### Role-Based Access Control (7 Levels)

#### State/Federal Levels:
1. **Level 1 (Read Only)**: View cases only
2. **Level 2 (Case Creator)**: Create new cases
3. **Level 3 (Approver)**: Approve or reject cases
4. **Level 4 (Delete Requester)**: Request case deletion (requires Level 5 approval)
5. **Level 5 (Full Authority)**: Approve deletion requests and full case management
6. **Super Admin**: Backend administrative dashboard with user management
7. **App Admin**: Application-level administration

### Comprehensive Case Management

#### Victim Details
- Personal information (name, age, gender, contact)
- Education, occupation, marital status
- Biometric data integration (fingerprint/face recognition)

#### Perpetrator/Suspect Details
- Complete personal information
- Criminal history tracking
- Relationship to victim
- Biometric data integration

#### Case Documentation
- Multiple forms of SGBV (Rape, Trafficking, Domestic Violence, etc.)
- Legal service types (Mediation, Prosecution, Counselling, etc.)
- Evidence management (Forensic, Electronic, Written statements)
- Witness information and statements
- Investigating officer details
- Court records and judgements

#### Offence Tracking
- Offence details with applicable laws and penalties
- Pre-populated Nigerian SGBV laws (VAPPA, CRA, Penal Code, etc.)
- Investigation status and timeline
- Arrest and bail information

### Phase 2: Extended Features ✨

#### Evidence Chain of Custody
- Complete transfer history tracking
- Custodian management with badge numbers
- Legal compliance verification
- Tamper detection and seal integrity
- Digital signatures and documentation

#### Witness Management
- Comprehensive witness profiles (50+ fields)
- Multiple witness types (Eyewitness, Character, Expert, Hearsay)
- Statement recording (text, audio, video)
- Credibility assessment and risk evaluation
- Protection measures and threat tracking
- Court testimony scheduling

#### Legal Charge Tracking
- Multiple charges per case
- Plea bargain management
- Trial information and scheduling
- Verdict and sentence recording
- Appeal tracking
- Evidence and witness linking

#### Document Management
- Secure file uploads (medical reports, forensic reports, photos, videos, audio)
- Virus scanning and encryption
- Access level controls (Public, Internal, Restricted, Confidential)
- Version control and usage tracking
- Multiple storage providers (Local, S3, Azure, Google Cloud)

### Phase 3: Advanced Features ✨

#### Service Referrals
- Multiple service types (Medical, Psychological, Legal, Shelter, Financial, etc.)
- Provider management (Government, NGO, Private, Individual)
- Appointment scheduling and tracking
- Service delivery monitoring
- Cost tracking and payment status
- Outcome measurement and satisfaction ratings

#### NGO Partnerships
- NGO information and contact management
- Referral tracking and services requested
- Support duration and frequency
- Progress reporting (JSON-based)
- Milestone tracking
- Final report submission and satisfaction ratings

#### Team Communication
- Real-time messaging system
- File attachments support
- Read receipts and message reactions
- Threaded discussions
- Pinned messages
- Message editing and soft delete

### System Statistics
- **Total Models**: 21 database models
- **Total Fields**: 500+ fields
- **System Completion**: 100% ✅ (All 3 phases complete)
- **Enumerations**: 40+ enums
- **Relationships**: 30+ foreign keys

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd CaselogPro2
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/caselogpro2?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

Generate a secret key:
```bash
openssl rand -base64 32
```

4. **Set up the database**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with Nigerian states and demo users
npm run db:seed
```

5. **Run the development server**
```bash
npm run dev
```

6. **Access the application**
Open [http://localhost:3000](http://localhost:3000)

## 👥 Demo Credentials

### Federal Ministry of Justice
- **Super Admin**: `federal.superadmin@moj.gov.ng`
- **App Admin**: `federal.appadmin@moj.gov.ng`
- **Level 1-5**: `federal.level1@moj.gov.ng` to `federal.level5@moj.gov.ng`

### Lagos State
- **Super Admin**: `lagos.superadmin@justice.lg.gov.ng`
- **Level 1-5**: `lagos.level1@justice.lg.gov.ng` to `lagos.level5@justice.lg.gov.ng`

### FCT (Abuja)
- **Super Admin**: `fct.superadmin@justice.gov.ng`
- **Level 1-5**: `fct.level1@justice.gov.ng` to `fct.level5@justice.gov.ng`

**Default Password for all users**: `Password123!`

## 📊 Database Schema

### Core Entities

- **Tenant**: State or Federal entity
- **User**: System users with access levels
- **Case**: Main case entity with status workflow
- **Victim**: Victim information
- **DeceasedVictim**: Additional details for deceased victims
- **Perpetrator**: Suspect/perpetrator information
- **LegalGuardian**: Guardian information
- **Offence**: Offence and investigation details
- **Witness**: Witness information and statements
- **Evidence**: Evidence documentation
- **InvestigatingOfficer**: Officer details
- **CourtRecord**: Court and judgement information
- **Prosecutor**: Prosecutor details
- **Judgement**: Judgement and sentencing information
- **DeletionRequest**: Case deletion workflow
- **AuditLog**: Complete audit trail

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication with NextAuth.js
- Role-based access control (RBAC)
- Tenant isolation
- Session management with 8-hour timeout

### Audit Trail
- Complete audit logging for all actions
- User activity tracking
- Case modification history
- IP address and user agent logging

### Data Protection
- Tenant data isolation
- Encrypted passwords (bcrypt)
- Secure session handling
- HTTPS recommended for production

## 🔄 Case Workflow

1. **Draft**: Case created by Level 2+ user
2. **Pending Approval**: Submitted for review
3. **Approved**: Approved by Level 3+ user
4. **Rejected**: Rejected with reason
5. **Closed**: Case concluded
6. **Archived**: Long-term storage

### Deletion Workflow
1. Level 4 user requests deletion with reason
2. Level 5 user reviews and approves/rejects
3. Upon approval, case is permanently deleted
4. All actions logged in audit trail

## 📱 Features by Access Level

| Feature | L1 | L2 | L3 | L4 | L5 | Super | App Admin |
|---------|----|----|----|----|-------|-------|-----------|
| View Cases | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Cases | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Approve/Reject | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Request Delete | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Approve Delete | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View All States | ❌ | ❌ | ❌ | ❌ | ❌ | ✅* | ✅* |
| Admin Panel | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

*Only for Federal users

## 🌍 Nigerian States Coverage

All 36 states plus FCT are pre-configured:
- Abia, Adamawa, Akwa Ibom, Anambra, Bauchi, Bayelsa, Benue, Borno
- Cross River, Delta, Ebonyi, Edo, Ekiti, Enugu, Gombe, Imo
- Jigawa, Kaduna, Kano, Katsina, Kebbi, Kogi, Kwara, Lagos
- Nasarawa, Niger, Ogun, Ondo, Osun, Oyo, Plateau, Rivers
- Sokoto, Taraba, Yobe, Zamfara, Federal Capital Territory

## 📈 Statistics & Reporting

### Dashboard Features
- Total cases by status
- Cases by type of SGBV
- Recent cases overview
- State-wise distribution (Federal view)
- Trend analysis

### Federal Ministry Dashboard
- Cross-state case visibility
- Aggregate statistics
- State performance metrics
- National SGBV trends

## 🔧 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI**: Tailwind CSS
- **State Management**: React Query + Zustand
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner

## 📝 API Routes

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Cases
- `GET /api/cases` - List cases (with filters)
- `POST /api/cases` - Create new case
- `GET /api/cases/[id]` - Get case details
- `PATCH /api/cases/[id]` - Update case
- `DELETE /api/cases/[id]` - Delete case (Level 5+)
- `POST /api/cases/[id]/approve` - Approve case
- `POST /api/cases/[id]/reject` - Reject case

### Deletion Requests
- `GET /api/deletion-requests` - List requests
- `POST /api/deletion-requests` - Create request
- `POST /api/deletion-requests/[id]/approve` - Approve request

### Statistics
- `GET /api/statistics` - Dashboard statistics

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**
   - Set secure `NEXTAUTH_SECRET`
   - Configure production `DATABASE_URL`
   - Set `NEXTAUTH_URL` to production domain

2. **Database**
   - Run migrations: `npm run db:migrate`
   - Backup strategy in place
   - Regular maintenance scheduled

3. **Security**
   - Enable HTTPS
   - Configure CORS
   - Set up rate limiting
   - Regular security audits

4. **Performance**
   - Enable caching
   - CDN for static assets
   - Database indexing optimized
   - Monitor query performance

### Deployment Platforms

- **Vercel** (Recommended for Next.js)
- **Railway** (Database + App)
- **DigitalOcean App Platform**
- **AWS** (EC2 + RDS)

## 🔐 Biometric Integration

The system includes placeholders for biometric data:
- Fingerprint ID storage
- Face recognition ID storage
- Ready for integration with biometric devices/APIs

To integrate:
1. Add biometric capture UI components
2. Implement API endpoints for biometric processing
3. Store biometric references (not raw data)
4. Ensure GDPR/data protection compliance

## 📚 Legal Framework

Pre-configured Nigerian SGBV laws:
- Violence Against Persons Prohibition Act (VAPPA)
- Child Rights Act (CRA)
- Trafficking in Persons Prohibition Act (TPPA)
- Penal Code
- Cybercrime Act (CCA)
- Administration of Criminal Justice Act (ADA)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary software developed for the Federal Ministry of Justice, Nigeria.

## 📞 Support

For technical support or questions:
- Email: support@caselogpro.gov.ng
- Documentation: [Internal Wiki]
- Issue Tracker: [GitHub Issues]

## 🙏 Acknowledgments

- Federal Ministry of Justice, Nigeria
- State Ministries of Justice
- SGBV Response Teams across Nigeria

---

**Built with ❤️ for a safer Nigeria**

