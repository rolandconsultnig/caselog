import { writeFile, mkdir, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import crypto from 'crypto';

export interface FileUploadResult {
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  checksum: string;
  thumbnailUrl?: string;
}

export interface FileUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  generateThumbnail?: boolean;
  encrypt?: boolean;
}

const DEFAULT_MAX_SIZE = 50 * 1024 * 1024; // 50MB
const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'video/mp4',
  'video/quicktime',
  'audio/mpeg',
  'audio/wav',
  'text/plain',
];

/**
 * Generate checksum for file integrity verification
 */
export function generateChecksum(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  options: FileUploadOptions = {}
): { valid: boolean; error?: string } {
  const maxSize = options.maxSize || DEFAULT_MAX_SIZE;
  const allowedTypes = options.allowedTypes || DEFAULT_ALLOWED_TYPES;

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  return { valid: true };
}

/**
 * Upload file to local storage
 */
export async function uploadFile(
  file: File,
  folder: string,
  options: FileUploadOptions = {}
): Promise<FileUploadResult> {
  const validation = validateFile(file, options);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Convert file to buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate checksum
  const checksum = generateChecksum(buffer);

  // Create uploads directory if it doesn't exist
  const uploadsDir = join(process.cwd(), 'public', 'uploads', folder);
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = file.name.split('.').pop();
  const fileName = `${timestamp}-${randomString}.${extension}`;
  const filePath = join(uploadsDir, fileName);
  const fileUrl = `/uploads/${folder}/${fileName}`;

  // Save file
  await writeFile(filePath, buffer);

  // Generate thumbnail for images if requested
  let thumbnailUrl: string | undefined;
  if (options.generateThumbnail && file.type.startsWith('image/')) {
    // Thumbnail generation would require sharp or similar library
    // For now, we'll skip it but leave the option open
    thumbnailUrl = fileUrl; // Use original as thumbnail for now
  }

  return {
    fileName,
    originalFileName: file.name,
    filePath,
    fileUrl,
    fileSize: file.size,
    mimeType: file.type,
    checksum,
    thumbnailUrl,
  };
}

/**
 * Delete file from storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
}

/**
 * Read file from storage
 */
export async function readFileFromStorage(filePath: string): Promise<Buffer> {
  try {
    return await readFile(filePath);
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error('Failed to read file');
  }
}

/**
 * Get file type category
 */
export function getFileTypeCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'IMAGE';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  if (mimeType.startsWith('audio/')) return 'AUDIO';
  if (mimeType === 'application/pdf') return 'PDF';
  if (mimeType.includes('word')) return 'DOCUMENT';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'SPREADSHEET';
  return 'OTHER';
}

