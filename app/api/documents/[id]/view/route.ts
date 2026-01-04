import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { readFileFromStorage } from '@/lib/file-upload';

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
    return new NextResponse(fileBuffer as any, {
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
