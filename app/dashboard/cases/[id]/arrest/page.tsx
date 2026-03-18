'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ArrestFormPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Arrest Information
    arrested: true,
    arrestDate: '',
    arrestTime: '',
    arrestLocation: '',
    arrestLocationAddress: '',
    arrestingAgency: '',
    arrestingOfficerName: '',
    arrestingOfficerRank: '',
    arrestingOfficerBadge: '',
    arrestingOfficerStation: '',
    arrestingOfficerPhone: '',
    arrestWarrantNumber: '',
    arrestWarrantDate: '',
    arrestReason: '',
    arrestCircumstances: '',
    resistedArrest: false,
    arrestWitnesses: '',
    
    // Case Reporting
    caseReportedBy: '',
    reporterRelationship: '',
    reporterContact: '',
    reportDate: '',
    reportTime: '',
    reportLocation: '',
    firstRespondingOfficer: '',
    
    // Custody Details
    detentionFacility: '',
    detentionFacilityAddress: '',
    custodyStartDate: '',
    custodyStartTime: '',
    custodyEndDate: '',
    custodyEndTime: '',
    cellNumber: '',
    custodyOfficerName: '',
    custodyOfficerBadge: '',
    
    // Release Information
    released: false,
    releaseDate: '',
    releaseTime: '',
    releaseType: '',
    releaseAuthority: '',
    releaseAuthorityRank: '',
    releaseDocumentNumber: '',
    
    // Bail Information
    bailGranted: false,
    bailAmount: '',
    bailConditions: '',
    bailBondNumber: '',
    bailGrantedBy: '',
    bailGrantedDate: '',
    
    // Surety Information
    suretyRequired: false,
    suretyFullName: '',
    suretyDateOfBirth: '',
    suretyGender: '',
    suretyNIN: '',
    suretyPhoneNumber: '',
    suretyEmail: '',
    suretyOccupation: '',
    suretyEmployer: '',
    suretyAddress: '',
    suretyCity: '',
    suretyState: '',
    suretyLGA: '',
    suretyRelationshipToAccused: '',
    suretyIDType: '',
    suretyIDNumber: '',
    
    // Address Verification
    addressVerified: false,
    addressVerifiedBy: '',
    addressVerifierRank: '',
    addressVerifierBadge: '',
    addressVerificationDate: '',
    addressVerificationReport: '',
    landlordName: '',
    landlordContact: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/cases/${params.id}/arrest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Arrest information saved successfully');
        router.push(`/dashboard/cases/${params.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save arrest information');
      }
    } catch (error) {
      console.error('Error saving arrest information:', error);
      alert('Failed to save arrest information');
    } finally {
      setLoading(false);
    }
  };

  const calculateCustodyDuration = () => {
    if (formData.custodyStartDate && formData.custodyEndDate) {
      const start = new Date(`${formData.custodyStartDate}T${formData.custodyStartTime || '00:00'}`);
      const end = new Date(`${formData.custodyEndDate}T${formData.custodyEndTime || '00:00'}`);
      const hours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
      return hours > 0 ? hours : 0;
    }
    return 0;
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Arrest Information Form</h1>
          <p className="text-gray-600 mt-1">
            Complete and detailed arrest documentation
          </p>
        </div>

        {/* Progress Indicator */}
        <Card>
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 6 && (
                  <div className={`w-16 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span>Case Report</span>
            <span>Arrest Details</span>
            <span>Custody Info</span>
            <span>Release Info</span>
            <span>Bail & Surety</span>
            <span>Verification</span>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Case Reporting Information */}
          {step === 1 && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Step 1: Case Reporting Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Who Reported the Case? *
                  </label>
                  <input
                    type="text"
                    name="caseReportedBy"
                    required
                    value={formData.caseReportedBy}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full name of person who reported"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship to Victim *
                  </label>
                  <select
                    name="reporterRelationship"
                    required
                    value={formData.reporterRelationship}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select relationship</option>
                    <option value="VICTIM">Victim (Self)</option>
                    <option value="FAMILY_MEMBER">Family Member</option>
                    <option value="FRIEND">Friend</option>
                    <option value="NEIGHBOR">Neighbor</option>
                    <option value="WITNESS">Witness</option>
                    <option value="NGO">NGO/Organization</option>
                    <option value="POLICE">Police</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reporter Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="reporterContact"
                    required
                    value={formData.reporterContact}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+234-800-000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Date *
                  </label>
                  <input
                    type="date"
                    name="reportDate"
                    required
                    value={formData.reportDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Time *
                  </label>
                  <input
                    type="time"
                    name="reportTime"
                    required
                    value={formData.reportTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Location (Station/Office) *
                  </label>
                  <input
                    type="text"
                    name="reportLocation"
                    required
                    value={formData.reportLocation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Lagos State Police Command"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Responding Officer
                  </label>
                  <input
                    type="text"
                    name="firstRespondingOfficer"
                    value={formData.firstRespondingOfficer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name and rank of first responding officer"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Arrest Details */}
          {step === 2 && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Step 2: Arrest Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arrest Date *
                  </label>
                  <input
                    type="date"
                    name="arrestDate"
                    required
                    value={formData.arrestDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arrest Time *
                  </label>
                  <input
                    type="time"
                    name="arrestTime"
                    required
                    value={formData.arrestTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arrest Location *
                  </label>
                  <input
                    type="text"
                    name="arrestLocation"
                    required
                    value={formData.arrestLocation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Suspect&apos;s residence"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arrest Address *
                  </label>
                  <input
                    type="text"
                    name="arrestLocationAddress"
                    required
                    value={formData.arrestLocationAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full address"
                  />
                </div>
                
                <div className="md:col-span-2 border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-3">Arresting Officer Information</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arresting Agency *
                  </label>
                  <select
                    name="arrestingAgency"
                    required
                    value={formData.arrestingAgency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Agency</option>
                    <option value="POLICE">Police</option>
                    <option value="NSCDC">NSCDC</option>
                    <option value="MILITARY_POLICE">Military Police</option>
                    <option value="DSS">DSS</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Officer Name *
                  </label>
                  <input
                    type="text"
                    name="arrestingOfficerName"
                    required
                    value={formData.arrestingOfficerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rank *
                  </label>
                  <input
                    type="text"
                    name="arrestingOfficerRank"
                    required
                    value={formData.arrestingOfficerRank}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Inspector"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Badge/Service Number *
                  </label>
                  <input
                    type="text"
                    name="arrestingOfficerBadge"
                    required
                    value={formData.arrestingOfficerBadge}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Badge number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Station/Command *
                  </label>
                  <input
                    type="text"
                    name="arrestingOfficerStation"
                    required
                    value={formData.arrestingOfficerStation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Police station"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Officer Contact
                  </label>
                  <input
                    type="tel"
                    name="arrestingOfficerPhone"
                    value={formData.arrestingOfficerPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+234-800-000-0000"
                  />
                </div>
                
                <div className="md:col-span-2 border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-3">Arrest Warrant (if applicable)</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warrant Number
                  </label>
                  <input
                    type="text"
                    name="arrestWarrantNumber"
                    value={formData.arrestWarrantNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Warrant number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warrant Date
                  </label>
                  <input
                    type="date"
                    name="arrestWarrantDate"
                    value={formData.arrestWarrantDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Arrest *
                  </label>
                  <textarea
                    name="arrestReason"
                    required
                    value={formData.arrestReason}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="State the reason for arrest..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Circumstances of Arrest *
                  </label>
                  <textarea
                    name="arrestCircumstances"
                    required
                    value={formData.arrestCircumstances}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the circumstances surrounding the arrest..."
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="resistedArrest"
                      checked={formData.resistedArrest}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Suspect resisted arrest
                    </span>
                  </label>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arrest Witnesses (comma-separated names)
                  </label>
                  <input
                    type="text"
                    name="arrestWitnesses"
                    value={formData.arrestWitnesses}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Names of witnesses present during arrest"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Step 3: Custody Information */}
          {step === 3 && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Step 3: Custody Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detention Facility *
                  </label>
                  <input
                    type="text"
                    name="detentionFacility"
                    required
                    value={formData.detentionFacility}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name of detention facility"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facility Address *
                  </label>
                  <input
                    type="text"
                    name="detentionFacilityAddress"
                    required
                    value={formData.detentionFacilityAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full address of facility"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custody Start Date *
                  </label>
                  <input
                    type="date"
                    name="custodyStartDate"
                    required
                    value={formData.custodyStartDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custody Start Time *
                  </label>
                  <input
                    type="time"
                    name="custodyStartTime"
                    required
                    value={formData.custodyStartTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custody End Date
                  </label>
                  <input
                    type="date"
                    name="custodyEndDate"
                    value={formData.custodyEndDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custody End Time
                  </label>
                  <input
                    type="time"
                    name="custodyEndTime"
                    value={formData.custodyEndTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {formData.custodyStartDate && formData.custodyEndDate && (
                  <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900">
                      Total Custody Duration: {calculateCustodyDuration()} hours
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cell/Room Number
                  </label>
                  <input
                    type="text"
                    name="cellNumber"
                    value={formData.cellNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cell number"
                  />
                </div>
                
                <div className="md:col-span-2 border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-3">Custody Officer</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Officer Name
                  </label>
                  <input
                    type="text"
                    name="custodyOfficerName"
                    value={formData.custodyOfficerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Custody officer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Badge/Service Number
                  </label>
                  <input
                    type="text"
                    name="custodyOfficerBadge"
                    value={formData.custodyOfficerBadge}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Badge number"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Step 4: Release Information */}
          {step === 4 && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Step 4: Release Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="released"
                      checked={formData.released}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Has the accused been released from custody?
                    </span>
                  </label>
                </div>

                {formData.released && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Release Date *
                      </label>
                      <input
                        type="date"
                        name="releaseDate"
                        required
                        value={formData.releaseDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Release Time *
                      </label>
                      <input
                        type="time"
                        name="releaseTime"
                        required
                        value={formData.releaseTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Release Type *
                      </label>
                      <select
                        name="releaseType"
                        required
                        value={formData.releaseType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select release type</option>
                        <option value="SELF_RECOGNITION">Self Recognition</option>
                        <option value="BAIL">Released on Bail</option>
                        <option value="COURT_ORDER">Court Order</option>
                        <option value="POLICE_BAIL">Police Bail</option>
                        <option value="ACQUITTAL">Acquittal</option>
                        <option value="DISCHARGE">Discharge</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Release Authority *
                      </label>
                      <input
                        type="text"
                        name="releaseAuthority"
                        required
                        value={formData.releaseAuthority}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Name of authorizing officer/judge"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Authority Rank/Title
                      </label>
                      <input
                        type="text"
                        name="releaseAuthorityRank"
                        value={formData.releaseAuthorityRank}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Rank or title"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Release Document Number
                      </label>
                      <input
                        type="text"
                        name="releaseDocumentNumber"
                        value={formData.releaseDocumentNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Document/order number"
                      />
                    </div>
                  </div>
                )}

                {!formData.released && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      The accused is currently in custody. Complete this section when they are released.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Step 5: Bail & Surety Information */}
          {step === 5 && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Step 5: Bail & Surety Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="bailGranted"
                      checked={formData.bailGranted}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Was bail granted?
                    </span>
                  </label>
                </div>

                {formData.bailGranted && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bail Amount (₦) *
                        </label>
                        <input
                          type="number"
                          name="bailAmount"
                          required
                          value={formData.bailAmount}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bail Bond Number
                        </label>
                        <input
                          type="text"
                          name="bailBondNumber"
                          value={formData.bailBondNumber}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Bond number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bail Granted By
                        </label>
                        <input
                          type="text"
                          name="bailGrantedBy"
                          value={formData.bailGrantedBy}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Judge/Officer name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bail Grant Date
                        </label>
                        <input
                          type="date"
                          name="bailGrantedDate"
                          value={formData.bailGrantedDate}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bail Conditions
                        </label>
                        <textarea
                          name="bailConditions"
                          value={formData.bailConditions}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="List all bail conditions..."
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="mb-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="suretyRequired"
                            checked={formData.suretyRequired}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Surety Required
                          </span>
                        </label>
                      </div>

                      {formData.suretyRequired && (
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg">Surety Bio-Data</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Surety Full Name *
                              </label>
                              <input
                                type="text"
                                name="suretyFullName"
                                required
                                value={formData.suretyFullName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Full legal name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth *
                              </label>
                              <input
                                type="date"
                                name="suretyDateOfBirth"
                                required
                                value={formData.suretyDateOfBirth}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gender *
                              </label>
                              <select
                                name="suretyGender"
                                required
                                value={formData.suretyGender}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                National Identification Number (NIN) *
                              </label>
                              <input
                                type="text"
                                name="suretyNIN"
                                required
                                value={formData.suretyNIN}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="11-digit NIN"
                                maxLength={11}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number *
                              </label>
                              <input
                                type="tel"
                                name="suretyPhoneNumber"
                                required
                                value={formData.suretyPhoneNumber}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="+234-800-000-0000"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                              </label>
                              <input
                                type="email"
                                name="suretyEmail"
                                value={formData.suretyEmail}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="email@example.com"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Occupation *
                              </label>
                              <input
                                type="text"
                                name="suretyOccupation"
                                required
                                value={formData.suretyOccupation}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Occupation"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Employer
                              </label>
                              <input
                                type="text"
                                name="suretyEmployer"
                                value={formData.suretyEmployer}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Employer name"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Residential Address *
                              </label>
                              <input
                                type="text"
                                name="suretyAddress"
                                required
                                value={formData.suretyAddress}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Full residential address"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                City *
                              </label>
                              <input
                                type="text"
                                name="suretyCity"
                                required
                                value={formData.suretyCity}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="City"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                State *
                              </label>
                              <input
                                type="text"
                                name="suretyState"
                                required
                                value={formData.suretyState}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="State"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                LGA *
                              </label>
                              <input
                                type="text"
                                name="suretyLGA"
                                required
                                value={formData.suretyLGA}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Local Government Area"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Relationship to Accused *
                              </label>
                              <input
                                type="text"
                                name="suretyRelationshipToAccused"
                                required
                                value={formData.suretyRelationshipToAccused}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Brother, Friend, Colleague"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ID Type *
                              </label>
                              <select
                                name="suretyIDType"
                                required
                                value={formData.suretyIDType}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select ID type</option>
                                <option value="NIN">National ID (NIN)</option>
                                <option value="DRIVERS_LICENSE">Driver&apos;s License</option>
                                <option value="INTERNATIONAL_PASSPORT">International Passport</option>
                                <option value="VOTERS_CARD">Voter&apos;s Card</option>
                                <option value="OTHER">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ID Number *
                              </label>
                              <input
                                type="text"
                                name="suretyIDNumber"
                                required
                                value={formData.suretyIDNumber}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="ID number"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}

          {/* Step 6: Address Verification */}
          {step === 6 && formData.suretyRequired && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Step 6: Surety Address Verification</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="addressVerified"
                      checked={formData.addressVerified}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Address has been verified
                    </span>
                  </label>
                </div>

                {formData.addressVerified && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Verified By (Officer Name) *
                      </label>
                      <input
                        type="text"
                        name="addressVerifiedBy"
                        required
                        value={formData.addressVerifiedBy}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Officer name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Verifier Rank *
                      </label>
                      <input
                        type="text"
                        name="addressVerifierRank"
                        required
                        value={formData.addressVerifierRank}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Rank"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Badge/Service Number *
                      </label>
                      <input
                        type="text"
                        name="addressVerifierBadge"
                        required
                        value={formData.addressVerifierBadge}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Badge number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Verification Date *
                      </label>
                      <input
                        type="date"
                        name="addressVerificationDate"
                        required
                        value={formData.addressVerificationDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Verification Report *
                      </label>
                      <textarea
                        name="addressVerificationReport"
                        required
                        value={formData.addressVerificationReport}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Detailed verification report including findings, observations, and confirmation of address..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Landlord/Property Owner Name
                      </label>
                      <input
                        type="text"
                        name="landlordName"
                        value={formData.landlordName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Landlord name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Landlord Contact
                      </label>
                      <input
                        type="tel"
                        name="landlordContact"
                        value={formData.landlordContact}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+234-800-000-0000"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <div>
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {step < 6 && (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                >
                  Next
                </Button>
              )}
              {step === 6 && (
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Submit Arrest Form'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

