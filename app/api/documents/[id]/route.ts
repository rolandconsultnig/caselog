import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { readFileFromStorage, deleteFile } from '@/lib/file-upload';
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
        downloadCount: { increment: 1 },
        lastAccessedDate: new Date(),
        lastAccessedBy: session.user.id,
      },
    });

    // Read file
    const fileBuffer = await readFileFromStorage(document.filePath);

    // Return file with appropriate headers
    // `readFileFromStorage` returns a Node `Buffer` (a `Uint8Array`).
    // Create a copy so TS doesn't infer `SharedArrayBuffer`.
    const body = Uint8Array.from(fileBuffer);

    return new NextResponse(body as unknown as BodyInit, {
      headers: {
        'Content-Type': document.mimeType,
        'Content-Disposition': `attachment; filename="${document.originalFileName}"`,
        'Content-Length': document.fileSize.toString(),
      },
    });
  } catch (error) {
    console.error('Error downloading document:', error);
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    if (!permissions.canDeleteDocuments) {
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

    // Delete file from storage
    try {
      await deleteFile(document.filePath);
    } catch (error) {
      console.error('Error deleting file from storage:', error);
      // Continue with database deletion even if file deletion fails
    }

    // Delete database record
    await prisma.caseFile.delete({
      where: { id: params.id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.accessLevel,
        action: 'DELETE',
        entityType: 'DOCUMENT',
        entityId: params.id,
        entityName: `Document "${document.originalFileName}" deleted from case ${document.caseId}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}

