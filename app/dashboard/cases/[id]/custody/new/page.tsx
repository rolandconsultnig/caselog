'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { toast } from 'sonner';

interface Evidence {
  id: string;
  evidenceNumber: string;
  description: string;
  evidenceType: string;
}

export default function NewCustodyTransferPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [selectedEvidenceId] = useState<string>(
    searchParams?.get('evidenceId') || ''
  );

  const [formData, setFormData] = useState({
    evidenceId: selectedEvidenceId,
    transferredFrom: '',
    transferredFromName: '',
    transferredFromTitle: '',
    transferredFromAgency: '',
    transferredTo: '',
    transferredToName: '',
    transferredToTitle: '',
    transferredToAgency: '',
    transferDate: new Date().toISOString().split('T')[0],
    transferTime: new Date().toTimeString().slice(0, 5),
    transferLocation: '',
    transferReason: 'ANALYSIS',
    reasonDetails: '',
    conditionBefore: 'GOOD',
    conditionAfter: 'GOOD',
    conditionNotes: '',
    damageReported: false,
    damageDescription: '',
    receivedBy: '',
    receivedByName: session?.user?.name || '',
    receivedDate: new Date().toISOString().split('T')[0],
    receivedTime: new Date().toTimeString().slice(0, 5),
    verificationMethod: '',
    discrepanciesNoted: false,
    discrepancyDetails: '',
    transferrerSignature: '',
    receiverSignature: '',
    witnessSignature: '',
    witnessName: '',
    compliesWithProtocol: true,
    protocolDeviations: '',
    correctiveActions: '',
    notes: '',
  });

  const fetchEvidence = useCallback(async () => {
    try {
      const response = await fetch(`/api/cases/${params.id}/evidence`);
      if (response.ok) {
        const data = await response.json();
        setEvidence(data.evidence || []);
      }
    } catch (error) {
      console.error('Error fetching evidence:', error);
      toast.error('Failed to load evidence items');
    }
  }, [params.id]);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, ensure ChainOfCustody record exists for this evidence
      const custodyResponse = await fetch(`/api/cases/${params.id}/custody`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
        }),
      });

      if (!custodyResponse.ok) {
        const error = await custodyResponse.json();
        throw new Error(error.error || 'Failed to create custody transfer');
      }

      toast.success('Custody transfer recorded successfully');
      router.push(`/dashboard/cases/${params.id}/custody`);
    } catch (error: unknown) {
      console.error('Error creating custody transfer:', error);
      const message = error instanceof Error ? error.message : 'Failed to create custody transfer';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">New Custody Transfer</h1>
            <p className="text-gray-600 mt-1">
              Record evidence custody transfer and maintain chain of custody
            </p>
          </div>
          <Link href={`/dashboard/cases/${params.id}/custody`}>
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Evidence Selection */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Evidence Selection</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evidence Item *
                  </label>
                  <select
                    name="evidenceId"
                    value={formData.evidenceId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select evidence item</option>
                    {evidence.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.evidenceNumber} - {item.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Transfer From */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Transfer From</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custodian ID *
                  </label>
                  <input
                    type="text"
                    name="transferredFrom"
                    value={formData.transferredFrom}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custodian Name *
                  </label>
                  <input
                    type="text"
                    name="transferredFromName"
                    value={formData.transferredFromName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="transferredFromTitle"
                    value={formData.transferredFromTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agency
                  </label>
                  <input
                    type="text"
                    name="transferredFromAgency"
                    value={formData.transferredFromAgency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Transfer To */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Transfer To</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient ID *
                  </label>
                  <input
                    type="text"
                    name="transferredTo"
                    value={formData.transferredTo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    name="transferredToName"
                    value={formData.transferredToName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="transferredToTitle"
                    value={formData.transferredToTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agency
                  </label>
                  <input
                    type="text"
                    name="transferredToAgency"
                    value={formData.transferredToAgency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Transfer Details */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Transfer Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transfer Date *
                  </label>
                  <input
                    type="date"
                    name="transferDate"
                    value={formData.transferDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transfer Time *
                  </label>
                  <input
                    type="time"
                    name="transferTime"
                    value={formData.transferTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transfer Location *
                  </label>
                  <input
                    type="text"
                    name="transferLocation"
                    value={formData.transferLocation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transfer Reason *
                  </label>
                  <select
                    name="transferReason"
                    value={formData.transferReason}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="ANALYSIS">Analysis</option>
                    <option value="COURT_PRESENTATION">Court Presentation</option>
                    <option value="STORAGE">Storage</option>
                    <option value="RETURN">Return</option>
                    <option value="DISPOSAL">Disposal</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason Details
                  </label>
                  <textarea
                    name="reasonDetails"
                    value={formData.reasonDetails}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Condition Assessment */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Condition Assessment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition Before Transfer *
                  </label>
                  <select
                    name="conditionBefore"
                    value={formData.conditionBefore}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="EXCELLENT">Excellent</option>
                    <option value="GOOD">Good</option>
                    <option value="FAIR">Fair</option>
                    <option value="POOR">Poor</option>
                    <option value="DAMAGED">Damaged</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition After Transfer *
                  </label>
                  <select
                    name="conditionAfter"
                    value={formData.conditionAfter}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="EXCELLENT">Excellent</option>
                    <option value="GOOD">Good</option>
                    <option value="FAIR">Fair</option>
                    <option value="POOR">Poor</option>
                    <option value="DAMAGED">Damaged</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition Notes
                  </label>
                  <textarea
                    name="conditionNotes"
                    value={formData.conditionNotes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="damageReported"
                      checked={formData.damageReported}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Damage Reported
                    </span>
                  </label>
                </div>
                {formData.damageReported && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Damage Description *
                    </label>
                    <textarea
                      name="damageDescription"
                      value={formData.damageDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required={formData.damageReported}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Receipt Details */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Receipt Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Received By ID *
                  </label>
                  <input
                    type="text"
                    name="receivedBy"
                    value={formData.receivedBy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Received By Name *
                  </label>
                  <input
                    type="text"
                    name="receivedByName"
                    value={formData.receivedByName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Received Date *
                  </label>
                  <input
                    type="date"
                    name="receivedDate"
                    value={formData.receivedDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Received Time *
                  </label>
                  <input
                    type="time"
                    name="receivedTime"
                    value={formData.receivedTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Method
                  </label>
                  <input
                    type="text"
                    name="verificationMethod"
                    value={formData.verificationMethod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Visual inspection, Barcode scan"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="discrepanciesNoted"
                      checked={formData.discrepanciesNoted}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Discrepancies Noted
                    </span>
                  </label>
                </div>
                {formData.discrepanciesNoted && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discrepancy Details *
                    </label>
                    <textarea
                      name="discrepancyDetails"
                      value={formData.discrepancyDetails}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required={formData.discrepanciesNoted}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Signatures */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Signatures</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transferrer Signature (Base64 or URL)
                  </label>
                  <textarea
                    name="transferrerSignature"
                    value={formData.transferrerSignature}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Paste signature image data URL or upload file"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Receiver Signature (Base64 or URL) *
                  </label>
                  <textarea
                    name="receiverSignature"
                    value={formData.receiverSignature}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Paste signature image data URL or upload file"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Witness Name
                  </label>
                  <input
                    type="text"
                    name="witnessName"
                    value={formData.witnessName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Witness Signature (Base64 or URL)
                  </label>
                  <textarea
                    name="witnessSignature"
                    value={formData.witnessSignature}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Paste signature image data URL"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Compliance */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Compliance</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="compliesWithProtocol"
                      checked={formData.compliesWithProtocol}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Complies with Protocol *
                    </span>
                  </label>
                </div>
                {!formData.compliesWithProtocol && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Protocol Deviations *
                      </label>
                      <textarea
                        name="protocolDeviations"
                        value={formData.protocolDeviations}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required={!formData.compliesWithProtocol}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Corrective Actions *
                      </label>
                      <textarea
                        name="correctiveActions"
                        value={formData.correctiveActions}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required={!formData.compliesWithProtocol}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Additional Notes */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Any additional notes or observations..."
              />
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Link href={`/dashboard/cases/${params.id}/custody`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Custody Transfer'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

