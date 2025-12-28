# Database Schema Updates Summary

Complete list of all changes made to the database schema based on user requirements.

---

## 📋 Changes Overview

### 1. ✅ **Harmful Widowhood Practices** - Standalone
- Already exists as separate enum value in `FormOfSGBV`
- Status: **Complete**

### 2. ✅ **New SGBV Types Added**
Added three new types to `FormOfSGBV` enum:
- `SEXTORTION`
- `ONLINE_CHILD_SEXUAL_EXPLOITATION`
- `INTIMATE_IMAGE_ABUSE`

### 3. ✅ **FGM** - Standalone
- Already exists as `FEMALE_GENITAL_MUTILATION` in `FormOfSGBV`
- Status: **Complete**

### 4. ✅ **Charge Number for Prosecution**
- `chargeNumber` field already exists in `Case` model
- Will be shown conditionally when `serviceType` = `PROSECUTION`

### 5. ✅ **Case Number → File Number**
- Changed `caseNumber` to `fileNumber` in `Case` model
- Updated all indexes and references

### 6. ✅ **Bail Release Information**
Added new fields to `Case` model:
- `suspectReleasedOnBail` (Boolean)
- `bailReleaseDate` (DateTime)
- `suretysNIN` (String)
- `suretysPhoneNumber` (String)

### 7. ✅ **Upload Buttons for Reports**
Added upload paths to `DeceasedVictim` model:
- `medicalReportUploadPath` (String)
- `autopsyReportUploadPath` (String)

### 8. ✅ **Guardian Details for Minors**
Added to `Victim` model:
- `isMinor` (Boolean) - Auto-set if age < 18
- `guardianName` (String)
- `guardianRelationship` (String)
- `guardianPhoneNumber` (String)
- `guardianAddress` (Text)

### 9. ✅ **Complainant Name**
Added to `Victim` model:
- `complainantName` (String) - Optional field for complainant if different from victim

### 10. ✅ **Marital Status → Relationship Status**
- Renamed `MaritalStatus` enum to `RelationshipStatus`
- Renamed `maritalStatus` field to `relationshipStatus`
- Added new options:
  - `COHABITING`
  - `INTIMATE_PARTNER`

### 11. ✅ **Chain of Custody**
Created new `ChainOfCustody` model with fields:
- `transferredFrom` (String)
- `transferredTo` (String)
- `transferDate` (DateTime)
- `purpose` (Text)
- `condition` (Text)
- `receivedBy` (String)
- `receivedBySignature` (String)
- `notes` (Text)

### 12. ✅ **Forensic Examiner Details**
Added to `Evidence` model:
- `forensicExaminerName` (String)
- `forensicExaminerID` (String)
- `forensicExaminerAgency` (String)
- `forensicExaminerContact` (String)
- `forensicReportPath` (String)

### 13. ✅ **Evidence Storage Location**
Added to `Evidence` model:
- `storageLocation` (String)

### 14. ✅ **Services Required** (formerly Legal Services)
- Renamed `LegalServiceType` enum to `ServiceType`
- Renamed `legalServiceType` field to `serviceType`
- Updated options to:
  - `FORENSIC_INTERVIEW` (New)
  - `REFERRAL`
  - `PROSECUTION`
  - `MEDIATION`
  - `LEGAL_COUNSELLING`
  - `DIVERSION`

---

## 📊 Detailed Changes

### Enums Updated

#### 1. FormOfSGBV (Updated)
```prisma
enum FormOfSGBV {
  RAPE
  SEXUAL_ASSAULT
  DOMESTIC_VIOLENCE
  TRAFFICKING
  CHILD_ABUSE
  FORCED_MARRIAGE
  FEMALE_GENITAL_MUTILATION      // FGM - Standalone
  HARMFUL_WIDOWHOOD_PRACTICES    // Standalone
  EMOTIONAL_ABUSE
  INCEST
  SEXTORTION                     // NEW
  ONLINE_CHILD_SEXUAL_EXPLOITATION // NEW
  INTIMATE_IMAGE_ABUSE           // NEW
  OTHER
}
```

#### 2. ServiceType (Renamed from LegalServiceType)
```prisma
enum ServiceType {
  FORENSIC_INTERVIEW  // NEW
  REFERRAL
  PROSECUTION
  MEDIATION
  LEGAL_COUNSELLING
  DIVERSION
}
```

#### 3. RelationshipStatus (Renamed from MaritalStatus)
```prisma
enum RelationshipStatus {
  SINGLE
  MARRIED
  DIVORCED
  WIDOWED
  SEPARATED
  COHABITING        // NEW
  INTIMATE_PARTNER  // NEW
}
```

---

### Models Updated

#### 1. Case Model
```prisma
model Case {
  // Changed
  fileNumber              String          @unique  // Was: caseNumber
  serviceType             ServiceType?             // Was: legalServiceType
  
  // New Fields
  suspectReleasedOnBail   Boolean         @default(false)
  bailReleaseDate         DateTime?
  suretysNIN              String?
  suretysPhoneNumber      String?
  
  // ... other fields
}
```

#### 2. Victim Model
```prisma
model Victim {
  // Changed
  relationshipStatus      RelationshipStatus?  // Was: maritalStatus
  
  // New Fields
  complainantName         String?
  isMinor                 Boolean         @default(false)
  guardianName            String?
  guardianRelationship    String?
  guardianPhoneNumber     String?
  guardianAddress         String?         @db.Text
  
  // ... other fields
}
```

#### 3. DeceasedVictim Model
```prisma
model DeceasedVictim {
  // New Fields
  medicalReportUploadPath String?
  autopsyReportUploadPath String?
  
  // ... other fields
}
```

#### 4. Evidence Model
```prisma
model Evidence {
  // New Fields
  storageLocation         String?
  chainOfCustody          ChainOfCustody[]  // Relation
  
  // Forensic Examiner Details
  forensicExaminerName    String?
  forensicExaminerID      String?
  forensicExaminerAgency  String?
  forensicExaminerContact String?
  forensicReportPath      String?
  
  // ... other fields
}
```

#### 5. ChainOfCustody Model (NEW)
```prisma
model ChainOfCustody {
  id                      String          @id @default(cuid())
  evidenceId              String
  evidence                Evidence        @relation(fields: [evidenceId], references: [id])
  
  transferredFrom         String
  transferredTo           String
  transferDate            DateTime        @default(now())
  purpose                 String          @db.Text
  condition               String?         @db.Text
  receivedBy              String
  receivedBySignature     String?
  notes                   String?         @db.Text
  
  createdAt               DateTime        @default(now())
  
  @@index([evidenceId])
  @@index([transferDate])
}
```

---

## 🔄 Migration Steps

### Step 1: Apply Schema Changes
```bash
npx prisma db push --force-reset --accept-data-loss
```

### Step 2: Regenerate Prisma Client
```bash
npx prisma generate
```

### Step 3: Seed Database
```bash
npx tsx prisma/seed.ts
```

---

## 🎨 UI/UX Implications

### 1. File Number Display
- Replace all "Case Number" labels with "File Number"
- Update forms, tables, and displays

### 2. Charge Number (Conditional)
- Show `chargeNumber` field only when:
  - `serviceType` === `PROSECUTION`
- Hide for other service types

### 3. Bail Release Section
- Add new section in case form:
  ```
  Bail Release Information
  ├── Released on Bail? (Yes/No)
  ├── Release Date
  ├── Surety's NIN
  └── Surety's Phone Number
  ```

### 4. Upload Buttons
- Add file upload buttons for:
  - Medical Report (DeceasedVictim)
  - Autopsy Report (DeceasedVictim)
  - Forensic Report (Evidence)

### 5. Guardian Details (Conditional)
- Show guardian fields when:
  - Victim age < 18
  - OR `isMinor` checkbox is checked
- Fields:
  ```
  Guardian Information
  ├── Guardian Name
  ├── Relationship to Victim
  ├── Phone Number
  └── Address
  ```

### 6. Complainant Field
- Add optional field in Victim section:
  ```
  Name of Complainant (if different from victim)
  ```

### 7. Relationship Status Dropdown
- Update dropdown options:
  - Remove "Marital" from label
  - Change to "Relationship Status"
  - Add "Cohabiting" and "Intimate Partner" options

### 8. Chain of Custody Interface
- Create table/list view for chain of custody entries
- Add button: "Add Chain of Custody Entry"
- Show transfer history with:
  - From → To
  - Date
  - Purpose
  - Condition
  - Received By

### 9. Forensic Examiner Section
- Add new section in Evidence form:
  ```
  Forensic Examiner Details
  ├── Examiner Name
  ├── Examiner ID
  ├── Agency
  ├── Contact
  └── Report Upload
  ```

### 10. Services Required Dropdown
- Update label: "Legal Services" → "Services Required"
- Update options:
  - Forensic Interview (NEW)
  - Referral
  - Prosecution
  - Mediation
  - Legal Counselling
  - Diversion

---

## 📝 Form Field Mapping

### Case Form
| Old Field | New Field | Type | Notes |
|-----------|-----------|------|-------|
| caseNumber | fileNumber | String | Renamed |
| legalServiceType | serviceType | Enum | Renamed + new options |
| - | suspectReleasedOnBail | Boolean | New |
| - | bailReleaseDate | DateTime | New (conditional) |
| - | suretysNIN | String | New (conditional) |
| - | suretysPhoneNumber | String | New (conditional) |

### Victim Form
| Old Field | New Field | Type | Notes |
|-----------|-----------|------|-------|
| maritalStatus | relationshipStatus | Enum | Renamed + new options |
| - | complainantName | String | New (optional) |
| - | isMinor | Boolean | New (auto-calculated) |
| - | guardianName | String | New (conditional) |
| - | guardianRelationship | String | New (conditional) |
| - | guardianPhoneNumber | String | New (conditional) |
| - | guardianAddress | Text | New (conditional) |

### DeceasedVictim Form
| Old Field | New Field | Type | Notes |
|-----------|-----------|------|-------|
| - | medicalReportUploadPath | String | New (file upload) |
| - | autopsyReportUploadPath | String | New (file upload) |

### Evidence Form
| Old Field | New Field | Type | Notes |
|-----------|-----------|------|-------|
| - | storageLocation | String | New |
| chainOfCustody | chainOfCustody | Relation | Enhanced (now separate model) |
| - | forensicExaminerName | String | New |
| - | forensicExaminerID | String | New |
| - | forensicExaminerAgency | String | New |
| - | forensicExaminerContact | String | New |
| - | forensicReportPath | String | New (file upload) |

---

## 🔍 Validation Rules

### 1. File Number
- Required
- Unique
- Format: Can be customized per state

### 2. Charge Number
- Required only if `serviceType` === `PROSECUTION`
- Optional for other service types

### 3. Bail Release
- If `suspectReleasedOnBail` === true:
  - `bailReleaseDate` is required
  - `suretysNIN` is required
  - `suretysPhoneNumber` is required

### 4. Guardian Details
- If `age` < 18 OR `isMinor` === true:
  - `guardianName` is required
  - `guardianPhoneNumber` is required
  - Other guardian fields optional

### 5. Chain of Custody
- Each entry must have:
  - `transferredFrom` (required)
  - `transferredTo` (required)
  - `transferDate` (required)
  - `receivedBy` (required)

---

## 🧪 Testing Checklist

### Schema Migration
- [ ] Database migration successful
- [ ] No data loss
- [ ] All indexes created
- [ ] Relations working

### New Fields
- [ ] File number field working
- [ ] Service type dropdown updated
- [ ] Bail release fields functional
- [ ] Guardian fields show/hide correctly
- [ ] Complainant field working
- [ ] Relationship status options correct
- [ ] Chain of custody entries working
- [ ] Forensic examiner fields functional
- [ ] Upload buttons working

### Conditional Logic
- [ ] Charge number shows for prosecution
- [ ] Bail fields show when released
- [ ] Guardian fields show for minors
- [ ] Chain of custody table displays

### Validation
- [ ] Required fields enforced
- [ ] Conditional requirements working
- [ ] File uploads validated
- [ ] Data types correct

---

## 📚 Related Files to Update

### Backend
- [ ] `prisma/schema.prisma` ✅ (Updated)
- [ ] `lib/validations.ts` - Add new Zod schemas
- [ ] `app/api/cases/route.ts` - Update API handlers
- [ ] `app/api/cases/[id]/route.ts` - Update handlers

### Frontend
- [ ] `app/dashboard/cases/new/page.tsx` - Update form
- [ ] `app/dashboard/cases/[id]/page.tsx` - Update display
- [ ] `components/forms/*` - Update form components
- [ ] `types/*` - Update TypeScript types

### Documentation
- [ ] `API.md` - Update API documentation
- [ ] `README.md` - Update feature list
- [ ] `SCHEMA_UPDATES_SUMMARY.md` ✅ (This file)

---

## 🚀 Next Steps

1. **Apply database migration**
   ```bash
   npx prisma db push --force-reset --accept-data-loss
   npx prisma generate
   npx tsx prisma/seed.ts
   ```

2. **Update validation schemas**
   - Add Zod schemas for new fields
   - Update existing schemas

3. **Update API routes**
   - Handle new fields in POST/PUT requests
   - Update response types

4. **Update UI forms**
   - Add new form fields
   - Implement conditional logic
   - Add file upload components

5. **Update display pages**
   - Show new fields in case details
   - Update labels (Case Number → File Number)
   - Add chain of custody display

6. **Test thoroughly**
   - Test all new fields
   - Test conditional logic
   - Test file uploads
   - Test chain of custody

---

## ✅ Summary

**Total Changes**: 15 major updates
**New Fields**: 20+
**New Model**: 1 (ChainOfCustody)
**Renamed Fields**: 3
**New Enum Values**: 5

**Status**: ✅ Schema Updated - Ready for Migration

---

**Last Updated**: November 2024
**Version**: 3.0.0

