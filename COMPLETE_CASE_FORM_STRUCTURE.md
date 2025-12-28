# Complete Case Form Structure - SGBV Documentation

Comprehensive mapping of all data fields for SGBV case documentation.

---

## 📋 FORM SECTIONS OVERVIEW

### 1. Victim's Details
### 2. Deceased Victim's Details
### 3. Perpetrator/Victim's Legal Guardians' Details
### 4. Perpetrator/Suspect's Details
### 5. Investigating Officer Details
### 6. Witnesses
### 7. Evidence
### 8. Forms/Types of Services Required
### 9. Case Overview Details
### 10. Offence/Investigating Process Details
### 11. Offences, Laws & Penalties (Reference Table)
### 12. Court Records
### 13. Prosecutor's Details
### 14. Judgement Information

---

## 1️⃣ VICTIM'S DETAILS

| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| Name | String | Yes | `victim.name` | Full name |
| Complainant Name | String | No | `victim.complainantName` | If different from victim |
| Gender | Enum | Yes | `victim.gender` | MALE, FEMALE, OTHER |
| Age | Number | Yes | `victim.age` | Auto-calculate isMinor if < 18 |
| Date of Birth | Date | No | `victim.dateOfBirth` | Optional |
| Phone Number | String | No | `victim.phoneNumber` | Contact number |
| Email Address | String | No | `victim.email` | Email contact |
| Education Qualification | String | No | `victim.educationQualification` | Education level |
| Nationality | String | Yes | `victim.nationality` | Default: Nigerian |
| Relationship Status | Enum | No | `victim.relationshipStatus` | SINGLE, MARRIED, DIVORCED, WIDOWED, SEPARATED, COHABITING, INTIMATE_PARTNER |
| Occupation | String | No | `victim.occupation` | Job/profession |
| Address | Text | No | `victim.address` | Full address |
| Language | String | No | `victim.language` | Preferred language |
| Form of SGBV | Enum | Yes | `case.formOfSGBV` | Type of violence |
| Fingerprint ID | String | No | `victim.fingerprintId` | Biometric reference |
| Face Recognition ID | String | No | `victim.faceRecognitionId` | Biometric reference |

### Guardian Details (Show if victim is minor)
| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| Guardian Name | String | Conditional | `victim.guardianName` | Required if isMinor |
| Guardian Relationship | String | No | `victim.guardianRelationship` | Relation to victim |
| Guardian Phone | String | Conditional | `victim.guardianPhoneNumber` | Required if isMinor |
| Guardian Address | Text | No | `victim.guardianAddress` | Guardian's address |

---

## 2️⃣ DECEASED VICTIM'S DETAILS

| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| Medical Report | Text | No | `deceasedVictim.medicalReport` | Report details |
| Medical Report Upload | File | No | `deceasedVictim.medicalReportUploadPath` | **Upload Button** |
| Cause of Death | Text | No | `deceasedVictim.causeOfDeath` | Description |
| Date of Death | Date | No | `deceasedVictim.dateOfDeath` | When death occurred |
| Time of Death | String | No | `deceasedVictim.timeOfDeath` | Time of death |
| Place of Death | Text | No | `deceasedVictim.placeOfDeath` | Location |
| Address of Mortuary | Text | No | `deceasedVictim.addressOfMortuary` | Mortuary location |
| Place Buried | Text | No | `deceasedVictim.placeBuried` | Burial location |
| Date Buried | Date | No | `deceasedVictim.dateBuried` | Burial date |
| Autopsy Report | Text | No | `deceasedVictim.autopsyReport` | Report details |
| Autopsy Report Upload | File | No | `deceasedVictim.autopsyReportUploadPath` | **Upload Button** |

---

## 3️⃣ PERPETRATOR/VICTIM'S LEGAL GUARDIANS' DETAILS

| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| Name | String | No | `legalGuardian.name` | Guardian's name |
| Address | Text | No | `legalGuardian.address` | Full address |
| Phone Numbers | String | No | `legalGuardian.phoneNumber` | Contact number |
| Email Address | String | No | `legalGuardian.email` | Email contact |

---

## 4️⃣ PERPETRATOR/SUSPECT'S DETAILS

| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| Name | String | Yes | `perpetrator.name` | Full name |
| Date of Birth | Date | No | `perpetrator.dateOfBirth` | DOB |
| Place of Birth | String | No | `perpetrator.placeOfBirth` | Birth location |
| Age | Number | No | `perpetrator.age` | Age in years |
| Address | Text | No | `perpetrator.address` | Full address |
| Phone Number | String | No | `perpetrator.phoneNumber` | Contact number |
| Email Address | String | No | `perpetrator.email` | Email contact |
| Gender | Enum | No | `perpetrator.gender` | MALE, FEMALE, OTHER |
| Educational Qualification | String | No | `perpetrator.educationQualification` | Education level |
| Nationality | String | No | `perpetrator.nationality` | Nationality |
| Relationship Status | Enum | No | `perpetrator.relationshipStatus` | Status |
| Language | String | No | `perpetrator.language` | Preferred language |
| Occupation | String | No | `perpetrator.occupation` | Job/profession |
| Fingerprint ID | String | No | `perpetrator.fingerprintId` | Biometric reference |
| Face Recognition ID | String | No | `perpetrator.faceRecognitionId` | Biometric reference |
| Previous Criminal History | Text | No | `perpetrator.previousCriminalHistory` | Criminal record |
| Relationship with Victim | String | No | `perpetrator.relationshipWithVictim` | Relation to victim |

---

## 5️⃣ INVESTIGATING OFFICER DETAILS

| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| Name | String | Yes | `investigatingOfficer.name` | Officer's name |
| Address | Text | No | `investigatingOfficer.address` | Office address |
| Phone Number | String | No | `investigatingOfficer.phoneNumber` | Contact number |
| Email | String | No | `investigatingOfficer.email` | Email contact |
| Rank | String | No | `investigatingOfficer.rank` | Police rank |
| Staff Number | String | No | `investigatingOfficer.staffNumber` | ID number |
| Agency | String | No | `investigatingOfficer.agency` | Police station/agency |

---

## 6️⃣ WITNESSES

| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| Witness Number | String | No | `witness.witnessNumber` | Reference number |
| Name | String | Yes | `witness.name` | Witness name |
| Phone Number | String | No | `witness.phoneNumber` | Contact number |
| Address | Text | No | `witness.address` | Full address |
| Email Address | String | No | `witness.email` | Email contact |
| Date of Appearance | Date | No | `witness.dateOfAppearance` | Court appearance date |
| Witness Statement | Text | Yes | `witness.statement` | Statement details |

**Note**: Multiple witnesses can be added per case

---

## 7️⃣ EVIDENCE

| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| Evidence Type | Enum | Yes | `evidence.type` | FORENSIC, WRITTEN_STATEMENT, ELECTRONIC, PHYSICAL, OTHER |
| Description | Text | Yes | `evidence.description` | Evidence description |
| File Upload | File | No | `evidence.fileUrl` | Evidence file |
| Storage Location | String | No | `evidence.storageLocation` | Where evidence is stored |
| Collected Date | Date | No | `evidence.collectedDate` | When collected |
| Collected By | String | No | `evidence.collectedBy` | Who collected it |

### Forensic Examiner Details (for Forensic Evidence)
| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| Examiner Name | String | No | `evidence.forensicExaminerName` | Examiner's name |
| Examiner ID | String | No | `evidence.forensicExaminerID` | ID number |
| Examiner Agency | String | No | `evidence.forensicExaminerAgency` | Lab/agency |
| Examiner Contact | String | No | `evidence.forensicExaminerContact` | Contact info |
| Forensic Report Upload | File | No | `evidence.forensicReportPath` | **Upload Button** |

### Chain of Custody
| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| Transferred From | String | Yes | `chainOfCustody.transferredFrom` | Previous custodian |
| Transferred To | String | Yes | `chainOfCustody.transferredTo` | New custodian |
| Transfer Date | DateTime | Yes | `chainOfCustody.transferDate` | When transferred |
| Purpose | Text | Yes | `chainOfCustody.purpose` | Reason for transfer |
| Condition | Text | No | `chainOfCustody.condition` | Evidence condition |
| Received By | String | Yes | `chainOfCustody.receivedBy` | Receiver's name |
| Signature | String | No | `chainOfCustody.receivedBySignature` | Digital signature |
| Notes | Text | No | `chainOfCustody.notes` | Additional notes |

**Note**: Multiple evidence items and chain of custody entries can be added

---

## 8️⃣ FORMS/TYPES OF SERVICES REQUIRED

| Option | Database Value | Description |
|--------|---------------|-------------|
| Forensic Interview | `FORENSIC_INTERVIEW` | Specialized interview |
| Referral | `REFERRAL` | Referral to services |
| Prosecution | `PROSECUTION` | Legal prosecution |
| Mediation | `MEDIATION` | Mediation services |
| Legal Counselling | `LEGAL_COUNSELLING` | Legal advice |
| Diversion | `DIVERSION` | Diversion program |

**Database Field**: `case.serviceType`

**Note**: When PROSECUTION is selected, show Charge Number field

---

## 9️⃣ CASE OVERVIEW DETAILS

| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| File Number | String | Yes | `case.fileNumber` | Unique case identifier |
| Date Charged | Date | No | `case.dateCharged` | When charged |
| Charge Number | String | Conditional | `case.chargeNumber` | **Show only if serviceType = PROSECUTION** |
| Date Filed in Court | Date | No | `case.dateFiledInCourt` | Court filing date |
| Administrative Number | String | No | `case.administrativeNumber` | Admin reference |
| Ministry of Justice Case Number | String | No | `case.mojCaseNumber` | MOJ reference |
| Date of Arraignment | Date | No | `case.dateOfArraignment` | Arraignment date |
| Bail Conditions | Text | No | `case.bailConditions` | Bail terms |
| Status of the Case | Text | No | `case.statusOfCase` | Current status |
| Name of the Judge | String | No | `courtRecord.judgeName` | Judge's name |

### Bail Release Information
| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| Suspect Released on Bail | Boolean | No | `case.suspectReleasedOnBail` | Yes/No |
| Date Released | Date | Conditional | `case.bailReleaseDate` | If released on bail |
| Surety's NIN | String | Conditional | `case.suretysNIN` | If released on bail |
| Surety's Phone Number | String | Conditional | `case.suretysPhoneNumber` | If released on bail |

---

## 🔟 OFFENCE/INVESTIGATING PROCESS DETAILS

### Offence Details
| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| Date of Offence | Date | No | `offence.dateOfOffence` | When offence occurred |
| Place of Offence | Text | No | `offence.placeOfOffence` | Location |
| Nature of Offence | Text | Yes | `offence.natureOfOffence` | Description |
| Offence Code | String | No | `offence.offenceCode` | Legal code reference |
| Offence Law | String | No | `offence.law` | Applicable law |
| Penalty | Text | No | `offence.penalty` | Legal penalty |

### Investigation Details
| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| Date Reported to Law Enforcement | Date | No | `offence.dateReported` | Reporting date |
| Suspect Arrested | Boolean | No | `offence.suspectArrested` | Yes/No |
| Date Arrested | Date | No | `offence.dateArrested` | Arrest date |
| Date Investigation Commenced | Date | No | `offence.investigationStartDate` | Investigation start |
| Investigation Status | String | No | `offence.investigationStatus` | Current status |
| Suspect Released on Administrative Bail | Boolean | No | `case.suspectReleasedOnBail` | Yes/No |

---

## 1️⃣1️⃣ OFFENCES, LAWS & PENALTIES (Reference Table)

### Nigerian SGBV Laws Database

| Offence | Law | Penalty |
|---------|-----|---------|
| Trafficking in women | Section 281 Penal Code | 7 years imprisonment and fine |
| Rape | Section 283 Penal Code | Life imprisonment and fine |
| Rape | Section 1 VAPPA | Life imprisonment |
| Abandonment of child under 12 years | Section 237 Penal Code | 7 years imprisonment and fine |
| Incest with consent | Section 390 Penal Code | 7 years imprisonment and fine |
| Incest without consent | Section 25(a) VAPPA | 10 years imprisonment without option of fine |
| Incest with consent | Section 25(b) VAPPA | Minimum 5 years imprisonment without option of fine |
| Female Genital Mutilation | Section 6 VAPPA | 4 years imprisonment or fine or both; 2 years for attempt; 2 years for inciting/aiding |
| Forceful ejection of spouse from home | Section 9 VAPPA | 2 years imprisonment or fine or both; 1 year for attempt |
| Forced isolation from family/friends | Section 13 VAPPA | 6 months imprisonment or fine or both; 3 months for attempt/aiding |
| Emotional/verbal/psychological abuse | Section 14 VAPPA | 1 year imprisonment or fine or both; 6 months for attempt/aiding |
| Harmful widowhood practices | Section 15 VAPPA | 2 years imprisonment or fine or both; 1 year for attempt/aiding |
| Abandonment of spouse/children | Section 16 VAPPA | 3 years imprisonment or fine or both; 2 years for attempt/aiding |
| Spousal battery | Section 19 VAPPA | 3 years imprisonment or fine or both; 1 year for attempt/aiding |
| Child marriage and betrothal | Section 23(d) CRA | ₦500,000 fine or 5 years imprisonment or both |
| Making tattoos on a child | Section 24(2) CRA | ₦5,000 fine or 1 month imprisonment or both |
| Child exposure to narcotics | Section 25(2) CRA | Life imprisonment |
| Child trafficking for hawking/begging | Section 30(3) CRA | 10 years imprisonment |
| Unlawful sexual intercourse with child | Section 31(2) CRA | Life imprisonment |
| Trafficking in persons | Section 13 TPPA | Minimum 2 years imprisonment or fine |
| Importation/exportation of persons | Section 14 TPPA | Minimum 5 years imprisonment and fine |
| Procurement for sexual exploitation | Section 15 TPPA | 5 years imprisonment and fine |
| Producing child pornography | Section 23(a) CCA | ₦20,000,000 fine or 10 years imprisonment or both |
| Offering/making available child pornography | Section 23(b) CCA | ₦20,000,000 fine or 10 years imprisonment or both |
| Distributing child pornography | Section 23(c) CCA | ₦20,000,000 fine or 10 years imprisonment or both |
| Procuring child pornography | Section 23(d) CCA | ₦10,000,000 fine or 5 years imprisonment or both |
| Possessing child pornography | Section 23(e) CCA | ₦10,000,000 fine or 10 years imprisonment or both |
| Unsolicited pornographic images | Section 23(2) CCA | ₦250,000 fine or 1 year imprisonment or both |
| Sexual activities with child | Section 23(3)(a) CCA | ₦15,000,000 fine or 10 years imprisonment or both |
| Sexual activities with child (coercion) | Section 23(3)(b) CCA | ₦25,000,000 fine or 15 years imprisonment or both |
| Sexual activities knowing HIV+ status | Section 26(1) ADA | 20 years or life imprisonment |
| Intentionally stupefying/overpowering | Section 28(1) ADA | ₦5,000,000 fine or 10 years imprisonment or both |

**Implementation**: Create dropdown/autocomplete for offence selection that auto-fills law and penalty

---

## 1️⃣2️⃣ COURT RECORDS

| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| Name of Court | String | No | `courtRecord.courtName` | Court name |
| Location of Court | String | No | `courtRecord.courtLocation` | Court address |
| Judgement of Court | Text | No | `courtRecord.judgement` | Court decision |
| Corrective Facility | String | No | `courtRecord.correctiveFacility` | Prison/facility name |
| Remarks | Text | No | `courtRecord.remarks` | Additional notes |

---

## 1️⃣3️⃣ PROSECUTOR'S DETAILS

| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| Name | String | No | `prosecutor.name` | Prosecutor's name |
| Address | Text | No | `prosecutor.address` | Office address |
| Phone Number | String | No | `prosecutor.phoneNumber` | Contact number |
| Email Address | String | No | `prosecutor.email` | Email contact |

---

## 1️⃣4️⃣ JUDGEMENT INFORMATION

| Field | Type | Required | Database Field | Notes |
|-------|------|----------|----------------|-------|
| Date of Judgement | Date | No | `judgement.dateOfJudgement` | Judgement date |
| Conviction | Boolean | No | `judgement.conviction` | Convicted Yes/No |
| Acquittal | Boolean | No | `judgement.acquittal` | Acquitted Yes/No |
| Sentence Type | Enum | No | `judgement.sentenceType` | Type of sentence |
| Sentence Details | Text | No | `judgement.sentenceDetails` | Details |

### Non-Custodial Convictions
| Option | Database Value | Description |
|--------|---------------|-------------|
| Fine | `FINE` | Monetary fine |
| Probation | `PROBATION` | Probation period |
| Suspended Sentence | `SUSPENDED_SENTENCE` | Suspended sentence |
| Community Service | `COMMUNITY_SERVICE` | Community service |
| Reparations | `REPARATIONS` | Reparations payment |
| Compensation | `COMPENSATION` | Compensation to victim |
| Deportation | `DEPORTATION` | Deportation order |

---

## 🎨 FORM LAYOUT STRUCTURE

### Multi-Step Form (Recommended)

**Step 1: Case Overview**
- File Number
- Form of SGBV
- Services Required
- Date Reported

**Step 2: Victim Details**
- Personal Information
- Contact Details
- Guardian Details (if minor)

**Step 3: Perpetrator Details**
- Personal Information
- Criminal History
- Relationship to Victim

**Step 4: Offence Details**
- Date, Place, Nature
- Law & Penalty
- Investigation Status

**Step 5: Evidence**
- Evidence Items
- Chain of Custody
- Forensic Details

**Step 6: Witnesses**
- Witness Information
- Statements

**Step 7: Legal Proceedings**
- Court Records
- Prosecutor Details
- Judgement Information

**Step 8: Review & Submit**
- Review all information
- Submit case

---

## 🔒 CONDITIONAL FIELDS

### 1. Charge Number
- **Show when**: `serviceType === 'PROSECUTION'`
- **Hide when**: Other service types

### 2. Guardian Details
- **Show when**: `victim.age < 18` OR `victim.isMinor === true`
- **Required when**: Shown

### 3. Bail Release Information
- **Show when**: `case.suspectReleasedOnBail === true`
- **Required when**: Shown

### 4. Deceased Victim Section
- **Show when**: User indicates victim is deceased
- **Optional**: All fields

### 5. Forensic Examiner Details
- **Show when**: `evidence.type === 'FORENSIC'`
- **Optional**: All fields

---

## ✅ VALIDATION RULES

### Required Fields
- File Number (unique)
- Form of SGBV
- Victim Name
- Victim Gender
- Victim Age
- Perpetrator Name (if known)

### Conditional Requirements
- Charge Number (if Prosecution)
- Guardian Details (if minor)
- Bail Release Details (if released)

### Data Validation
- Age must be 0-150
- Email format validation
- Phone number format
- Date validations (not in future)
- File size limits for uploads

---

## 📊 DATABASE STATUS

**Current Schema**: ✅ All fields supported

**Ready for Implementation**: ✅ Yes

**Migration Status**: ✅ Complete

---

## 🚀 NEXT STEPS

1. **Create Form Components**
   - Multi-step wizard
   - Conditional field logic
   - File upload handlers

2. **Update Validation Schemas**
   - Zod schemas for all sections
   - Conditional validation

3. **Create API Handlers**
   - POST /api/cases (create)
   - PUT /api/cases/[id] (update)
   - File upload endpoints

4. **Build UI Pages**
   - Case creation form
   - Case detail view
   - Case edit form

---

**Status**: ✅ Complete Documentation
**Version**: 1.0.0
**Last Updated**: November 2024

