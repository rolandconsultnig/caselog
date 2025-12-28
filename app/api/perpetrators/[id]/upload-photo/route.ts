import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { processFacialRecognition, searchMatchingFaces } from '@/lib/facial-recognition';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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
    const file = formData.get('photo') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'perpetrators');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${params.id}-${timestamp}.${file.name.split('.').pop()}`;
    const filepath = join(uploadsDir, filename);
    const publicPath = `/uploads/perpetrators/${filename}`;

    // Save file
    await writeFile(filepath, buffer);

    // Process facial recognition
    const facialData = await processFacialRecognition(buffer, params.id);

    // Search for matching faces
    const matches = await searchMatchingFaces(facialData.embeddings);

    // Update perpetrator record
    const perpetrator = await prisma.perpetrator.update({
      where: { id: params.id },
      data: {
        photographPath: publicPath,
        photographUploadDate: new Date(),
        facialRecognitionData: facialData as any,
        facialRecognitionId: facialData.facialRecognitionId,
        biometricVerified: facialData.confidence > 0.9,
        biometricVerifiedDate: new Date(),
        biometricVerifiedBy: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      perpetrator,
      facialData: {
        facialRecognitionId: facialData.facialRecognitionId,
        confidence: facialData.confidence,
        imageQuality: facialData.metadata.imageQuality,
      },
      matches: matches.length > 0 ? {
        found: true,
        count: matches.length,
        topMatch: matches[0],
      } : {
        found: false,
        count: 0,
      },
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}

