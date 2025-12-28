# Comprehensive Case Management System - CaseLog3

Complete documentation for the 19-entity case management ecosystem.

---

## 🎯 SYSTEM OVERVIEW

### Total System Capacity
- **Minimum Fields**: 300+
- **Maximum Fields**: 500+ (with multiple related entities)
- **Core Entities**: 19 interconnected models
- **Required Fields**: Only 4 minimum
- **Recommended Fields**: 10-15 for complete case

---

## 1️⃣ CASE (Core Entity) - 40+ Fields

### Auto-Generated Fields
```typescript
id: UUID (auto)
caseNumber: "CL-YYYYMM-XXXX" (e.g., CL-202511-0001)
createdBy: Current user ID
createdAt: Timestamp (auto)
updatedAt: Timestamp (auto)
reportedDate: Timestamp (auto)
```

### Required Fields (Minimum 4)
```typescript
title: String (max 255 chars) - REQUIRED
description: Text - REQUIRED
incidentDate: DateTime - REQUIRED
incidentState: String - REQUIRED
```

### Classification (With Defaults)
```typescript
caseType: Enum {
  sgbv, trafficking, domestic_violence, 
  harassment, other
} DEFAULT: sgbv

status: Enum {
  new, active, investigation, pending_court, 
  closed, archived
} DEFAULT: new

priority: Enum {
  low, medium, high, urgent, critical
} DEFAULT: medium
```

### Location Information
```typescript
// Incident Location
incidentState: String (required)
incidentLga: String (optional)
incidentAddress: Text (optional)
incidentLocation: JSON {lat, long} (optional)

// Reporting Location
reportedState: String (optional)
reportedLga: String (optional)
reportedAddress: Text (optional)
```

### Assignment
```typescript
investigatorId: UUID (optional)
coordinatorId: UUID (optional)
assignedState: String (optional)
jurisdiction: Enum {federal, state} DEFAULT: federal
```

### Progress Tracking
```typescript
initialAssessmentCompleted: Boolean DEFAULT: false
investigationStarted: Boolean DEFAULT: false
courtDate: DateTime (optional)
courtStatus: String (optional)
finalOutcome: String (optional)
convictionDate: DateTime (optional)
sentence: Text (optional)
```

### Metadata Flags
```typescript
isSensitive: Boolean DEFAULT: false
requiresSpecialHandling: Boolean DEFAULT: false
mediaInvolved: Boolean DEFAULT: false
international: Boolean DEFAULT: false
crossJurisdictional: Boolean DEFAULT: false
```

---

## 2️⃣ VICTIM(S) - 70+ Fields Per Victim

### Personal Information
```typescript
id: UUID
caseId: UUID (foreign key)
victimNumber: String (V001, V002, etc.)

// Basic Info
firstName: String (required)
middleName: String (optional)
lastName: String (required)
aliases: String[] (optional)
dateOfBirth: Date (optional)
age: Integer (required)
gender: Enum {male, female, other, prefer_not_to_say}
nationality: String DEFAULT: "Nigerian"
stateOfOrigin: String (optional)
lgaOfOrigin: String (optional)
```

### Contact Information
```typescript
phoneNumber: String (optional)
alternatePhone: String (optional)
email: String (optional)
preferredContactMethod: Enum {phone, email, sms, whatsapp}
```

### Address Information
```typescript
// Current Address
currentAddress: Text (optional)
currentCity: String (optional)
currentState: String (optional)
currentLga: String (optional)
currentPostalCode: String (optional)

// Permanent Address
permanentAddress: Text (optional)
permanentCity: String (optional)
permanentState: String (optional)
permanentLga: String (optional)
sameAsCurrent: Boolean DEFAULT: false
```

### Emergency Contacts (2)
```typescript
// Emergency Contact 1
emergencyContact1Name: String (optional)
emergencyContact1Relationship: String (optional)
emergencyContact1Phone: String (optional)
emergencyContact1Address: Text (optional)

// Emergency Contact 2
emergencyContact2Name: String (optional)
emergencyContact2Relationship: String (optional)
emergencyContact2Phone: String (optional)
emergencyContact2Address: Text (optional)
```

### Medical & Health
```typescript
medicalHistory: Text (optional)
currentMedications: Text (optional)
allergies: Text (optional)
disabilities: Text (optional)
mentalHealthConditions: Text (optional)
substanceAbuse: Text (optional)
hivStatus: Enum {positive, negative, unknown, declined} (optional)
pregnancyStatus: Enum {pregnant, not_pregnant, unknown} (optional)
```

### Incident-Specific Information
```typescript
relationshipToPerpetrator: String (optional)
incidentDescription: Text (optional)
injuriesSustained: Text (optional)
medicalTreatmentReceived: Boolean (optional)
hospitalName: String (optional)
medicalReportNumber: String (optional)
psychologicalImpact: Text (optional)
```

### Support Services
```typescript
servicesNeeded: String[] (optional)
servicesProvided: String[] (optional)
shelterRequired: Boolean DEFAULT: false
shelterProvided: Boolean DEFAULT: false
legalAidRequired: Boolean DEFAULT: false
counselingRequired: Boolean DEFAULT: false
```

### Privacy & Consent
```typescript
consentToShare: Boolean DEFAULT: false
consentToPhotograph: Boolean DEFAULT: false
consentToTestify: Boolean DEFAULT: false
anonymityRequested: Boolean DEFAULT: false
protectionOrderRequired: Boolean DEFAULT: false
```

### Victim Statement
```typescript
statementText: Text (optional)
statementDate: DateTime (optional)
statementRecordedBy: UUID (optional)
statementAudioPath: String (optional)
statementVideoPath: String (optional)
statementVerified: Boolean DEFAULT: false
```

### Risk Assessment
```typescript
riskLevel: Enum {low, medium, high, critical} DEFAULT: medium
riskFactors: String[] (optional)
safetyPlan: Text (optional)
immediateThreats: Text (optional)
```

### Metadata
```typescript
isMinor: Boolean DEFAULT: false
isDeceased: Boolean DEFAULT: false
isDisabled: Boolean DEFAULT: false
requiresInterpreter: Boolean DEFAULT: false
interpreterLanguage: String (optional)
createdAt: DateTime
updatedAt: DateTime
```

---

## 3️⃣ PERPETRATOR(S) - 60+ Fields Per Perpetrator

### Personal Information
```typescript
id: UUID
caseId: UUID (foreign key)
perpetratorNumber: String (P001, P002, etc.)

// Basic Info
firstName: String (required)
middleName: String (optional)
lastName: String (required)
aliases: String[] (optional)
dateOfBirth: Date (optional)
age: Integer (optional)
gender: Enum {male, female, other}
nationality: String (optional)
stateOfOrigin: String (optional)
```

### Physical Description
```typescript
height: String (optional) // e.g., "5'10"
weight: String (optional) // e.g., "180 lbs"
buildType: Enum {slim, average, heavy, muscular} (optional)
complexion: String (optional)
eyeColor: String (optional)
hairColor: String (optional)
hairStyle: String (optional)
facialHair: String (optional)
distinctiveFeatures: Text (optional)
tattoos: Text (optional)
scars: Text (optional)
piercings: Text (optional)
```

### Contact Information
```typescript
phoneNumber: String (optional)
alternatePhone: String (optional)
email: String (optional)
socialMediaAccounts: JSON (optional)
```

### Known Associates
```typescript
knownAssociates: Text (optional)
gangAffiliation: String (optional)
accomplices: String[] (optional)
```

### Addresses
```typescript
// Current Address
currentAddress: Text (optional)
currentCity: String (optional)
currentState: String (optional)
currentLga: String (optional)

// Previous Addresses
previousAddresses: JSON[] (optional)

// Workplace
workplaceName: String (optional)
workplaceAddress: Text (optional)
occupation: String (optional)
```

### Relationship to Victim
```typescript
relationshipToVictim: String (optional)
relationshipDuration: String (optional)
cohabitation: Boolean DEFAULT: false
dependents: Integer (optional)
```

### Legal Status
```typescript
arrested: Boolean DEFAULT: false
arrestDate: DateTime (optional)
arrestLocation: String (optional)
arrestingAgency: String (optional)
arrestingOfficer: String (optional)
detentionFacility: String (optional)

chargesField: Boolean DEFAULT: false
chargeDetails: Text (optional)
chargeDate: DateTime (optional)

onBail: Boolean DEFAULT: false
bailAmount: Decimal (optional)
bailDate: DateTime (optional)
bailConditions: Text (optional)
suretyName: String (optional)
suretyNIN: String (optional)
suretyPhone: String (optional)
```

### Investigation Information
```typescript
suspectStatement: Text (optional)
statementDate: DateTime (optional)
lawyerName: String (optional)
lawyerContact: String (optional)
cooperationLevel: Enum {cooperative, uncooperative, hostile} (optional)
```

### Risk Assessment
```typescript
flightRisk: Enum {low, medium, high} DEFAULT: medium
violenceRisk: Enum {low, medium, high, extreme} DEFAULT: medium
riskToPublic: Boolean DEFAULT: false
riskFactors: String[] (optional)
```

### Criminal History
```typescript
priorConvictions: Boolean DEFAULT: false
priorConvictionsDetails: Text (optional)
priorArrests: Integer DEFAULT: 0
priorSGBVCases: Boolean DEFAULT: false
restrainingOrders: Boolean DEFAULT: false
```

### Metadata
```typescript
createdAt: DateTime
updatedAt: DateTime
```

---

## 4️⃣ WITNESS(ES) - 50+ Fields Per Witness

### Personal Information
```typescript
id: UUID
caseId: UUID (foreign key)
witnessNumber: String (W001, W002, etc.)

firstName: String (required)
middleName: String (optional)
lastName: String (required)
dateOfBirth: Date (optional)
age: Integer (optional)
gender: Enum {male, female, other}
nationality: String (optional)
occupation: String (optional)
```

### Contact Information
```typescript
phoneNumber: String (optional)
alternatePhone: String (optional)
email: String (optional)
address: Text (optional)
city: String (optional)
state: String (optional)
```

### Relationship to Case
```typescript
relationshipToVictim: String (optional)
relationshipToPerpetrator: String (optional)
witnessType: Enum {eyewitness, character, expert, hearsay}
```

### Witness Statement
```typescript
statementText: Text (required)
statementDate: DateTime (required)
statementRecordedBy: UUID (optional)
statementLocation: String (optional)

// Media
statementAudioPath: String (optional)
statementVideoPath: String (optional)
statementDocumentPath: String (optional)

statementVerified: Boolean DEFAULT: false
statementSigned: Boolean DEFAULT: false
```

### Credibility Assessment
```typescript
credibilityRating: Enum {low, medium, high} DEFAULT: medium
credibilityNotes: Text (optional)
inconsistencies: Text (optional)
corroboratingEvidence: Text (optional)
```

### Testimony Information
```typescript
availableForTestimony: Boolean DEFAULT: true
courtAppearanceDate: DateTime (optional)
courtAppearanceConfirmed: Boolean DEFAULT: false
testimonyChallenges: Text (optional)
needsAccommodation: Boolean DEFAULT: false
accommodationDetails: Text (optional)
```

### Protection Measures
```typescript
protectionRequired: Boolean DEFAULT: false
protectionLevel: Enum {none, low, medium, high} DEFAULT: none
protectionMeasures: String[] (optional)
threatLevel: Enum {none, low, medium, high} DEFAULT: none
threatsReceived: Text (optional)
```

### Risk Assessment
```typescript
riskLevel: Enum {low, medium, high} DEFAULT: low
riskFactors: String[] (optional)
intimidationAttempts: Boolean DEFAULT: false
intimidationDetails: Text (optional)
```

### Metadata
```typescript
isMinor: Boolean DEFAULT: false
requiresInterpreter: Boolean DEFAULT: false
interpreterLanguage: String (optional)
specialNeeds: Text (optional)
createdAt: DateTime
updatedAt: DateTime
```

---

## 5️⃣ EVIDENCE - 60+ Fields Per Evidence Item

### Basic Information
```typescript
id: UUID
caseId: UUID (foreign key)
evidenceNumber: String (E001, E002, etc.)

evidenceType: Enum {
  physical, digital, documentary, 
  forensic, testimonial, photographic, 
  video, audio, other
}

description: Text (required)
category: String (optional)
subcategory: String (optional)
```

### Collection Details
```typescript
collectedDate: DateTime (required)
collectedTime: Time (optional)
collectedBy: UUID (required)
collectedByName: String (required)
collectionLocation: Text (required)
collectionMethod: Text (optional)
collectionCircumstances: Text (optional)
```

### Physical Evidence Details
```typescript
// For Physical Evidence
physicalDescription: Text (optional)
dimensions: String (optional)
weight: String (optional)
color: String (optional)
material: String (optional)
condition: Enum {excellent, good, fair, poor, damaged}
quantity: Integer DEFAULT: 1
```

### Digital Evidence Details
```typescript
// For Digital Evidence
deviceType: String (optional)
deviceMake: String (optional)
deviceModel: String (optional)
deviceSerialNumber: String (optional)
storageCapacity: String (optional)
dataType: String (optional)
fileFormat: String (optional)
fileSize: String (optional)
hashValue: String (optional)
```

### Storage Information
```typescript
storageLocation: String (required)
storageType: Enum {evidence_room, lab, digital_storage, court, other}
storageConditions: String (optional)
containerType: String (optional)
sealNumber: String (optional)
```

### Forensic Analysis
```typescript
forensicAnalysisRequired: Boolean DEFAULT: false
forensicAnalysisRequested: Boolean DEFAULT: false
forensicAnalysisDate: DateTime (optional)
forensicLab: String (optional)
forensicAnalystName: String (optional)
forensicAnalystID: String (optional)
forensicReportNumber: String (optional)
forensicReportPath: String (optional)
forensicFindings: Text (optional)
dnaProfile: String (optional)
fingerprintsFound: Boolean DEFAULT: false
```

### Legal Admissibility
```typescript
admissible: Boolean DEFAULT: true
admissibilityNotes: Text (optional)
legalChallenges: Text (optional)
expertWitnessRequired: Boolean DEFAULT: false
expertWitnessName: String (optional)
```

### Chain of Custody
```typescript
chainOfCustodyId: UUID (foreign key)
currentCustodian: UUID (required)
currentCustodianName: String (required)
custodyStatus: Enum {in_custody, transferred, released, destroyed}
```

### Quality Control
```typescript
photographed: Boolean DEFAULT: false
photographPath: String (optional)
videographed: Boolean DEFAULT: false
videoPath: String (optional)
documented: Boolean DEFAULT: true
documentationComplete: Boolean DEFAULT: false
qualityCheckPassed: Boolean DEFAULT: false
qualityCheckBy: UUID (optional)
qualityCheckDate: DateTime (optional)
```

### Metadata
```typescript
tags: String[] (optional)
notes: Text (optional)
relatedEvidenceIds: UUID[] (optional)
isKey Evidence: Boolean DEFAULT: false
presentedInCourt: Boolean DEFAULT: false
courtPresentationDate: DateTime (optional)
createdAt: DateTime
updatedAt: DateTime
```

---

## 6️⃣ CHAIN OF CUSTODY - 40+ Fields

### Basic Information
```typescript
id: UUID
evidenceId: UUID (foreign key)
transferNumber: String (COC001, COC002, etc.)
```

### Custodian Information
```typescript
currentCustodian: UUID (required)
currentCustodianName: String (required)
currentCustodianTitle: String (optional)
currentCustodianAgency: String (optional)
currentCustodianBadgeNumber: String (optional)
```

### Transfer History
```typescript
transferHistory: JSON[] {
  from: UUID,
  fromName: String,
  to: UUID,
  toName: String,
  transferDate: DateTime,
  transferTime: Time,
  reason: String,
  location: String,
  condition: String,
  notes: Text
}
```

### Documentation
```typescript
documentationComplete: Boolean DEFAULT: false
allSignaturesObtained: Boolean DEFAULT: false
photographicRecord: Boolean DEFAULT: false
videoRecord: Boolean DEFAULT: false
```

### Signatures
```typescript
signatures: JSON[] {
  signedBy: UUID,
  signedByName: String,
  signatureDate: DateTime,
  signatureType: Enum {transfer, receipt, release},
  digitalSignature: String,
  witnessName: String (optional),
  witnessSignature: String (optional)
}
```

### Legal Compliance
```typescript
compliesWithStandards: Boolean DEFAULT: true
complianceNotes: Text (optional)
breaches: JSON[] (optional)
corrective Actions: Text (optional)
```

### Integrity Maintenance
```typescript
sealIntact: Boolean DEFAULT: true
tamperEvident: Boolean DEFAULT: false
conditionChanges: Text (optional)
environmentalConditions: Text (optional)
```

### Metadata
```typescript
createdAt: DateTime
updatedAt: DateTime
lastVerifiedDate: DateTime (optional)
lastVerifiedBy: UUID (optional)
```

---

## 7️⃣ CUSTODY TRANSFERS - 35+ Fields Per Transfer

### Transfer Information
```typescript
id: UUID
chainOfCustodyId: UUID (foreign key)
transferNumber: String (T001, T002, etc.)

transferredFrom: UUID (required)
transferredFromName: String (required)
transferredFromTitle: String (optional)
transferredFromAgency: String (optional)

transferredTo: UUID (required)
transferredToName: String (required)
transferredToTitle: String (optional)
transferredToAgency: String (optional)

transferDate: DateTime (required)
transferTime: Time (required)
transferLocation: String (required)
```

### Transfer Reason
```typescript
transferReason: Enum {
  analysis, storage, court_presentation, 
  return, disposal, other
}
reasonDetails: Text (optional)
```

### Transfer Documentation
```typescript
transferFormNumber: String (optional)
transferFormPath: String (optional)
transferAuthorization: String (optional)
authorizedBy: UUID (optional)
authorizationDate: DateTime (optional)
```

### Condition Assessment
```typescript
conditionBefore: Enum {excellent, good, fair, poor}
conditionAfter: Enum {excellent, good, fair, poor}
conditionNotes: Text (optional)
damageReported: Boolean DEFAULT: false
damageDescription: Text (optional)
```

### Verification
```typescript
receivedBy: UUID (required)
receivedByName: String (required)
receivedDate: DateTime (required)
receivedTime: Time (required)
verificationMethod: String (optional)
discrepanciesNoted: Boolean DEFAULT: false
discrepancyDetails: Text (optional)
```

### Signatures
```typescript
transferrerSignature: String (required)
transferrerSignatureDate: DateTime (required)
receiverSignature: String (required)
receiverSignatureDate: DateTime (required)
witnessSignature: String (optional)
witnessName: String (optional)
```

### Legal Compliance
```typescript
compliesWithProtocol: Boolean DEFAULT: true
protocolDeviations: Text (optional)
correctiveActions: Text (optional)
```

### Metadata
```typescript
notes: Text (optional)
attachments: String[] (optional)
createdAt: DateTime
updatedAt: DateTime
```

---

## 8️⃣ FILES/DOCUMENTS - 25+ Fields Per File

### Basic Information
```typescript
id: UUID
caseId: UUID (foreign key)
relatedEntityType: Enum {case, victim, perpetrator, witness, evidence}
relatedEntityId: UUID (optional)

fileName: String (required)
originalFileName: String (required)
fileType: Enum {
  medical_report, forensic_report, 
  photo, video, audio, legal_document, 
  statement, other
}
mimeType: String (required)
fileSize: Integer (required)
```

### Storage Information
```typescript
filePath: String (required)
storageProvider: Enum {local, s3, azure, google_cloud}
bucketName: String (optional)
fileUrl: String (optional)
thumbnailUrl: String (optional)
```

### Security
```typescript
encrypted: Boolean DEFAULT: true
encryptionMethod: String (optional)
accessLevel: Enum {public, internal, restricted, confidential}
passwordProtected: Boolean DEFAULT: false
```

### Virus Scanning
```typescript
virusScanned: Boolean DEFAULT: false
virusScanDate: DateTime (optional)
virusScanResult: Enum {clean, infected, suspicious, not_scanned}
virusScanEngine: String (optional)
```

### Metadata
```typescript
uploadedBy: UUID (required)
uploadedByName: String (required)
uploadDate: DateTime (required)
description: Text (optional)
tags: String[] (optional)
category: String (optional)
```

### Document-Specific
```typescript
pageCount: Integer (optional)
documentDate: Date (optional)
documentAuthor: String (optional)
documentNumber: String (optional)
```

### Media-Specific
```typescript
duration: Integer (optional) // seconds
resolution: String (optional)
codec: String (optional)
```

### Version Control
```typescript
version: Integer DEFAULT: 1
previousVersionId: UUID (optional)
isLatestVersion: Boolean DEFAULT: true
```

### Metadata
```typescript
downloadCount: Integer DEFAULT: 0
lastAccessedDate: DateTime (optional)
lastAccessedBy: UUID (optional)
createdAt: DateTime
updatedAt: DateTime
```

---

## 9️⃣ CASE OFFENCES - Legal Charges

### Basic Information
```typescript
id: UUID
caseId: UUID (foreign key)
offenceNumber: String (OFF001, OFF002, etc.)

offenceName: String (required)
offenceCode: String (optional)
offenceCategory: String (optional)
```

### Legal Details
```typescript
law: String (required) // e.g., "Section 283 Penal Code"
section: String (optional)
act: String (optional) // e.g., "VAPPA", "CRA"
penalty: Text (required)
minimumSentence: String (optional)
maximumSentence: String (optional)
```

### Charge Details
```typescript
chargeDate: DateTime (optional)
chargeNumber: String (optional)
chargingAuthority: String (optional)
chargedBy: UUID (optional)
```

### Evidence
```typescript
evidenceIds: UUID[] (optional)
witnessIds: UUID[] (optional)
supportingDocuments: String[] (optional)
```

### Plea Status
```typescript
pleaEntered: Boolean DEFAULT: false
pleaDate: DateTime (optional)
pleaType: Enum {guilty, not_guilty, no_contest, not_entered}
pleaBargain: Boolean DEFAULT: false
pleaBargainDetails: Text (optional)
```

### Trial Information
```typescript
trialDate: DateTime (optional)
trialLocation: String (optional)
prosecutorId: UUID (optional)
defenseAttorney: String (optional)
judgeName: String (optional)
```

### Verdict
```typescript
verdictReached: Boolean DEFAULT: false
verdictDate: DateTime (optional)
verdict: Enum {guilty, not_guilty, dismissed, acquitted}
verdictDetails: Text (optional)
```

### Sentence
```typescript
sentenced: Boolean DEFAULT: false
sentenceDate: DateTime (optional)
sentenceType: Enum {
  custodial, non_custodial, fine, 
  probation, community_service, suspended
}
sentenceDuration: String (optional)
fineAmount: Decimal (optional)
sentenceDetails: Text (optional)
```

### Appeal Status
```typescript
appealFiled: Boolean DEFAULT: false
appealDate: DateTime (optional)
appealOutcome: String (optional)
appealDetails: Text (optional)
```

### Metadata
```typescript
notes: Text (optional)
createdAt: DateTime
updatedAt: DateTime
```

---

## 🔟 CASE SERVICES - Service Referrals

### Basic Information
```typescript
id: UUID
caseId: UUID (foreign key)
victimId: UUID (optional)
serviceNumber: String (SRV001, SRV002, etc.)

serviceType: Enum {
  medical, psychological, legal, shelter, 
  financial, vocational, educational, other
}
serviceCategory: String (optional)
serviceName: String (required)
```

### Provider Information
```typescript
providerName: String (required)
providerType: Enum {government, ngo, private, individual}
providerContact: String (optional)
providerAddress: Text (optional)
providerEmail: String (optional)
providerPhone: String (optional)
```

### Referral Details
```typescript
referralDate: DateTime (required)
referredBy: UUID (required)
referredByName: String (required)
referralReason: Text (required)
urgency: Enum {low, medium, high, urgent} DEFAULT: medium
```

### Appointment Details
```typescript
appointmentScheduled: Boolean DEFAULT: false
appointmentDate: DateTime (optional)
appointmentTime: Time (optional)
appointmentLocation: String (optional)
appointmentConfirmed: Boolean DEFAULT: false
appointmentAttended: Boolean DEFAULT: false
appointmentOutcome: Text (optional)
```

### Service Delivery
```typescript
serviceStartDate: DateTime (optional)
serviceEndDate: DateTime (optional)
serviceDuration: Integer (optional) // days
sessionsPlanned: Integer (optional)
sessionsCompleted: Integer DEFAULT: 0
serviceStatus: Enum {
  pending, active, completed, 
  cancelled, declined
} DEFAULT: pending
```

### Cost Tracking
```typescript
estimatedCost: Decimal (optional)
actualCost: Decimal (optional)
fundingSource: String (optional)
paymentStatus: Enum {
  not_applicable, pending, paid, 
  partially_paid, waived
}
```

### Outcome & Feedback
```typescript
outcomeAchieved: Boolean (optional)
outcomeDescription: Text (optional)
beneficiarySatisfaction: Enum {
  very_dissatisfied, dissatisfied, 
  neutral, satisfied, very_satisfied
} (optional)
feedback: Text (optional)
followUpRequired: Boolean DEFAULT: false
followUpDate: DateTime (optional)
```

### Metadata
```typescript
notes: Text (optional)
createdAt: DateTime
updatedAt: DateTime
```

---

## 1️⃣1️⃣ CASE CIVIL SOCIETIES - NGO Partnerships

### Basic Information
```typescript
id: UUID
caseId: UUID (foreign key)
partnershipNumber: String (NGO001, NGO002, etc.)

ngoName: String (required)
ngoType: String (optional)
ngoRegistrationNumber: String (optional)
```

### Contact Information
```typescript
contactPerson: String (required)
contactTitle: String (optional)
contactEmail: String (optional)
contactPhone: String (required)
officeAddress: Text (optional)
```

### Referral Details
```typescript
referralDate: DateTime (required)
referredBy: UUID (required)
referralReason: Text (required)
servicesRequested: String[] (required)
```

### Support Duration
```typescript
supportStartDate: DateTime (required)
supportEndDate: DateTime (optional)
supportDuration: Integer (optional) // months
supportFrequency: Enum {
  one_time, weekly, bi_weekly, 
  monthly, quarterly, ongoing
}
```

### Progress Tracking
```typescript
progressReports: JSON[] {
  reportDate: DateTime,
  reportedBy: String,
  activities: Text,
  outcomes: Text,
  challenges: Text,
  nextSteps: Text
}

milestonesAchieved: String[] (optional)
challengesFaced: Text (optional)
```

### Final Report
```typescript
finalReportSubmitted: Boolean DEFAULT: false
finalReportDate: DateTime (optional)
finalReportPath: String (optional)
overallOutcome: Text (optional)
recommendationsForFuture: Text (optional)
satisfactionRating: Enum {
  poor, fair, good, excellent
} (optional)
```

### Metadata
```typescript
notes: Text (optional)
createdAt: DateTime
updatedAt: DateTime
```

---

## 1️⃣2️⃣ CHAT MESSAGES - Team Communication

### Basic Information
```typescript
id: UUID
caseId: UUID (foreign key)
messageNumber: Integer (auto-increment)

senderId: UUID (required)
senderName: String (required)
senderRole: String (optional)
```

### Message Content
```typescript
messageText: Text (required)
messageType: Enum {
  text, file, image, video, 
  audio, system, notification
} DEFAULT: text

isSystemMessage: Boolean DEFAULT: false
isImportant: Boolean DEFAULT: false
isPinned: Boolean DEFAULT: false
```

### File Attachments
```typescript
attachments: JSON[] {
  fileId: UUID,
  fileName: String,
  fileType: String,
  fileSize: Integer,
  fileUrl: String
}
```

### Interaction
```typescript
readBy: UUID[] (optional)
readReceipts: JSON[] {
  userId: UUID,
  userName: String,
  readAt: DateTime
}

reactions: JSON[] {
  userId: UUID,
  userName: String,
  reactionType: Enum {like, love, helpful, noted},
  reactionDate: DateTime
}
```

### Threading
```typescript
replyToMessageId: UUID (optional)
threadId: UUID (optional)
isThreadStarter: Boolean DEFAULT: false
threadRepliesCount: Integer DEFAULT: 0
```

### Pinned Messages
```typescript
pinnedBy: UUID (optional)
pinnedByName: String (optional)
pinnedAt: DateTime (optional)
pinnedReason: Text (optional)
```

### Metadata
```typescript
editedAt: DateTime (optional)
editedBy: UUID (optional)
deletedAt: DateTime (optional)
deletedBy: UUID (optional)
isDeleted: Boolean DEFAULT: false
createdAt: DateTime
updatedAt: DateTime
```

---

## 1️⃣3️⃣ AUDIT LOGS - Activity Tracking

### Basic Information
```typescript
id: UUID
caseId: UUID (optional)
userId: UUID (required)
userName: String (required)
userRole: String (required)
```

### Action Details
```typescript
action: Enum {
  create, read, update, delete, 
  approve, reject, assign, transfer, 
  export, print, share, login, logout
}

entityType: Enum {
  case, victim, perpetrator, witness, 
  evidence, document, user, system
}

entityId: UUID (optional)
entityName: String (optional)
```

### Change Tracking
```typescript
changesMade: JSON {
  field: String,
  oldValue: Any,
  newValue: Any
}

affectedFields: String[] (optional)
```

### Context
```typescript
ipAddress: String (optional)
userAgent: String (optional)
location: String (optional)
deviceType: String (optional)
```

### Security
```typescript
securityLevel: Enum {low, medium, high, critical}
suspicious: Boolean DEFAULT: false
flaggedForReview: Boolean DEFAULT: false
reviewedBy: UUID (optional)
reviewedAt: DateTime (optional)
```

### Metadata
```typescript
description: Text (optional)
notes: Text (optional)
timestamp: DateTime (required)
sessionId: String (optional)
```

---

## 📊 ENTITY RELATIONSHIPS

```
CASE (1)
├── Victims (1:Many)
├── Perpetrators (1:Many)
├── Witnesses (1:Many)
├── Evidence (1:Many)
│   └── Chain of Custody (1:1)
│       └── Custody Transfers (1:Many)
├── Files/Documents (1:Many)
├── Case Offences (1:Many)
├── Case Services (1:Many)
├── Case Civil Societies (1:Many)
├── Chat Messages (1:Many)
└── Audit Logs (1:Many)
```

---

## 🎯 IMPLEMENTATION PRIORITY

### Phase 1 (Core) - Immediate
1. ✅ Case (Core Entity)
2. ✅ Victim(s)
3. ✅ Perpetrator(s)
4. ✅ Evidence
5. ✅ Audit Logs

### Phase 2 (Extended) - Next
6. Witnesses
7. Case Offences
8. Files/Documents
9. Chain of Custody
10. Custody Transfers

### Phase 3 (Advanced) - Later
11. Case Services
12. Case Civil Societies
13. Chat Messages

---

## 📝 SUMMARY

**Total Entities**: 13 core + 6 supporting = **19 entities**
**Total Fields**: 300-500+ fields
**Minimum Required**: 4 fields only
**Recommended**: 10-15 fields for complete case

**Status**: ✅ Comprehensive System Documented
**Version**: 3.0.0
**Last Updated**: November 2024

