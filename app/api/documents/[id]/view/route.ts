import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { readFileFromStorage } from '@/lib/file-upload';
import { getPermissions, canAccessCase } from '@/lib/permissions';
import { TenantType } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = getPermissions(
      session.user.accessLevel,
      session.user.tenantType as TenantType
    );

    if (!permissions.canDownloadDocuments) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const document = await prisma.caseFile.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const relatedCase = await prisma.case.findUnique({
      where: { id: document.caseId },
      select: { tenantId: true },
    });

    if (!relatedCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    if (
      !canAccessCase(
        session.user.tenantId,
        relatedCase.tenantId,
        session.user.tenantType as TenantType
      )
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update access tracking
    await prisma.caseFile.update({
      where: { id: params.id },
      data: {
        lastAccessedDate: new Date(),
        lastAccessedBy: session.user.id,
      },
    });

    // Read file
    const fileBuffer = await readFileFromStorage(document.filePath);

    // Return file with inline disposition for viewing
    const body = Uint8Array.from(fileBuffer);

    return new NextResponse(body as unknown as BodyInit, {
      headers: {
        'Content-Type': document.mimeType,
        'Content-Disposition': `inline; filename="${document.originalFileName}"`,
        'Content-Length': document.fileSize.toString(),
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error viewing document:', error);
    return NextResponse.json(
      { error: 'Failed to view document' },
      { status: 500 }
    );
  }
}
