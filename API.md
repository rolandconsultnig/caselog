# API Documentation - CaseLogPro2

Complete API reference for CaseLogPro2 SGBV Case Management System.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All API endpoints (except auth endpoints) require authentication via NextAuth.js session.

### Session Cookie

The application uses HTTP-only session cookies. After successful login, the session cookie is automatically included in subsequent requests.

## Authorization

Access to endpoints is controlled by user access levels:
- **Level 1**: Read only
- **Level 2**: Create cases
- **Level 3**: Approve/reject cases
- **Level 4**: Request deletions
- **Level 5**: Approve deletions
- **Super Admin**: Full system access
- **App Admin**: Application administration

## API Endpoints

### Authentication

#### POST `/api/auth/signin`

Authenticate user and create session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "accessLevel": "LEVEL_2",
    "tenantId": "uuid",
    "tenantName": "Lagos State",
    "tenantCode": "LA",
    "tenantType": "STATE"
  }
}
```

**Error Responses:**
- `401`: Invalid credentials
- `500`: Server error

---

### Cases

#### GET `/api/cases`

List cases with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, CLOSED)
- `tenantId` (string): Filter by tenant (Federal users only)
- `search` (string): Search in case number, victim name, perpetrator name

**Required Permission:** Read access (Level 1+)

**Example Request:**
```
GET /api/cases?page=1&limit=20&status=APPROVED&search=rape
```

**Response (200):**
```json
{
  "cases": [
    {
      "id": "uuid",
      "caseNumber": "LA-2024-123456",
      "status": "APPROVED",
      "formOfSGBV": "RAPE",
      "legalServiceType": "PROSECUTION",
      "victim": {
        "name": "Victim Name",
        "age": 25,
        "gender": "FEMALE"
      },
      "perpetrator": {
        "name": "Perpetrator Name"
      },
      "tenant": {
        "name": "Lagos State",
        "code": "LA"
      },
      "createdBy": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-11-10T10:00:00Z",
      "updatedAt": "2024-11-10T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

#### POST `/api/cases`

Create a new case.

**Required Permission:** Create access (Level 2+)

**Request Body:**
```json
{
  "formOfSGBV": "RAPE",
  "legalServiceType": "PROSECUTION",
  "dateCharged": "2024-01-15",
  "chargeNumber": "CR/123/2024",
  "mojCaseNumber": "MOJ/LA/2024/001",
  "victim": {
    "name": "Victim Name",
    "gender": "FEMALE",
    "age": 25,
    "phoneNumber": "+234-800-000-0000",
    "email": "victim@example.com",
    "nationality": "Nigerian",
    "maritalStatus": "SINGLE",
    "occupation": "Teacher",
    "address": "123 Street, Lagos"
  },
  "perpetrator": {
    "name": "Perpetrator Name",
    "gender": "MALE",
    "age": 35,
    "phoneNumber": "+234-800-000-0001",
    "relationshipWithVictim": "Stranger",
    "address": "456 Street, Lagos"
  },
  "offence": {
    "offenceName": "Rape",
    "offenceCode": "SEC-1-VAPPA",
    "dateOfOffence": "2024-01-10",
    "placeOfOffence": "Lagos, Nigeria",
    "natureOfOffence": "Detailed description of the offence...",
    "applicableLaw": "Section 1 VAPPA",
    "penalty": "Life imprisonment",
    "dateReported": "2024-01-11",
    "suspectArrested": true,
    "dateArrested": "2024-01-12",
    "investigationStatus": "Ongoing"
  }
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "caseNumber": "LA-2024-123456",
  "status": "DRAFT",
  "formOfSGBV": "RAPE",
  "victim": { /* victim details */ },
  "perpetrator": { /* perpetrator details */ },
  "offence": { /* offence details */ },
  "createdAt": "2024-11-10T10:00:00Z"
}
```

**Error Responses:**
- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden (insufficient permissions)
- `500`: Server error

---

#### GET `/api/cases/[id]`

Get detailed information about a specific case.

**Required Permission:** Read access (Level 1+)

**Response (200):**
```json
{
  "id": "uuid",
  "caseNumber": "LA-2024-123456",
  "status": "APPROVED",
  "formOfSGBV": "RAPE",
  "legalServiceType": "PROSECUTION",
  "dateCharged": "2024-01-15T00:00:00Z",
  "chargeNumber": "CR/123/2024",
  "mojCaseNumber": "MOJ/LA/2024/001",
  "victim": {
    "id": "uuid",
    "name": "Victim Name",
    "gender": "FEMALE",
    "age": 25,
    "phoneNumber": "+234-800-000-0000",
    "email": "victim@example.com",
    "maritalStatus": "SINGLE",
    "occupation": "Teacher",
    "nationality": "Nigerian",
    "address": "123 Street, Lagos"
  },
  "deceasedVictim": null,
  "perpetrator": {
    "id": "uuid",
    "name": "Perpetrator Name",
    "gender": "MALE",
    "age": 35,
    "relationshipWithVictim": "Stranger",
    "previousCriminalHistory": "None"
  },
  "legalGuardian": null,
  "offence": {
    "id": "uuid",
    "offenceName": "Rape",
    "offenceCode": "SEC-1-VAPPA",
    "dateOfOffence": "2024-01-10T00:00:00Z",
    "placeOfOffence": "Lagos, Nigeria",
    "natureOfOffence": "Detailed description...",
    "applicableLaw": "Section 1 VAPPA",
    "penalty": "Life imprisonment",
    "dateReported": "2024-01-11T00:00:00Z",
    "suspectArrested": true,
    "dateArrested": "2024-01-12T00:00:00Z",
    "investigationStatus": "Ongoing"
  },
  "witnesses": [],
  "evidences": [],
  "investigatingOfficers": [],
  "courtRecord": null,
  "prosecutor": null,
  "judgement": null,
  "createdBy": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "approvedBy": {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com"
  },
  "approvedAt": "2024-01-16T10:00:00Z",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-16T10:00:00Z"
}
```

**Error Responses:**
- `401`: Unauthorized
- `403`: Forbidden (cannot access case from different tenant)
- `404`: Case not found
- `500`: Server error

---

#### PATCH `/api/cases/[id]`

Update case information.

**Required Permission:** Creator or Level 3+

**Request Body:** (partial update)
```json
{
  "status": "PENDING_APPROVAL",
  "mojCaseNumber": "MOJ/LA/2024/001-UPDATED"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "caseNumber": "LA-2024-123456",
  "status": "PENDING_APPROVAL",
  "mojCaseNumber": "MOJ/LA/2024/001-UPDATED",
  /* ... other fields */
}
```

---

#### DELETE `/api/cases/[id]`

Delete a case (Level 5+ only, after approval).

**Required Permission:** Level 5+

**Response (200):**
```json
{
  "message": "Case deleted successfully"
}
```

---

#### POST `/api/cases/[id]/approve`

Approve a case.

**Required Permission:** Level 3+

**Response (200):**
```json
{
  "id": "uuid",
  "caseNumber": "LA-2024-123456",
  "status": "APPROVED",
  "approvedById": "uuid",
  "approvedAt": "2024-11-10T10:00:00Z"
}
```

**Error Responses:**
- `400`: Case is not pending approval
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Case not found

---

#### POST `/api/cases/[id]/reject`

Reject a case with reason.

**Required Permission:** Level 3+

**Request Body:**
```json
{
  "reason": "Insufficient evidence provided"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "caseNumber": "LA-2024-123456",
  "status": "REJECTED",
  "rejectionReason": "Insufficient evidence provided",
  "approvedById": "uuid",
  "approvedAt": "2024-11-10T10:00:00Z"
}
```

---

### Deletion Requests

#### GET `/api/deletion-requests`

List deletion requests.

**Required Permission:** Level 5+

**Query Parameters:**
- `status` (string): Filter by status (PENDING, APPROVED, REJECTED)

**Response (200):**
```json
[
  {
    "id": "uuid",
    "caseId": "uuid",
    "case": {
      "caseNumber": "LA-2024-123456",
      "victim": {
        "name": "Victim Name"
      },
      "tenant": {
        "name": "Lagos State"
      }
    },
    "requestedBy": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "reason": "Case closed, archival required",
    "status": "PENDING",
    "createdAt": "2024-11-10T10:00:00Z"
  }
]
```

---

#### POST `/api/deletion-requests`

Create a deletion request.

**Required Permission:** Level 4+

**Request Body:**
```json
{
  "caseId": "uuid",
  "reason": "Case closed, archival required"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "caseId": "uuid",
  "requestedById": "uuid",
  "reason": "Case closed, archival required",
  "status": "PENDING",
  "createdAt": "2024-11-10T10:00:00Z"
}
```

---

#### POST `/api/deletion-requests/[id]/approve`

Approve deletion request and delete case.

**Required Permission:** Level 5+

**Response (200):**
```json
{
  "message": "Deletion request approved and case deleted"
}
```

---

### Statistics

#### GET `/api/statistics`

Get dashboard statistics.

**Required Permission:** Read access (Level 1+)

**Query Parameters:**
- `tenantId` (string): Filter by tenant (Federal users only)

**Response (200):**
```json
{
  "summary": {
    "total": 150,
    "draft": 10,
    "pending": 25,
    "approved": 100,
    "rejected": 15
  },
  "casesByType": [
    {
      "type": "RAPE",
      "count": 45
    },
    {
      "type": "DOMESTIC_VIOLENCE",
      "count": 30
    },
    {
      "type": "TRAFFICKING",
      "count": 20
    }
  ],
  "casesByState": [
    {
      "tenantId": "uuid",
      "tenantName": "Lagos State",
      "tenantCode": "LA",
      "count": 45
    },
    {
      "tenantId": "uuid",
      "tenantName": "Abuja FCT",
      "tenantCode": "FC",
      "count": 30
    }
  ],
  "recentCases": [
    /* Array of recent cases */
  ]
}
```

---

## Error Handling

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (not logged in)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

**Development:** No rate limiting

**Production:** 
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Data Models

### Case Status Flow

```
DRAFT → PENDING_APPROVAL → APPROVED → CLOSED → ARCHIVED
                         ↓
                      REJECTED
```

### Form of SGBV Types

- `RAPE`
- `SEXUAL_ASSAULT`
- `DOMESTIC_VIOLENCE`
- `TRAFFICKING`
- `CHILD_ABUSE`
- `FORCED_MARRIAGE`
- `FEMALE_GENITAL_MUTILATION`
- `HARMFUL_WIDOWHOOD_PRACTICES`
- `EMOTIONAL_ABUSE`
- `INCEST`
- `OTHER`

### Legal Service Types

- `MEDIATION`
- `REFERRAL`
- `LEGAL_COUNSELLING`
- `DIVERSION`
- `PROSECUTION`

### Access Levels

- `LEVEL_1`: Read only
- `LEVEL_2`: Create cases
- `LEVEL_3`: Approve/reject
- `LEVEL_4`: Request deletion
- `LEVEL_5`: Approve deletion
- `SUPER_ADMIN`: Full system access
- `APP_ADMIN`: Application admin

---

## Audit Logging

All API operations are automatically logged with:
- User ID
- Action performed
- Entity type and ID
- Timestamp
- IP address
- User agent

Access audit logs via the Admin Panel or database query.

---

## Best Practices

1. **Always check permissions** before making requests
2. **Handle errors gracefully** in your client application
3. **Use pagination** for large datasets
4. **Cache statistics** data appropriately
5. **Validate data** before sending to API
6. **Use HTTPS** in production
7. **Don't log sensitive data** in client applications

---

## Example Usage (JavaScript/TypeScript)

```typescript
// Login
const loginResponse = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

// Create case
const caseResponse = await fetch('/api/cases', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    formOfSGBV: 'RAPE',
    victim: { /* victim data */ },
    perpetrator: { /* perpetrator data */ },
    offence: { /* offence data */ }
  })
});

// Get cases
const casesResponse = await fetch('/api/cases?page=1&limit=20&status=APPROVED');
const { cases, pagination } = await casesResponse.json();

// Approve case
const approveResponse = await fetch(`/api/cases/${caseId}/approve`, {
  method: 'POST'
});
```

---

For more information, see the main [README.md](./README.md) documentation.

