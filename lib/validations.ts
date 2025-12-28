import { z } from 'zod';

// Victim validation schema
export const victimSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  age: z.number().min(0).max(150),
  dateOfBirth: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  educationQualification: z.string().optional(),
  nationality: z.string().default('Nigerian'),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED']).optional(),
  occupation: z.string().optional(),
  address: z.string().optional(),
  language: z.string().optional(),
  fingerprintId: z.string().optional(),
  faceRecognitionId: z.string().optional(),
});

// Perpetrator validation schema
export const perpetratorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  dateOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  age: z.number().min(0).max(150).optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  educationQualification: z.string().optional(),
  nationality: z.string().optional(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED']).optional(),
  language: z.string().optional(),
  occupation: z.string().optional(),
  relationshipWithVictim: z.string().optional(),
  previousCriminalHistory: z.string().optional(),
  fingerprintId: z.string().optional(),
  faceRecognitionId: z.string().optional(),
});

// Offence validation schema
export const offenceSchema = z.object({
  dateOfOffence: z.string().optional(),
  placeOfOffence: z.string().optional(),
  natureOfOffence: z.string().min(5, 'Nature of offence must be at least 5 characters'),
  offenceCode: z.string().optional(),
  offenceName: z.string().min(2, 'Offence name is required'),
  applicableLaw: z.string().optional(),
  penalty: z.string().optional(),
  dateReported: z.string().optional(),
  suspectArrested: z.boolean().default(false),
  dateArrested: z.string().optional(),
  dateInvestigationStarted: z.string().optional(),
  investigationStatus: z.string().optional(),
  suspectReleasedOnBail: z.boolean().default(false),
  addressOfInvestigatingAgency: z.string().optional(),
});

// Case validation schema
export const caseSchema = z.object({
  formOfSGBV: z.enum([
    'RAPE',
    'SEXUAL_ASSAULT',
    'DOMESTIC_VIOLENCE',
    'TRAFFICKING',
    'CHILD_ABUSE',
    'FORCED_MARRIAGE',
    'FEMALE_GENITAL_MUTILATION',
    'HARMFUL_WIDOWHOOD_PRACTICES',
    'EMOTIONAL_ABUSE',
    'INCEST',
    'OTHER',
  ]),
  legalServiceType: z.enum([
    'MEDIATION',
    'REFERRAL',
    'LEGAL_COUNSELLING',
    'DIVERSION',
    'PROSECUTION',
  ]).optional(),
  dateCharged: z.string().optional(),
  chargeNumber: z.string().optional(),
  dateFiledInCourt: z.string().optional(),
  administrativeNumber: z.string().optional(),
  mojCaseNumber: z.string().optional(),
  dateOfArraignment: z.string().optional(),
  bailConditions: z.string().optional(),
  statusOfCase: z.string().optional(),
  victim: victimSchema,
  perpetrator: perpetratorSchema,
  offence: offenceSchema,
});

// User validation schema
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
  accessLevel: z.enum([
    'LEVEL_1',
    'LEVEL_2',
    'LEVEL_3',
    'LEVEL_4',
    'LEVEL_5',
    'SUPER_ADMIN',
    'APP_ADMIN',
  ]),
  tenantId: z.string(),
});

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Witness validation schema
export const witnessSchema = z.object({
  witnessNumber: z.string().min(1, 'Witness number is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  dateOfAppearance: z.string().optional(),
  witnessStatement: z.string().optional(),
});

// Evidence validation schema
export const evidenceSchema = z.object({
  type: z.enum(['FORENSIC', 'WRITTEN_STATEMENT', 'ELECTRONIC', 'PHYSICAL', 'OTHER']),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  fileUrl: z.string().optional(),
  collectedDate: z.string().optional(),
  collectedBy: z.string().optional(),
  chainOfCustody: z.string().optional(),
});

