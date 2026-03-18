import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { uploadFile, getFileTypeCategory, FileUploadOptions } from '@/lib/file-upload';
import { emailService, emailTemplates } from '@/lib/email-service';
import { Prisma } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const relatedEntityType = searchParams.get('relatedEntityType');
    const relatedEntityId = searchParams.get('relatedEntityId');

    const where: Prisma.CaseFileWhereInput = { caseId: params.id };
    if (relatedEntityType && relatedEntityId) {
      where.relatedEntityType = relatedEntityType;
      where.relatedEntityId = relatedEntityId;
    }

    const documents = await prisma.caseFile.findMany({
      where,
      orderBy: { uploadDate: 'desc' },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') as string;
    const relatedEntityType = formData.get('relatedEntityType') as string;
    const relatedEntityId = formData.get('relatedEntityId') as string;
    const accessLevel = formData.get('accessLevel') as string || 'INTERNAL';
    const category = formData.get('category') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload file
    const uploadOptions: FileUploadOptions = {
      maxSize: 50 * 1024 * 1024, // 50MB
      generateThumbnail: file.type.startsWith('image/'),
    };

    const uploadResult = await uploadFile(file, 'documents', uploadOptions);

    // Determine file type enum from mime type
    const fileTypeCategory = getFileTypeCategory(file.type);
    let fileType: string;
    switch (fileTypeCategory) {
      case 'IMAGE':
        fileType = 'PHOTO';
        break;
      case 'VIDEO':
        fileType = 'VIDEO';
        break;
      case 'AUDIO':
        fileType = 'AUDIO';
        break;
      case 'PDF':
        fileType = 'LEGAL_DOCUMENT';
        break;
      case 'DOCUMENT':
      case 'SPREADSHEET':
        fileType = 'LEGAL_DOCUMENT';
        break;
      default:
        fileType = 'OTHER';
    }

    // Parse tags
    const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    // Create document record
    const document = await prisma.caseFile.create({
      data: {
        caseId: params.id,
        fileName: uploadResult.fileName,
        originalFileName: uploadResult.originalFileName,
        fileType: fileType as unknown as Prisma.CaseFileCreateInput['fileType'],
        mimeType: uploadResult.mimeType,
        fileSize: uploadResult.fileSize,
        filePath: uploadResult.filePath,
        fileUrl: uploadResult.fileUrl,
        thumbnailUrl: uploadResult.thumbnailUrl,
        storageProvider: 'LOCAL',
        accessLevel: accessLevel as unknown as Prisma.CaseFileCreateInput['accessLevel'],
        encrypted: true,
        virusScanned: false,
        virusScanResult: 'NOT_SCANNED',
        description: description || null,
        tags: tagsArray,
        category: category || null,
        relatedEntityType: relatedEntityType || null,
        relatedEntityId: relatedEntityId || null,
        uploadedBy: session.user.id,
        uploadedByName: session.user.name || 'Unknown',
        uploadDate: new Date(),
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.accessLevel,
        action: 'CREATE',
        entityType: 'DOCUMENT',
        entityId: document.id,
        entityName: `Document "${uploadResult.originalFileName}" uploaded to case ${params.id}`,
      },
    });

    // Send notification email to case stakeholders
    try {
      const caseData = await prisma.case.findUnique({
        where: { id: params.id },
        select: { caseNumber: true },
      });

      if (caseData) {
        // Get case stakeholders (investigators, prosecutors, etc.)
        const stakeholders = await prisma.user.findMany({
          where: {
            OR: [
              { accessLevel: 'INVESTIGATOR' },
              { accessLevel: 'PROSECUTOR' },
            ],
          },
          select: { email: true, firstName: true, lastName: true },
        });

        const emails = stakeholders.map(s => s.email).filter(Boolean) as string[];
        if (emails.length > 0) {
          await emailService.sendTemplateEmail(
            emailTemplates.documentUploaded,
            {
              caseNumber: caseData.caseNumber,
              fileName: uploadResult.originalFileName,
              uploadedBy: session.user.name || 'System',
            },
            emails
          );
        }
      }
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Don't fail the upload if email fails
    }

    return NextResponse.json({ document });
  } catch (error: unknown) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload document' },
      { status: 500 }
    );
  }
}
