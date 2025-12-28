import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPermissions, canAccessCase } from '@/lib/permissions';
import { generateCaseNumber, logAudit } from '@/lib/utils';
import { caseSchema } from '@/lib/validations';
import { TenantType } from '@prisma/client';

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
    const where: any = {};

    // Federal users can see all cases, state users only their own
    if (session.user.tenantType !== 'FEDERAL') {
      where.tenantId = session.user.tenantId;
    } else if (tenantId) {
      where.tenantId = tenantId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { caseNumber: { contains: search, mode: 'insensitive' } },
        { mojCaseNumber: { contains: search, mode: 'insensitive' } },
        { victim: { name: { contains: search, mode: 'insensitive' } } },
        { perpetrator: { name: { contains: search, mode: 'insensitive' } } },
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
    const validatedData = caseSchema.parse(body);

    // Generate case number
    const caseNumber = generateCaseNumber(session.user.tenantCode);

    // Create case with all related data
    const newCase = await prisma.case.create({
      data: {
        caseNumber,
        tenantId: session.user.tenantId,
        formOfSGBV: validatedData.formOfSGBV,
        legalServiceType: validatedData.legalServiceType,
        dateCharged: validatedData.dateCharged
          ? new Date(validatedData.dateCharged)
          : null,
        chargeNumber: validatedData.chargeNumber,
        dateFiledInCourt: validatedData.dateFiledInCourt
          ? new Date(validatedData.dateFiledInCourt)
          : null,
        administrativeNumber: validatedData.administrativeNumber,
        mojCaseNumber: validatedData.mojCaseNumber,
        dateOfArraignment: validatedData.dateOfArraignment
          ? new Date(validatedData.dateOfArraignment)
          : null,
        bailConditions: validatedData.bailConditions,
        statusOfCase: validatedData.statusOfCase,
        status: 'NEW',
        createdById: session.user.id,
        victim: {
          create: {
            ...validatedData.victim,
            dateOfBirth: validatedData.victim.dateOfBirth
              ? new Date(validatedData.victim.dateOfBirth)
              : null,
          },
        },
        perpetrator: {
          create: {
            ...validatedData.perpetrator,
            dateOfBirth: validatedData.perpetrator.dateOfBirth
              ? new Date(validatedData.perpetrator.dateOfBirth)
              : null,
          },
        },
        offence: {
          create: {
            ...validatedData.offence,
            dateOfOffence: validatedData.offence.dateOfOffence
              ? new Date(validatedData.offence.dateOfOffence)
              : null,
            dateReported: validatedData.offence.dateReported
              ? new Date(validatedData.offence.dateReported)
              : null,
            dateArrested: validatedData.offence.dateArrested
              ? new Date(validatedData.offence.dateArrested)
              : null,
            dateInvestigationStarted: validatedData.offence
              .dateInvestigationStarted
              ? new Date(validatedData.offence.dateInvestigationStarted)
              : null,
          },
        },
      },
      include: {
        victim: true,
        perpetrator: true,
        offence: true,
        tenant: true,
      },
    });

    // Log audit
    await logAudit({
      userId: session.user.id,
      action: 'CREATE',
      entityType: 'Case',
      entityId: newCase.id,
      caseId: newCase.id,
      description: `Created case ${caseNumber}`,
    });

    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    console.error('Error creating case:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

