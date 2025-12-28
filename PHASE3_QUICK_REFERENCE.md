# Phase 3 Quick Reference Guide

Quick reference for using Phase 3 entities in the National SGBV Case Portal.

---

## 🎯 Quick Links

- [Service Referrals](#service-referrals)
- [NGO Partnerships](#ngo-partnerships)
- [Team Communication](#team-communication)

---

## 🏥 Service Referrals

### Create a Service Referral

```typescript
const service = await prisma.caseService.create({
  data: {
    caseId: "case-123",
    victimId: "victim-123",
    serviceNumber: "SRV001",
    
    // Basic info
    serviceType: "MEDICAL",
    serviceCategory: "Emergency Care",
    serviceName: "Medical Examination",
    
    // Provider
    providerName: "Lagos State Hospital",
    providerType: "GOVERNMENT",
    providerContact: "Dr. Jane Smith",
    providerEmail: "jane@hospital.gov.ng",
    providerPhone: "+234-800-000-0000",
    providerAddress: "123 Hospital Road, Lagos",
    
    // Referral
    referralDate: new Date(),
    referredBy: "user-123",
    referredByName: "Officer Smith",
    referralReason: "Victim requires immediate medical examination",
    urgency: "HIGH",
    
    // Appointment
    appointmentScheduled: true,
    appointmentDate: new Date("2025-11-12"),
    appointmentTime: "10:00 AM",
    appointmentLocation: "Emergency Department",
    appointmentConfirmed: true,
    
    // Service delivery
    serviceStatus: "PENDING",
    sessionsPlanned: 1,
    
    // Cost
    estimatedCost: 50000.00,
    fundingSource: "Government Fund",
    paymentStatus: "NOT_APPLICABLE"
  }
});
```

### Update Service Status

```typescript
// Mark appointment as attended
await prisma.caseService.update({
  where: { id: "service-123" },
  data: {
    appointmentAttended: true,
    serviceStartDate: new Date(),
    serviceStatus: "ACTIVE"
  }
});

// Complete service
await prisma.caseService.update({
  where: { id: "service-123" },
  data: {
    serviceEndDate: new Date(),
    serviceStatus: "COMPLETED",
    sessionsCompleted: 1,
    actualCost: 45000.00,
    outcomeAchieved: true,
    outcomeDescription: "Medical examination completed successfully",
    beneficiarySatisfaction: "SATISFIED",
    feedback: "Excellent service provided"
  }
});
```

### Query Services

```typescript
// Get all services for a case
const services = await prisma.caseService.findMany({
  where: { caseId: "case-123" },
  orderBy: { referralDate: 'desc' }
});

// Get pending services
const pendingServices = await prisma.caseService.findMany({
  where: {
    serviceStatus: "PENDING",
    appointmentDate: { gte: new Date() }
  }
});

// Get services by type
const medicalServices = await prisma.caseService.findMany({
  where: {
    caseId: "case-123",
    serviceType: "MEDICAL"
  }
});

// Get completed services with satisfaction
const completedServices = await prisma.caseService.findMany({
  where: {
    serviceStatus: "COMPLETED",
    beneficiarySatisfaction: { not: null }
  }
});
```

### Service Types
- `MEDICAL` - Medical services
- `PSYCHOLOGICAL` - Psychological/counseling services
- `LEGAL` - Legal services
- `SHELTER` - Shelter services
- `FINANCIAL` - Financial assistance
- `VOCATIONAL` - Vocational training
- `EDUCATIONAL` - Educational support
- `OTHER` - Other services

### Provider Types
- `GOVERNMENT` - Government agency
- `NGO` - Non-governmental organization
- `PRIVATE` - Private provider
- `INDIVIDUAL` - Individual provider

### Service Status
- `PENDING` - Awaiting service
- `ACTIVE` - Service in progress
- `COMPLETED` - Service completed
- `CANCELLED` - Service cancelled
- `DECLINED` - Service declined by victim

---

## 🤝 NGO Partnerships

### Create NGO Partnership

```typescript
const ngoPartnership = await prisma.caseCivilSociety.create({
  data: {
    caseId: "case-123",
    partnershipNumber: "NGO001",
    
    // NGO info
    ngoName: "Women's Rights Initiative",
    ngoType: "Human Rights",
    ngoRegistrationNumber: "NGO-2020-12345",
    
    // Contact
    contactPerson: "Jane Doe",
    contactTitle: "Program Director",
    contactEmail: "jane@wri.org",
    contactPhone: "+234-800-111-1111",
    officeAddress: "456 NGO Street, Lagos",
    
    // Referral
    referralDate: new Date(),
    referredBy: "user-123",
    referralReason: "Victim needs shelter and counseling services",
    servicesRequested: [
      "Shelter",
      "Counseling",
      "Legal Aid",
      "Vocational Training"
    ],
    
    // Support
    supportStartDate: new Date(),
    supportFrequency: "WEEKLY",
    
    // Progress
    progressReports: [],
    milestonesAchieved: []
  }
});
```

### Add Progress Report

```typescript
// Get current partnership
const partnership = await prisma.caseCivilSociety.findUnique({
  where: { id: "ngo-123" }
});

// Add new progress report
const newReport = {
  reportDate: new Date().toISOString(),
  reportedBy: "Jane Doe",
  activities: "Provided shelter and counseling sessions",
  outcomes: "Victim showing improvement in mental health",
  challenges: "Transportation to sessions is difficult",
  nextSteps: "Arrange transportation support"
};

await prisma.caseCivilSociety.update({
  where: { id: "ngo-123" },
  data: {
    progressReports: [...partnership.progressReports, newReport],
    milestonesAchieved: [
      ...partnership.milestonesAchieved,
      "Completed 4 counseling sessions"
    ]
  }
});
```

### Submit Final Report

```typescript
await prisma.caseCivilSociety.update({
  where: { id: "ngo-123" },
  data: {
    supportEndDate: new Date(),
    finalReportSubmitted: true,
    finalReportDate: new Date(),
    finalReportPath: "/reports/ngo-final-report.pdf",
    overallOutcome: "Victim successfully reintegrated into community",
    recommendationsForFuture: "Continue follow-up support for 6 months",
    satisfactionRating: "EXCELLENT"
  }
});
```

### Query NGO Partnerships

```typescript
// Get all partnerships for a case
const partnerships = await prisma.caseCivilSociety.findMany({
  where: { caseId: "case-123" },
  orderBy: { supportStartDate: 'desc' }
});

// Get active partnerships
const activePartnerships = await prisma.caseCivilSociety.findMany({
  where: {
    supportEndDate: null,
    finalReportSubmitted: false
  }
});

// Get partnerships by NGO
const ngoPartnerships = await prisma.caseCivilSociety.findMany({
  where: {
    ngoName: { contains: "Women's Rights" }
  }
});
```

### Support Frequency
- `ONE_TIME` - One-time support
- `WEEKLY` - Weekly support
- `BI_WEEKLY` - Bi-weekly support
- `MONTHLY` - Monthly support
- `QUARTERLY` - Quarterly support
- `ONGOING` - Ongoing support

### Satisfaction Ratings
- `POOR` - Poor service
- `FAIR` - Fair service
- `GOOD` - Good service
- `EXCELLENT` - Excellent service

---

## 💬 Team Communication

### Send a Message

```typescript
const message = await prisma.chatMessage.create({
  data: {
    caseId: "case-123",
    messageNumber: 1,
    
    // Sender
    senderId: "user-123",
    senderName: "Officer Smith",
    senderRole: "Investigator",
    
    // Content
    messageText: "Evidence collected and sent to lab for analysis",
    messageType: "TEXT",
    isImportant: true,
    
    // Interaction
    attachments: [],
    readBy: [],
    readReceipts: [],
    reactions: []
  }
});
```

### Send Message with Attachment

```typescript
const messageWithFile = await prisma.chatMessage.create({
  data: {
    caseId: "case-123",
    messageNumber: 2,
    senderId: "user-456",
    senderName: "Lab Tech Johnson",
    senderRole: "Forensic Analyst",
    messageText: "Forensic analysis complete. See attached report.",
    messageType: "FILE",
    attachments: [
      {
        fileId: "file-123",
        fileName: "forensic-report.pdf",
        fileType: "application/pdf",
        fileSize: 1024000,
        fileUrl: "/uploads/forensic-report.pdf"
      }
    ],
    readBy: [],
    readReceipts: [],
    reactions: []
  }
});
```

### Mark Message as Read

```typescript
// Get message
const message = await prisma.chatMessage.findUnique({
  where: { id: "message-123" }
});

// Add read receipt
const readReceipt = {
  userId: "user-789",
  userName: "Prosecutor Adams",
  readAt: new Date().toISOString()
};

await prisma.chatMessage.update({
  where: { id: "message-123" },
  data: {
    readBy: [...message.readBy, "user-789"],
    readReceipts: [...message.readReceipts, readReceipt]
  }
});
```

### Add Reaction

```typescript
// Get message
const message = await prisma.chatMessage.findUnique({
  where: { id: "message-123" }
});

// Add reaction
const reaction = {
  userId: "user-789",
  userName: "Prosecutor Adams",
  reactionType: "HELPFUL",
  reactionDate: new Date().toISOString()
};

await prisma.chatMessage.update({
  where: { id: "message-123" },
  data: {
    reactions: [...message.reactions, reaction]
  }
});
```

### Reply to Message (Threading)

```typescript
const reply = await prisma.chatMessage.create({
  data: {
    caseId: "case-123",
    messageNumber: 3,
    senderId: "user-789",
    senderName: "Prosecutor Adams",
    senderRole: "Prosecutor",
    messageText: "Thanks for the report. This will be key evidence.",
    messageType: "TEXT",
    replyToMessageId: "message-123",
    threadId: "message-123",
    attachments: [],
    readBy: [],
    readReceipts: [],
    reactions: []
  }
});

// Update original message thread count
await prisma.chatMessage.update({
  where: { id: "message-123" },
  data: {
    isThreadStarter: true,
    threadRepliesCount: { increment: 1 }
  }
});
```

### Pin Message

```typescript
await prisma.chatMessage.update({
  where: { id: "message-123" },
  data: {
    isPinned: true,
    pinnedBy: "user-123",
    pinnedByName: "Officer Smith",
    pinnedAt: new Date(),
    pinnedReason: "Important evidence update"
  }
});
```

### Edit Message

```typescript
await prisma.chatMessage.update({
  where: { id: "message-123" },
  data: {
    messageText: "Evidence collected and sent to lab for DNA analysis",
    editedAt: new Date(),
    editedBy: "user-123"
  }
});
```

### Delete Message (Soft Delete)

```typescript
await prisma.chatMessage.update({
  where: { id: "message-123" },
  data: {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: "user-123"
  }
});
```

### Query Messages

```typescript
// Get all messages for a case
const messages = await prisma.chatMessage.findMany({
  where: {
    caseId: "case-123",
    isDeleted: false
  },
  orderBy: { createdAt: 'asc' }
});

// Get pinned messages
const pinnedMessages = await prisma.chatMessage.findMany({
  where: {
    caseId: "case-123",
    isPinned: true,
    isDeleted: false
  }
});

// Get unread messages for user
const unreadMessages = await prisma.chatMessage.findMany({
  where: {
    caseId: "case-123",
    isDeleted: false,
    NOT: {
      readBy: { has: "user-789" }
    }
  }
});

// Get thread messages
const threadMessages = await prisma.chatMessage.findMany({
  where: {
    threadId: "message-123",
    isDeleted: false
  },
  orderBy: { createdAt: 'asc' }
});
```

### Message Types
- `TEXT` - Text message
- `FILE` - File attachment
- `IMAGE` - Image attachment
- `VIDEO` - Video attachment
- `AUDIO` - Audio attachment
- `SYSTEM` - System message
- `NOTIFICATION` - Notification

### Reaction Types
- `LIKE` - Like reaction
- `LOVE` - Love reaction
- `HELPFUL` - Helpful reaction
- `NOTED` - Noted reaction

---

## 🔍 Complex Queries

### Get Complete Case with All Phase 3 Data

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
    
    // Phase 3
    services: {
      where: { serviceStatus: { not: "CANCELLED" } }
    },
    civilSocieties: {
      where: { finalReportSubmitted: false }
    },
    chatMessages: {
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 50
    },
    
    // Audit
    auditLogs: {
      orderBy: { timestamp: 'desc' },
      take: 10
    }
  }
});
```

### Get Active Services and Partnerships

```typescript
const activeSupport = await prisma.case.findUnique({
  where: { id: "case-123" },
  include: {
    services: {
      where: {
        serviceStatus: { in: ["PENDING", "ACTIVE"] }
      }
    },
    civilSocieties: {
      where: {
        supportEndDate: null
      }
    }
  }
});
```

### Get Unread Messages Count

```typescript
const unreadCount = await prisma.chatMessage.count({
  where: {
    caseId: "case-123",
    isDeleted: false,
    NOT: {
      readBy: { has: "user-789" }
    }
  }
});
```

---

## 📊 Statistics Queries

### Service Statistics

```typescript
// Count services by type
const servicesByType = await prisma.caseService.groupBy({
  by: ['serviceType'],
  _count: true,
  where: { caseId: "case-123" }
});

// Count services by status
const servicesByStatus = await prisma.caseService.groupBy({
  by: ['serviceStatus'],
  _count: true
});

// Average satisfaction
const avgSatisfaction = await prisma.caseService.aggregate({
  _avg: { sessionsCompleted: true },
  where: {
    serviceStatus: "COMPLETED",
    beneficiarySatisfaction: { not: null }
  }
});
```

### NGO Statistics

```typescript
// Count partnerships by NGO
const partnershipsByNGO = await prisma.caseCivilSociety.groupBy({
  by: ['ngoName'],
  _count: true
});

// Count active partnerships
const activePartnerships = await prisma.caseCivilSociety.count({
  where: {
    supportEndDate: null
  }
});
```

### Message Statistics

```typescript
// Count messages by sender
const messagesBySender = await prisma.chatMessage.groupBy({
  by: ['senderId', 'senderName'],
  _count: true,
  where: {
    caseId: "case-123",
    isDeleted: false
  }
});

// Count pinned messages
const pinnedCount = await prisma.chatMessage.count({
  where: {
    caseId: "case-123",
    isPinned: true,
    isDeleted: false
  }
});
```

---

## 🎯 Common Workflows

### Complete Service Workflow

```typescript
// 1. Create referral
const service = await prisma.caseService.create({
  data: {
    caseId: "case-123",
    serviceType: "MEDICAL",
    providerName: "Hospital",
    referralDate: new Date(),
    urgency: "HIGH"
  }
});

// 2. Schedule appointment
await prisma.caseService.update({
  where: { id: service.id },
  data: {
    appointmentScheduled: true,
    appointmentDate: new Date("2025-11-12"),
    appointmentConfirmed: true
  }
});

// 3. Mark attended
await prisma.caseService.update({
  where: { id: service.id },
  data: {
    appointmentAttended: true,
    serviceStartDate: new Date(),
    serviceStatus: "ACTIVE"
  }
});

// 4. Complete service
await prisma.caseService.update({
  where: { id: service.id },
  data: {
    serviceEndDate: new Date(),
    serviceStatus: "COMPLETED",
    outcomeAchieved: true,
    beneficiarySatisfaction: "SATISFIED"
  }
});
```

### Complete NGO Partnership Workflow

```typescript
// 1. Create partnership
const partnership = await prisma.caseCivilSociety.create({
  data: {
    caseId: "case-123",
    ngoName: "NGO Name",
    contactPerson: "Contact",
    contactPhone: "Phone",
    referralDate: new Date(),
    supportStartDate: new Date()
  }
});

// 2. Add progress reports
await prisma.caseCivilSociety.update({
  where: { id: partnership.id },
  data: {
    progressReports: [
      { reportDate: new Date(), activities: "...", outcomes: "..." }
    ],
    milestonesAchieved: ["Milestone 1"]
  }
});

// 3. Submit final report
await prisma.caseCivilSociety.update({
  where: { id: partnership.id },
  data: {
    supportEndDate: new Date(),
    finalReportSubmitted: true,
    satisfactionRating: "EXCELLENT"
  }
});
```

---

## 📚 Related Documentation

- [PHASE3_IMPLEMENTATION_COMPLETE.md](./PHASE3_IMPLEMENTATION_COMPLETE.md) - Full Phase 3 details
- [COMPREHENSIVE_CASE_SYSTEM.md](./COMPREHENSIVE_CASE_SYSTEM.md) - Complete system overview
- [API.md](./API.md) - API documentation

---

**Version**: 3.0.0  
**Last Updated**: November 11, 2025

