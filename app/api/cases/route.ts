import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPermissions } from '@/lib/permissions';
import { generateCaseNumber, logAudit } from '@/lib/utils';
import { Prisma, TenantType, CaseType, CasePriority, CaseStatus, Gender } from '@prisma/client';
import { generateMOJFileNumber, getStateCodeFromName } from '@/lib/generate-moj-number';

// Map form SGBV types to CaseType enum
function mapFormOfSGBVToCaseType(formOfSGBV: string | undefined): CaseType {
  if (!formOfSGBV) return CaseType.OTHER;
  const mapping: Record<string, CaseType> = {
    'RAPE': CaseType.SGBV,
    'SEXUAL_ASSAULT': CaseType.SGBV,
    'DOMESTIC_VIOLENCE': CaseType.DOMESTIC_VIOLENCE,
    'TRAFFICKING': CaseType.TRAFFICKING,
    'CHILD_ABUSE': CaseType.SGBV,
    'FORCED_MARRIAGE': CaseType.SGBV,
    'FEMALE_GENITAL_MUTILATION': CaseType.SGBV,
    'HARMFUL_WIDOWHOOD_PRACTICES': CaseType.SGBV,
    'EMOTIONAL_ABUSE': CaseType.HARASSMENT,
    'INCEST': CaseType.SGBV,
    'SEXTORTION': CaseType.SGBV,
    'ONLINE_CHILD_SEXUAL_EXPLOITATION': CaseType.SGBV,
    'INTIMATE_IMAGE_ABUSE': CaseType.SGBV,
    'OTHER': CaseType.OTHER,
  };
  return mapping[formOfSGBV.toUpperCase()] || CaseType.OTHER;
}

// Map priority string to CasePriority enum
function mapPriority(priority: string | undefined): CasePriority {
  if (!priority) return CasePriority.MEDIUM;
  const upperPriority = priority.toUpperCase();
  if (upperPriority === 'LOW') return CasePriority.LOW;
  if (upperPriority === 'MEDIUM') return CasePriority.MEDIUM;
  if (upperPriority === 'HIGH') return CasePriority.HIGH;
  if (upperPriority === 'URGENT') return CasePriority.URGENT;
  if (upperPriority === 'CRITICAL') return CasePriority.CRITICAL;
  return CasePriority.MEDIUM;
}

// GET /api/cases - List cases with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const tenantId = searchParams.get('tenantId');
    const search = searchParams.get('search');

    const permissions = getPermissions(
      session.user.accessLevel,
      session.user.tenantType as TenantType
    );

    if (!permissions.canRead) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Build where clause
    const where: Prisma.CaseWhereInput = {};

    // Federal users can see all cases, state users only their own
    if (session.user.tenantType !== 'FEDERAL') {
      where.tenantId = session.user.tenantId;
    } else if (tenantId) {
      where.tenantId = tenantId;
    }

    if (status && Object.values(CaseStatus).includes(status as CaseStatus)) {
      where.status = status as CaseStatus;
    }

    if (search) {
      where.OR = [
        { caseNumber: { contains: search, mode: 'insensitive' } },
        { mojCaseNumber: { contains: search, mode: 'insensitive' } },
        {
          victims: {
            some: {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { victimNumber: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        },
        {
          perpetrators: {
            some: {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { perpetratorNumber: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        },
      ];
    }

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
          include: {
            tenant: true,
            victims: true,
            perpetrators: true,
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.case.count({ where }),
    ]);

    return NextResponse.json({
      cases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/cases - Create new case
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = getPermissions(
      session.user.accessLevel,
      session.user.tenantType as TenantType
    );

    if (!permissions.canCreate) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    
    // Get tenant code and name for case number generation
    const tenant = await prisma.tenant.findUnique({
      where: { id: session.user.tenantId },
      select: { code: true, name: true },
    });
    const tenantCode = tenant?.code || session.user.tenantCode || 'CASE';
    const tenantName = tenant?.name || session.user.tenantName || '';

    // Generate case number
    const caseNumber = generateCaseNumber(tenantCode);
    
    // Generate MOJ File Number if not provided or empty
    let mojFileNumber = body.mojCaseNumber;
    if (!mojFileNumber || mojFileNumber.trim() === '') {
      const stateNameForMoj = session.user.tenantType === 'FEDERAL' ? body.incidentState : tenantName;
      const stateCode = getStateCodeFromName(stateNameForMoj);
      // Get count of cases for this state in current year for sequential number
      const currentYear = new Date().getFullYear();
      const yearStart = new Date(currentYear, 0, 1);
      const caseCount = await prisma.case.count({
        where: {
          tenantId: session.user.tenantId,
          createdAt: {
            gte: yearStart,
          },
        },
      });
      mojFileNumber = generateMOJFileNumber(stateCode, caseCount + 1);
    }

    // Extract and transform form data
    const victimName = body.victim?.name || body.victim?.firstName || '';
    const victimNameParts = victimName.split(' ').filter(Boolean);
    const victimFirstName = victimNameParts[0] || body.victim?.firstName || 'Unknown';
    const victimLastName = victimNameParts.slice(1).join(' ') || body.victim?.lastName || 'Unknown';

    const perpetratorName = body.perpetrator?.name || body.perpetrator?.firstName || '';
    const perpetratorNameParts = perpetratorName.split(' ').filter(Boolean);
    const perpetratorFirstName = perpetratorNameParts[0] || body.perpetrator?.firstName || 'Unknown';
    const perpetratorLastName = perpetratorNameParts.slice(1).join(' ') || body.perpetrator?.lastName || 'Unknown';

    // Map gender strings to Gender enum
    const mapGender = (gender: string | undefined): Gender => {
      if (!gender) return Gender.OTHER;
      const upperGender = gender.toUpperCase();
      if (upperGender === 'MALE') return Gender.MALE;
      if (upperGender === 'FEMALE') return Gender.FEMALE;
      if (upperGender === 'PREFER_NOT_TO_SAY') return Gender.PREFER_NOT_TO_SAY;
      return Gender.OTHER;
    };

    // Ensure age is a number
    const victimAge = typeof body.victim?.age === 'string' ? parseInt(body.victim.age) || 0 : (body.victim?.age || 0);
    const perpetratorAge = typeof body.perpetrator?.age === 'string' 
      ? (body.perpetrator.age ? parseInt(body.perpetrator.age) : null)
      : (body.perpetrator?.age || null);

    // Helper to convert empty strings to null
    const nullIfEmpty = (value: string | null | undefined): string | null => {
      if (value === '' || value === undefined || value === null) return null;
      return value;
    };

    // Validate required fields
    if (!body.title || body.title.trim() === '') {
      return NextResponse.json({ error: 'Case title is required' }, { status: 400 });
    }
    if (!body.description || body.description.trim() === '') {
      return NextResponse.json({ error: 'Case description is required' }, { status: 400 });
    }
    if (!body.incidentState || body.incidentState.trim() === '') {
      return NextResponse.json({ error: 'Incident state is required' }, { status: 400 });
    }
    if (!body.victim?.name && !body.victim?.firstName) {
      return NextResponse.json({ error: 'Victim name is required' }, { status: 400 });
    }
    if (!body.perpetrator?.name && !body.perpetrator?.firstName) {
      return NextResponse.json({ error: 'Perpetrator name is required' }, { status: 400 });
    }
    if (!body.offence?.offenceName && !body.offence?.natureOfOffence) {
      return NextResponse.json({ error: 'Offence name or nature is required' }, { status: 400 });
    }

    // Create case with all related data
    const newCase = await prisma.case.create({
      data: {
        caseNumber,
        mojCaseNumber: mojFileNumber,
        tenantId: session.user.tenantId,
        title: body.title.trim(),
        description: body.description.trim(),
        incidentDate: body.incidentDate ? new Date(body.incidentDate) : new Date(),
        incidentState: body.incidentState.trim(),
        incidentLga: nullIfEmpty(body.incidentLga || body.incidentLGA),
        incidentAddress: nullIfEmpty(body.incidentAddress),
        jurisdiction: session.user.tenantType === 'FEDERAL' ? 'FEDERAL' : 'STATE',
        caseType: mapFormOfSGBVToCaseType(body.formOfSGBV || body.caseType),
        priority: mapPriority(body.priority),
        status: session.user.accessLevel === 'LEVEL_2' ? CaseStatus.PENDING_APPROVAL : CaseStatus.NEW,
        createdById: session.user.id,
        victims: {
          create: [{
            victimNumber: `V${String(Date.now()).slice(-6)}`,
            firstName: victimFirstName,
            lastName: victimLastName,
            middleName: body.victim?.middleName || null,
            age: victimAge,
            gender: mapGender(body.victim?.gender),
            nationality: body.victim?.nationality || 'Nigerian',
            dateOfBirth: body.victim?.dateOfBirth
              ? new Date(body.victim.dateOfBirth)
              : null,
            phoneNumber: nullIfEmpty(body.victim?.phoneNumber),
            email: nullIfEmpty(body.victim?.email),
            currentAddress: nullIfEmpty(body.victim?.address || body.victim?.currentAddress),
            aliases: Array.isArray(body.victim?.aliases) ? body.victim.aliases : [],
          }],
        },
        perpetrators: {
          create: [{
            perpetratorNumber: `P${String(Date.now()).slice(-6)}`,
            firstName: perpetratorFirstName,
            lastName: perpetratorLastName,
            middleName: body.perpetrator?.middleName || null,
            age: perpetratorAge,
            gender: mapGender(body.perpetrator?.gender),
            nationality: body.perpetrator?.nationality || null,
            dateOfBirth: body.perpetrator?.dateOfBirth
              ? new Date(body.perpetrator.dateOfBirth)
              : null,
            phoneNumber: nullIfEmpty(body.perpetrator?.phoneNumber),
            email: nullIfEmpty(body.perpetrator?.email),
            currentAddress: nullIfEmpty(body.perpetrator?.address || body.perpetrator?.currentAddress),
            relationshipToVictim: nullIfEmpty(body.perpetrator?.relationshipWithVictim || body.perpetrator?.relationshipToVictim),
            aliases: Array.isArray(body.perpetrator?.aliases) ? body.perpetrator.aliases : [],
          }],
        },
        courtRecords: {
          create: [{
            offenceNumber: `OFF${String(Date.now()).slice(-6)}`,
            offenceName: (body.offence?.offenceName || body.offence?.natureOfOffence || 'Offence').trim(),
            offenceCode: nullIfEmpty(body.offence?.offenceCode) || 'N/A',
            law: body.offence?.applicableLaw || 'N/A',
            penalty: body.offence?.penalty || 'N/A',
            chargeDate: body.offence?.dateOfOffence
              ? new Date(body.offence.dateOfOffence)
              : null,
            trialLocation: nullIfEmpty(body.offence?.placeOfOffence),
            evidenceIds: [],
            witnessIds: [],
            supportingDocuments: [],
          }],
        },
      },
      include: {
        victims: true,
        perpetrators: true,
        courtRecords: true,
        tenant: true,
      },
    });

    // Log audit
    await logAudit({
      userId: session.user.id,
      userName: session.user.name || session.user.email,
      userRole: session.user.accessLevel,
      action: 'CREATE',
      entityType: 'CASE',
      entityId: newCase.id,
      caseId: newCase.id,
      description: `Created case ${caseNumber}`,
    });

    return NextResponse.json(newCase, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating case:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // Log detailed error for debugging
    if (typeof error === 'object' && error !== null && 'issues' in error) {
      const issues = (error as { issues?: unknown }).issues;
      console.error('Validation errors:', issues);
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: issues 
      }, { status: 400 });
    }
    
    // Prisma errors
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code?: unknown }).code;
      console.error('Prisma error code:', code);
      if (code === 'P2002') {
        return NextResponse.json({ 
          error: 'A case with this number already exists',
          details: (error as { meta?: unknown }).meta 
        }, { status: 400 });
      }
      if (code === 'P2003') {
        return NextResponse.json({ 
          error: 'Invalid reference to related record',
          details: (error as { meta?: unknown }).meta 
        }, { status: 400 });
      }
    }
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: error.message || 'Failed to create case',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

