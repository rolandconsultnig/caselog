# Phase 2 Quick Reference Guide

Quick reference for using Phase 2 entities in the National SGBV Case Portal.

---

## 🎯 Quick Links

- [Witness Management](#witness-management)
- [Chain of Custody](#chain-of-custody)
- [Custody Transfers](#custody-transfers)
- [File Management](#file-management)
- [Legal Charges](#legal-charges)

---

## 👁️ Witness Management

### Create a Witness

```typescript
const witness = await prisma.witness.create({
  data: {
    caseId: "case-123",
    witnessNumber: "W001",
    firstName: "John",
    middleName: "Michael",
    lastName: "Doe",
    age: 35,
    gender: "MALE",
    witnessType: "EYEWITNESS",
    
    // Contact
    phoneNumber: "+234-800-000-0000",
    email: "john.doe@example.com",
    address: "123 Main Street",
    city: "Lagos",
    state: "Lagos",
    
    // Statement
    statementText: "I witnessed the incident on...",
    statementDate: new Date(),
    statementVerified: true,
    
    // Assessment
    credibilityRating: "HIGH",
    availableForTestimony: true,
    protectionLevel: "MEDIUM",
    threatLevel: "LOW"
  }
});
```

### Query Witnesses

```typescript
// Get all witnesses for a case
const witnesses = await prisma.witness.findMany({
  where: { caseId: "case-123" },
  orderBy: { witnessNumber: 'asc' }
});

// Get eyewitnesses only
const eyewitnesses = await prisma.witness.findMany({
  where: {
    caseId: "case-123",
    witnessType: "EYEWITNESS"
  }
});

// Get high-credibility witnesses
const reliableWitnesses = await prisma.witness.findMany({
  where: {
    caseId: "case-123",
    credibilityRating: "HIGH",
    availableForTestimony: true
  }
});
```

### Witness Types
- `EYEWITNESS` - Saw the incident
- `CHARACTER` - Testifies about character
- `EXPERT` - Expert testimony
- `HEARSAY` - Indirect information

---

## 🔗 Chain of Custody

### Create Chain of Custody

```typescript
const chainOfCustody = await prisma.chainOfCustody.create({
  data: {
    evidenceId: "evidence-123",
    transferNumber: "COC001",
    
    // Current custodian
    currentCustodian: "user-456",
    currentCustodianName: "Officer John Smith",
    currentCustodianTitle: "Evidence Officer",
    currentCustodianAgency: "Lagos State Police",
    currentCustodianBadgeNumber: "12345",
    
    // Documentation
    transferHistory: [],
    documentationComplete: true,
    allSignaturesObtained: true,
    
    // Integrity
    sealIntact: true,
    tamperEvident: false,
    compliesWithStandards: true
  }
});
```

### Query Chain of Custody

```typescript
// Get chain for specific evidence
const chain = await prisma.chainOfCustody.findUnique({
  where: { evidenceId: "evidence-123" },
  include: {
    evidence: true,
    custodyTransfers: {
      orderBy: { transferDate: 'desc' }
    }
  }
});

// Check integrity issues
const integrityIssues = await prisma.chainOfCustody.findMany({
  where: {
    OR: [
      { sealIntact: false },
      { tamperEvident: true },
      { compliesWithStandards: false }
    ]
  }
});
```

---

## 📦 Custody Transfers

### Create a Transfer

```typescript
const transfer = await prisma.custodyTransfer.create({
  data: {
    chainOfCustodyId: "coc-123",
    transferNumber: "T001",
    
    // From
    transferredFrom: "user-456",
    transferredFromName: "Officer Smith",
    transferredFromAgency: "Police Department",
    
    // To
    transferredTo: "user-789",
    transferredToName: "Lab Tech Johnson",
    transferredToAgency: "Forensic Lab",
    
    // Details
    transferDate: new Date(),
    transferTime: "14:30",
    transferLocation: "Evidence Room A",
    transferReason: "ANALYSIS",
    reasonDetails: "DNA analysis required",
    
    // Condition
    conditionBefore: "GOOD",
    conditionAfter: "GOOD",
    damageReported: false,
    
    // Verification
    receivedBy: "user-789",
    receivedByName: "Lab Tech Johnson",
    receivedDate: new Date(),
    receivedTime: "15:00",
    discrepanciesNoted: false,
    
    // Signatures
    transferrerSignature: "signature-hash-1",
    transferrerSignatureDate: new Date(),
    receiverSignature: "signature-hash-2",
    receiverSignatureDate: new Date(),
    
    compliesWithProtocol: true
  }
});
```

### Transfer Reasons
- `ANALYSIS` - Forensic analysis
- `STORAGE` - Long-term storage
- `COURT_PRESENTATION` - Court evidence
- `RETURN` - Return to custodian
- `DISPOSAL` - Authorized disposal
- `OTHER` - Other reasons

---

## 📄 File Management

### Upload a File

```typescript
const file = await prisma.caseFile.create({
  data: {
    caseId: "case-123",
    relatedEntityType: "evidence",
    relatedEntityId: "evidence-123",
    
    // File info
    fileName: "medical-report-2025-11-11.pdf",
    originalFileName: "Medical Report - Victim Name.pdf",
    fileType: "MEDICAL_REPORT",
    mimeType: "application/pdf",
    fileSize: 2048000, // bytes
    
    // Storage
    filePath: "/uploads/2025/11/medical-report.pdf",
    storageProvider: "LOCAL",
    fileUrl: "https://example.com/files/medical-report.pdf",
    
    // Security
    encrypted: true,
    encryptionMethod: "AES-256",
    accessLevel: "RESTRICTED",
    passwordProtected: false,
    
    // Virus scan
    virusScanned: true,
    virusScanDate: new Date(),
    virusScanResult: "CLEAN",
    virusScanEngine: "ClamAV",
    
    // Metadata
    uploadedBy: "user-123",
    uploadedByName: "Dr. Jane Smith",
    description: "Initial medical examination report",
    tags: ["medical", "examination", "urgent"],
    category: "Medical Reports",
    
    // Document specific
    pageCount: 5,
    documentDate: new Date(),
    documentAuthor: "Dr. Jane Smith",
    documentNumber: "MED-2025-001"
  }
});
```

### Query Files

```typescript
// Get all files for a case
const files = await prisma.caseFile.findMany({
  where: { caseId: "case-123" },
  orderBy: { uploadDate: 'desc' }
});

// Get medical reports
const medicalReports = await prisma.caseFile.findMany({
  where: {
    caseId: "case-123",
    fileType: "MEDICAL_REPORT"
  }
});

// Get files by entity
const evidenceFiles = await prisma.caseFile.findMany({
  where: {
    relatedEntityType: "evidence",
    relatedEntityId: "evidence-123"
  }
});

// Get restricted files
const restrictedFiles = await prisma.caseFile.findMany({
  where: {
    caseId: "case-123",
    accessLevel: "RESTRICTED"
  }
});
```

### File Types
- `MEDICAL_REPORT` - Medical examination reports
- `FORENSIC_REPORT` - Lab analysis reports
- `PHOTO` - Photographs
- `VIDEO` - Video recordings
- `AUDIO` - Audio recordings
- `LEGAL_DOCUMENT` - Legal documents
- `STATEMENT` - Written statements
- `OTHER` - Other file types

### Access Levels
- `PUBLIC` - Publicly accessible
- `INTERNAL` - Internal staff only
- `RESTRICTED` - Restricted access
- `CONFIDENTIAL` - Highly confidential

---

## ⚖️ Legal Charges

### Create a Charge

```typescript
const offence = await prisma.caseOffence.create({
  data: {
    caseId: "case-123",
    offenceNumber: "OFF001",
    
    // Basic info
    offenceName: "Rape",
    offenceCode: "RAPE-001",
    offenceCategory: "Sexual Violence",
    
    // Legal details
    law: "Section 283 Penal Code",
    section: "283",
    act: "Penal Code",
    penalty: "Life imprisonment and fine",
    minimumSentence: "Life imprisonment",
    maximumSentence: "Life imprisonment",
    
    // Charge
    chargeDate: new Date(),
    chargeNumber: "CHG-2025-001",
    chargingAuthority: "Director of Public Prosecutions",
    chargedBy: "user-prosecutor-123",
    
    // Evidence
    evidenceIds: ["evidence-1", "evidence-2"],
    witnessIds: ["witness-1", "witness-2"],
    supportingDocuments: ["doc-1", "doc-2"],
    
    // Plea
    pleaEntered: false,
    pleaType: "NOT_ENTERED",
    pleaBargain: false,
    
    // Trial
    trialDate: new Date("2025-12-01"),
    trialLocation: "High Court, Lagos",
    prosecutorId: "user-prosecutor-123",
    judgeName: "Hon. Justice A. B. Smith"
  }
});
```

### Update Plea

```typescript
await prisma.caseOffence.update({
  where: { id: "offence-123" },
  data: {
    pleaEntered: true,
    pleaDate: new Date(),
    pleaType: "NOT_GUILTY",
    pleaBargain: false
  }
});
```

### Record Verdict

```typescript
await prisma.caseOffence.update({
  where: { id: "offence-123" },
  data: {
    verdictReached: true,
    verdictDate: new Date(),
    verdict: "GUILTY",
    verdictDetails: "Found guilty on all counts"
  }
});
```

### Record Sentence

```typescript
await prisma.caseOffence.update({
  where: { id: "offence-123" },
  data: {
    sentenced: true,
    sentenceDate: new Date(),
    sentenceType: "CUSTODIAL",
    sentenceDuration: "Life imprisonment",
    sentenceDetails: "Life imprisonment without parole"
  }
});
```

### Query Charges

```typescript
// Get all charges for a case
const charges = await prisma.caseOffence.findMany({
  where: { caseId: "case-123" },
  orderBy: { chargeDate: 'asc' }
});

// Get charges with guilty verdict
const convictions = await prisma.caseOffence.findMany({
  where: {
    caseId: "case-123",
    verdict: "GUILTY"
  }
});

// Get pending trials
const pendingTrials = await prisma.caseOffence.findMany({
  where: {
    verdictReached: false,
    trialDate: { gte: new Date() }
  }
});
```

### Plea Types
- `GUILTY` - Guilty plea
- `NOT_GUILTY` - Not guilty plea
- `NO_CONTEST` - No contest
- `NOT_ENTERED` - Plea not yet entered

### Verdict Types
- `GUILTY` - Guilty verdict
- `NOT_GUILTY` - Not guilty verdict
- `DISMISSED` - Case dismissed
- `ACQUITTED` - Acquitted

### Sentence Types
- `CUSTODIAL` - Prison sentence
- `NON_CUSTODIAL` - Non-prison sentence
- `FINE` - Monetary fine
- `PROBATION` - Probation
- `COMMUNITY_SERVICE` - Community service
- `SUSPENDED` - Suspended sentence

---

## 🔍 Complex Queries

### Get Complete Case with All Phase 2 Data

```typescript
const completeCase = await prisma.case.findUnique({
  where: { id: "case-123" },
  include: {
    // Phase 1
    victims: true,
    perpetrators: true,
    evidence: {
      include: {
        chainOfCustody: {
          include: {
            custodyTransfers: true
          }
        }
      }
    },
    
    // Phase 2
    witnesses: true,
    files: true,
    offences: true,
    
    // Audit
    auditLogs: {
      orderBy: { timestamp: 'desc' },
      take: 10
    }
  }
});
```

### Get Case Evidence with Full Chain of Custody

```typescript
const evidenceWithChain = await prisma.evidence.findMany({
  where: { caseId: "case-123" },
  include: {
    chainOfCustody: {
      include: {
        custodyTransfers: {
          orderBy: { transferDate: 'desc' }
        }
      }
    }
  }
});
```

### Get All Files for a Victim

```typescript
const victimFiles = await prisma.caseFile.findMany({
  where: {
    relatedEntityType: "victim",
    relatedEntityId: "victim-123"
  },
  orderBy: { uploadDate: 'desc' }
});
```

### Get Trial-Ready Cases

```typescript
const trialReadyCases = await prisma.case.findMany({
  where: {
    status: "PENDING_COURT",
    offences: {
      some: {
        trialDate: { gte: new Date() }
      }
    }
  },
  include: {
    offences: {
      where: {
        trialDate: { gte: new Date() }
      }
    },
    witnesses: {
      where: {
        availableForTestimony: true
      }
    },
    evidence: {
      where: {
        admissible: true
      }
    }
  }
});
```

---

## 📊 Statistics Queries

### Witness Statistics

```typescript
// Count witnesses by type
const witnessByType = await prisma.witness.groupBy({
  by: ['witnessType'],
  _count: true,
  where: { caseId: "case-123" }
});

// Count high-credibility witnesses
const highCredibilityCount = await prisma.witness.count({
  where: {
    caseId: "case-123",
    credibilityRating: "HIGH"
  }
});
```

### Evidence Transfer Statistics

```typescript
// Count transfers per evidence
const transferCounts = await prisma.custodyTransfer.groupBy({
  by: ['chainOfCustodyId'],
  _count: true
});

// Count transfers by reason
const transfersByReason = await prisma.custodyTransfer.groupBy({
  by: ['transferReason'],
  _count: true
});
```

### File Statistics

```typescript
// Count files by type
const filesByType = await prisma.caseFile.groupBy({
  by: ['fileType'],
  _count: true,
  where: { caseId: "case-123" }
});

// Total file size
const totalSize = await prisma.caseFile.aggregate({
  _sum: { fileSize: true },
  where: { caseId: "case-123" }
});
```

### Legal Charge Statistics

```typescript
// Count charges by verdict
const verdictStats = await prisma.caseOffence.groupBy({
  by: ['verdict'],
  _count: true
});

// Count pending trials
const pendingTrials = await prisma.caseOffence.count({
  where: {
    verdictReached: false,
    trialDate: { gte: new Date() }
  }
});
```

---

## 🔐 Security Best Practices

### File Access Control

```typescript
// Check user access level before serving file
async function canAccessFile(userId: string, fileId: string) {
  const file = await prisma.caseFile.findUnique({
    where: { id: fileId }
  });
  
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  // Implement access level checks
  if (file.accessLevel === "CONFIDENTIAL") {
    return user.accessLevel === "APP_ADMIN" || 
           user.accessLevel === "SUPER_ADMIN";
  }
  
  return true;
}
```

### Chain of Custody Verification

```typescript
// Verify chain integrity
async function verifyChainIntegrity(evidenceId: string) {
  const chain = await prisma.chainOfCustody.findUnique({
    where: { evidenceId },
    include: { custodyTransfers: true }
  });
  
  return {
    sealIntact: chain.sealIntact,
    tamperEvident: chain.tamperEvident,
    compliant: chain.compliesWithStandards,
    transferCount: chain.custodyTransfers.length,
    lastVerified: chain.lastVerifiedDate
  };
}
```

---

## 🎯 Common Workflows

### Complete Evidence Workflow

```typescript
// 1. Create evidence
const evidence = await prisma.evidence.create({
  data: { /* evidence data */ }
});

// 2. Create chain of custody
const chain = await prisma.chainOfCustody.create({
  data: {
    evidenceId: evidence.id,
    transferNumber: "COC001",
    currentCustodian: "user-123",
    currentCustodianName: "Officer Smith"
  }
});

// 3. Transfer to lab
const transfer = await prisma.custodyTransfer.create({
  data: {
    chainOfCustodyId: chain.id,
    transferReason: "ANALYSIS",
    /* transfer details */
  }
});

// 4. Upload forensic report
const report = await prisma.caseFile.create({
  data: {
    caseId: evidence.caseId,
    relatedEntityType: "evidence",
    relatedEntityId: evidence.id,
    fileType: "FORENSIC_REPORT",
    /* file details */
  }
});
```

### Complete Legal Charge Workflow

```typescript
// 1. Create charge
const charge = await prisma.caseOffence.create({
  data: {
    caseId: "case-123",
    offenceName: "Rape",
    law: "Section 283 Penal Code",
    /* charge details */
  }
});

// 2. Link evidence and witnesses
await prisma.caseOffence.update({
  where: { id: charge.id },
  data: {
    evidenceIds: ["evidence-1", "evidence-2"],
    witnessIds: ["witness-1", "witness-2"]
  }
});

// 3. Record plea
await prisma.caseOffence.update({
  where: { id: charge.id },
  data: {
    pleaEntered: true,
    pleaType: "NOT_GUILTY"
  }
});

// 4. Record verdict
await prisma.caseOffence.update({
  where: { id: charge.id },
  data: {
    verdictReached: true,
    verdict: "GUILTY"
  }
});

// 5. Record sentence
await prisma.caseOffence.update({
  where: { id: charge.id },
  data: {
    sentenced: true,
    sentenceType: "CUSTODIAL",
    sentenceDuration: "Life imprisonment"
  }
});
```

---

## 📚 Related Documentation

- [PHASE2_IMPLEMENTATION_COMPLETE.md](./PHASE2_IMPLEMENTATION_COMPLETE.md) - Full Phase 2 details
- [COMPREHENSIVE_CASE_SYSTEM.md](./COMPREHENSIVE_CASE_SYSTEM.md) - Complete system overview
- [API.md](./API.md) - API documentation

---

**Version**: 2.0.0  
**Last Updated**: November 11, 2025

