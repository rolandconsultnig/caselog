import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { readFileFromStorage, deleteFile } from '@/lib/file-upload';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const document = await prisma.caseFile.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check access permissions
    // TODO: Implement proper access control based on accessLevel

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
    return new NextResponse(fileBuffer, {
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

    // Check if user has permission to delete (LEVEL_4 or higher)
    const userLevel = parseInt(session.user.accessLevel.replace('LEVEL_', ''));
    if (userLevel < 4 && session.user.accessLevel !== 'APP_ADMIN' && session.user.accessLevel !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const document = await prisma.caseFile.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
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
        entityType: 'CASE_FILE',
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

