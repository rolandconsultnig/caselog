'use client';

import { useState } from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface PhotoUploadResult {
  facialData: {
    facialRecognitionId: string;
    confidence: number;
    imageQuality: number;
  };
  perpetrator: {
    biometricVerified: boolean;
  };
  matches: {
    found: boolean;
    count: number;
  };
}

interface PhotoUploadProps {
  perpetratorId: string;
  existingPhoto?: string;
  onUploadComplete?: (data: PhotoUploadResult) => void;
}

export default function PerpetratorPhotoUpload({
  perpetratorId,
  existingPhoto,
  onUploadComplete,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(existingPhoto || null);
  const [uploadResult, setUploadResult] = useState<PhotoUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadPhoto(file);
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch(`/api/perpetrators/${perpetratorId}/upload-photo`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = (await response.json()) as PhotoUploadResult;
      setUploadResult(data);
      
      if (onUploadComplete) {
        onUploadComplete(data);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      setError(message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Perpetrator Photograph & Facial Recognition</h3>

        {/* Upload Area */}
        <div className="mb-4">
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Perpetrator"
                    className="max-w-xs mx-auto rounded-lg shadow-md"
                  />
                  <p className="text-sm text-gray-600">Click to change photo</p>
                </div>
              ) : (
                <div>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload perpetrator photograph
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Upload Status */}
        {uploading && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <div>
                <p className="font-medium text-blue-900">Processing photograph...</p>
                <p className="text-sm text-blue-700">Performing facial recognition analysis</p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <div className="space-y-4">
            {/* Success Message */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="font-medium text-green-900">Photo uploaded successfully!</p>
              </div>
            </div>

            {/* Facial Recognition Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Facial Recognition ID</p>
                <p className="font-mono text-sm">{uploadResult.facialData.facialRecognitionId}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Recognition Confidence</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${uploadResult.facialData.confidence * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold">
                    {(uploadResult.facialData.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Image Quality</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${uploadResult.facialData.imageQuality * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold">
                    {(uploadResult.facialData.imageQuality * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Biometric Status</p>
                <Badge variant={uploadResult.perpetrator.biometricVerified ? 'success' : 'warning'}>
                  {uploadResult.perpetrator.biometricVerified ? 'Verified' : 'Pending'}
                </Badge>
              </div>
            </div>

            {/* Match Results */}
            {uploadResult.matches.found && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 text-yellow-600 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-yellow-900">
                      Potential Match Found!
                    </p>
                    <p className="text-sm text-yellow-800 mt-1">
                      {uploadResult.matches.count} potential match(es) found in the database.
                      Please review for verification.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!uploadResult.matches.found && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  No matching faces found in the database. This is a new biometric entry.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Photo Guidelines:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use a clear, front-facing photograph</li>
            <li>• Ensure good lighting and focus</li>
            <li>• Face should be clearly visible</li>
            <li>• Remove sunglasses or face coverings</li>
            <li>• Maximum file size: 5MB</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

