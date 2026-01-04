'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { formatDate, formatDateTime } from '@/lib/utils';

export default function CaseOverviewPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('basic');

  const { data: caseData, isLoading } = useQuery({
    queryKey: ['case', params.id],
    queryFn: async () => {
      const response = await axios.get(`/api/cases/${params.id}`);
      return response.data;
    },
    enabled: !!session,
  });

  if (!session || isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading case overview...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!caseData) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Case not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'incident', label: 'Incident Details' },
    { id: 'victims', label: 'Victim(s)' },
    { id: 'perpetrators', label: 'Perpetrator(s)' },
    { id: 'offences', label: 'Offences' },
    { id: 'witnesses', label: 'Witnesses' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'services', label: 'Services' },
  ];

  const InfoField = ({ label, value }: { label: string; value: any }) => (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <p className="text-base text-gray-900 mt-1">{value || 'N/A'}</p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href={`/dashboard/cases/${params.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Case
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {caseData.caseNumber}
              </h1>
              <p className="text-sm text-gray-600 mt-1">Complete Case Overview</p>
            </div>
          </div>
          <Badge variant="info">{caseData.status?.replace(/_/g, ' ')}</Badge>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Case Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField label="Case Number" value={caseData.caseNumber} />
                  <InfoField label="MOJ File Number" value={caseData.mojCaseNumber} />
                  <InfoField label="Title" value={caseData.title} />
                  <InfoField label="Case Type" value={caseData.caseType?.replace(/_/g, ' ')} />
                  <InfoField label="Status" value={caseData.status?.replace(/_/g, ' ')} />
                  <InfoField label="Priority" value={caseData.priority} />
                  <InfoField label="Jurisdiction" value={caseData.jurisdiction} />
                  <InfoField label="Reported Date" value={formatDate(caseData.reportedDate)} />
                  <div className="md:col-span-2">
                    <InfoField label="Description" value={caseData.description} />
                  </div>
                  <InfoField 
                    label="Created By" 
                    value={caseData.createdBy ? `${caseData.createdBy.firstName} ${caseData.createdBy.lastName}` : 'N/A'} 
                  />
                  <InfoField label="Created At" value={formatDateTime(caseData.createdAt)} />
                  {caseData.coordinator && (
                    <InfoField 
                      label="Coordinator" 
                      value={`${caseData.coordinator.firstName} ${caseData.coordinator.lastName}`} 
                    />
                  )}
                  {caseData.investigator && (
                    <InfoField 
                      label="Investigator" 
                      value={`${caseData.investigator.firstName} ${caseData.investigator.lastName}`} 
                    />
                  )}
                  <InfoField label="Sensitive Case" value={caseData.isSensitive ? 'Yes' : 'No'} />
                  <InfoField label="Media Involved" value={caseData.mediaInvolved ? 'Yes' : 'No'} />
                  <InfoField label="International" value={caseData.international ? 'Yes' : 'No'} />
                  <InfoField label="Cross Jurisdictional" value={caseData.crossJurisdictional ? 'Yes' : 'No'} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Incident Details Tab */}
          {activeTab === 'incident' && (
            <Card>
              <CardHeader>
                <CardTitle>Incident Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField label="Incident Date" value={formatDate(caseData.incidentDate)} />
                  <InfoField label="Incident State" value={caseData.incidentState} />
                  <InfoField label="Incident LGA" value={caseData.incidentLga} />
                  <InfoField label="Reported State" value={caseData.reportedState} />
                  <InfoField label="Reported LGA" value={caseData.reportedLga} />
                  <InfoField label="Assigned State" value={caseData.assignedState} />
                  <div className="md:col-span-2">
                    <InfoField label="Incident Address" value={caseData.incidentAddress} />
                  </div>
                  <div className="md:col-span-2">
                    <InfoField label="Reported Address" value={caseData.reportedAddress} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Victims Tab */}
          {activeTab === 'victims' && (
            <div className="space-y-4">
              {caseData.victims && caseData.victims.length > 0 ? (
                caseData.victims.map((victim: any, index: number) => (
                  <Card key={victim.id}>
                    <CardHeader>
                      <CardTitle>Victim {index + 1}: {victim.firstName} {victim.lastName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InfoField label="Victim Number" value={victim.victimNumber} />
                        <InfoField label="First Name" value={victim.firstName} />
                        <InfoField label="Middle Name" value={victim.middleName} />
                        <InfoField label="Last Name" value={victim.lastName} />
                        <InfoField label="Gender" value={victim.gender} />
                        <InfoField label="Age" value={victim.age} />
                        <InfoField label="Date of Birth" value={victim.dateOfBirth ? formatDate(victim.dateOfBirth) : 'N/A'} />
                        <InfoField label="Is Minor" value={victim.isMinor ? 'Yes' : 'No'} />
                        <InfoField label="Nationality" value={victim.nationality} />
                        <InfoField label="State of Origin" value={victim.stateOfOrigin} />
                        <InfoField label="LGA of Origin" value={victim.lgaOfOrigin} />
                        <InfoField label="Phone Number" value={victim.phoneNumber} />
                        <InfoField label="Email" value={victim.email} />
                        <InfoField label="Marital Status" value={victim.maritalStatus} />
                        <InfoField label="Occupation" value={victim.occupation} />
                        <InfoField label="Education Level" value={victim.educationLevel} />
                        <InfoField label="Religion" value={victim.religion} />
                        <InfoField label="Disability" value={victim.hasDisability ? 'Yes' : 'No'} />
                        <InfoField label="Disability Type" value={victim.disabilityType} />
                        <div className="md:col-span-2 lg:col-span-3">
                          <InfoField label="Current Address" value={victim.currentAddress} />
                        </div>
                        <InfoField label="Current City" value={victim.currentCity} />
                        <InfoField label="Current State" value={victim.currentState} />
                        <InfoField label="Current LGA" value={victim.currentLga} />
                        <InfoField label="Emergency Contact Name" value={victim.emergencyContactName} />
                        <InfoField label="Emergency Contact Phone" value={victim.emergencyContactPhone} />
                        <InfoField label="Emergency Contact Relationship" value={victim.emergencyContactRelationship} />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    No victim information available
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Perpetrators Tab */}
          {activeTab === 'perpetrators' && (
            <div className="space-y-4">
              {caseData.perpetrators && caseData.perpetrators.length > 0 ? (
                caseData.perpetrators.map((perp: any, index: number) => (
                  <Card key={perp.id}>
                    <CardHeader>
                      <CardTitle>Perpetrator {index + 1}: {perp.firstName} {perp.lastName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InfoField label="Perpetrator Number" value={perp.perpetratorNumber} />
                        <InfoField label="First Name" value={perp.firstName} />
                        <InfoField label="Middle Name" value={perp.middleName} />
                        <InfoField label="Last Name" value={perp.lastName} />
                        <InfoField label="Gender" value={perp.gender} />
                        <InfoField label="Age" value={perp.age} />
                        <InfoField label="Date of Birth" value={perp.dateOfBirth ? formatDate(perp.dateOfBirth) : 'N/A'} />
                        <InfoField label="Nationality" value={perp.nationality} />
                        <InfoField label="State of Origin" value={perp.stateOfOrigin} />
                        <InfoField label="Phone Number" value={perp.phoneNumber} />
                        <InfoField label="Email" value={perp.email} />
                        <InfoField label="Occupation" value={perp.occupation} />
                        <InfoField label="Relationship to Victim" value={perp.relationshipToVictim} />
                        <div className="md:col-span-2 lg:col-span-3">
                          <InfoField label="Aliases" value={perp.aliases?.join(', ')} />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                          <InfoField label="Current Address" value={perp.currentAddress} />
                        </div>
                        <InfoField label="Current City" value={perp.currentCity} />
                        <InfoField label="Current State" value={perp.currentState} />
                        <InfoField label="Current LGA" value={perp.currentLga} />
                        <InfoField label="Arrested" value={perp.arrested ? 'Yes' : 'No'} />
                        {perp.arrested && (
                          <>
                            <InfoField label="Arrest Date" value={perp.arrestDate ? formatDate(perp.arrestDate) : 'N/A'} />
                            <InfoField label="Arrest Location" value={perp.arrestLocation} />
                            <InfoField label="Arresting Agency" value={perp.arrestingAgency} />
                            <InfoField label="Arresting Officer" value={perp.arrestingOfficerName} />
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    No perpetrator information available
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Offences Tab */}
          {activeTab === 'offences' && (
            <div className="space-y-4">
              {caseData.courtRecords && caseData.courtRecords.length > 0 ? (
                caseData.courtRecords.map((record: any, index: number) => (
                  <Card key={record.id}>
                    <CardHeader>
                      <CardTitle>Offence {index + 1}: {record.offenceName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoField label="Offence Number" value={record.offenceNumber} />
                        <InfoField label="Offence Name" value={record.offenceName} />
                        <InfoField label="Offence Code" value={record.offenceCode} />
                        <InfoField label="Offence Category" value={record.offenceCategory} />
                        <InfoField label="Applicable Law" value={record.law} />
                        <InfoField label="Section" value={record.section} />
                        <InfoField label="Act" value={record.act} />
                        <InfoField label="Penalty" value={record.penalty} />
                        <InfoField label="Minimum Sentence" value={record.minimumSentence} />
                        <InfoField label="Maximum Sentence" value={record.maximumSentence} />
                        <InfoField label="Charge Date" value={record.chargeDate ? formatDate(record.chargeDate) : 'N/A'} />
                        <InfoField label="Charge Number" value={record.chargeNumber} />
                        <InfoField label="Charging Authority" value={record.chargingAuthority} />
                        <InfoField label="Charged By" value={record.chargedBy} />
                        <InfoField label="Trial Date" value={record.trialDate ? formatDate(record.trialDate) : 'N/A'} />
                        <InfoField label="Trial Location" value={record.trialLocation} />
                        <InfoField label="Court Name" value={record.courtName} />
                        <InfoField label="Presiding Judge" value={record.presidingJudge} />
                        <InfoField label="Plea Entered" value={record.pleaEntered ? 'Yes' : 'No'} />
                        {record.pleaEntered && (
                          <>
                            <InfoField label="Plea Type" value={record.pleaType} />
                            <InfoField label="Plea Date" value={record.pleaDate ? formatDate(record.pleaDate) : 'N/A'} />
                          </>
                        )}
                        <InfoField label="Verdict Reached" value={record.verdictReached ? 'Yes' : 'No'} />
                        {record.verdictReached && (
                          <>
                            <InfoField label="Verdict" value={record.verdict} />
                            <InfoField label="Verdict Date" value={record.verdictDate ? formatDate(record.verdictDate) : 'N/A'} />
                          </>
                        )}
                        <InfoField label="Sentenced" value={record.sentenced ? 'Yes' : 'No'} />
                        {record.sentenced && (
                          <>
                            <InfoField label="Sentence Type" value={record.sentenceType} />
                            <InfoField label="Sentence Duration" value={record.sentenceDuration} />
                            <InfoField label="Sentence Date" value={record.sentenceDate ? formatDate(record.sentenceDate) : 'N/A'} />
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    No offence records available
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Witnesses Tab */}
          {activeTab === 'witnesses' && (
            <div className="space-y-4">
              {caseData.witnesses && caseData.witnesses.length > 0 ? (
                caseData.witnesses.map((witness: any, index: number) => (
                  <Card key={witness.id}>
                    <CardHeader>
                      <CardTitle>Witness {index + 1}: {witness.firstName} {witness.lastName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InfoField label="Witness Number" value={witness.witnessNumber} />
                        <InfoField label="First Name" value={witness.firstName} />
                        <InfoField label="Middle Name" value={witness.middleName} />
                        <InfoField label="Last Name" value={witness.lastName} />
                        <InfoField label="Date of Birth" value={witness.dateOfBirth ? formatDate(witness.dateOfBirth) : 'N/A'} />
                        <InfoField label="Age" value={witness.age} />
                        <InfoField label="Gender" value={witness.gender} />
                        <InfoField label="Nationality" value={witness.nationality} />
                        <InfoField label="Occupation" value={witness.occupation} />
                        <InfoField label="Phone Number" value={witness.phoneNumber} />
                        <InfoField label="Alternate Phone" value={witness.alternatePhone} />
                        <InfoField label="Email" value={witness.email} />
                        <InfoField label="City" value={witness.city} />
                        <InfoField label="State" value={witness.state} />
                        <InfoField label="Relationship to Victim" value={witness.relationshipToVictim} />
                        <InfoField label="Relationship to Perpetrator" value={witness.relationshipToPerpetrator} />
                        <InfoField label="Witness Type" value={witness.witnessType} />
                        <InfoField label="Statement Date" value={witness.statementDate ? formatDate(witness.statementDate) : 'N/A'} />
                        <InfoField label="Statement Recorded By" value={witness.statementRecordedBy} />
                        <InfoField label="Statement Location" value={witness.statementLocation} />
                        <InfoField label="Statement Verified" value={witness.statementVerified ? 'Yes' : 'No'} />
                        <InfoField label="Statement Signed" value={witness.statementSigned ? 'Yes' : 'No'} />
                        <InfoField label="Credibility Rating" value={witness.credibilityRating} />
                        <InfoField label="Available for Testimony" value={witness.availableForTestimony ? 'Yes' : 'No'} />
                        <InfoField label="Court Appearance Date" value={witness.courtAppearanceDate ? formatDate(witness.courtAppearanceDate) : 'N/A'} />
                        <InfoField label="Court Appearance Confirmed" value={witness.courtAppearanceConfirmed ? 'Yes' : 'No'} />
                        <InfoField label="Needs Accommodation" value={witness.needsAccommodation ? 'Yes' : 'No'} />
                        <InfoField label="Protection Required" value={witness.protectionRequired ? 'Yes' : 'No'} />
                        <InfoField label="Protection Level" value={witness.protectionLevel} />
                        <InfoField label="Threat Level" value={witness.threatLevel} />
                        <InfoField label="Risk Level" value={witness.riskLevel} />
                        <InfoField label="Intimidation Attempts" value={witness.intimidationAttempts ? 'Yes' : 'No'} />
                        <InfoField label="Is Minor" value={witness.isMinor ? 'Yes' : 'No'} />
                        <div className="md:col-span-2 lg:col-span-3">
                          <InfoField label="Address" value={witness.address} />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                          <InfoField label="Statement Text" value={witness.statementText} />
                        </div>
                        {witness.credibilityNotes && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Credibility Notes" value={witness.credibilityNotes} />
                          </div>
                        )}
                        {witness.inconsistencies && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Inconsistencies" value={witness.inconsistencies} />
                          </div>
                        )}
                        {witness.corroboratingEvidence && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Corroborating Evidence" value={witness.corroboratingEvidence} />
                          </div>
                        )}
                        {witness.testimonyChallenges && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Testimony Challenges" value={witness.testimonyChallenges} />
                          </div>
                        )}
                        {witness.accommodationDetails && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Accommodation Details" value={witness.accommodationDetails} />
                          </div>
                        )}
                        {witness.protectionMeasures && witness.protectionMeasures.length > 0 && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Protection Measures" value={witness.protectionMeasures.join(', ')} />
                          </div>
                        )}
                        {witness.threatsReceived && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Threats Received" value={witness.threatsReceived} />
                          </div>
                        )}
                        {witness.riskFactors && witness.riskFactors.length > 0 && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Risk Factors" value={witness.riskFactors.join(', ')} />
                          </div>
                        )}
                        {witness.intimidationDetails && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Intimidation Details" value={witness.intimidationDetails} />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    No witness information available
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Evidence Tab */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              {caseData.evidence && caseData.evidence.length > 0 ? (
                caseData.evidence.map((item: any, index: number) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>Evidence {index + 1}: {item.evidenceName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InfoField label="Evidence Number" value={item.evidenceNumber} />
                        <InfoField label="Evidence Type" value={item.evidenceType} />
                        <InfoField label="Category" value={item.category} />
                        <InfoField label="Subcategory" value={item.subcategory} />
                        <InfoField label="Collection Date" value={item.collectedDate ? formatDate(item.collectedDate) : 'N/A'} />
                        <InfoField label="Collection Time" value={item.collectedTime} />
                        <InfoField label="Collected By" value={item.collectedByName} />
                        <InfoField label="Collection Location" value={item.collectionLocation} />
                        <InfoField label="Collection Method" value={item.collectionMethod} />
                        <InfoField label="Quantity" value={item.quantity} />
                        <InfoField label="Condition" value={item.condition} />
                        <InfoField label="Color" value={item.color} />
                        <InfoField label="Material" value={item.material} />
                        <InfoField label="Weight" value={item.weight} />
                        <InfoField label="Dimensions" value={item.dimensions} />
                        <InfoField label="Storage Location" value={item.storageLocation} />
                        <InfoField label="Storage Type" value={item.storageType} />
                        <InfoField label="Container Type" value={item.containerType} />
                        <InfoField label="Seal Number" value={item.sealNumber} />
                        <InfoField label="Forensic Analysis Required" value={item.forensicAnalysisRequired ? 'Yes' : 'No'} />
                        <InfoField label="Forensic Analysis Requested" value={item.forensicAnalysisRequested ? 'Yes' : 'No'} />
                        {item.forensicAnalysisDate && (
                          <InfoField label="Forensic Analysis Date" value={formatDate(item.forensicAnalysisDate)} />
                        )}
                        <InfoField label="Forensic Lab" value={item.forensicLab} />
                        <InfoField label="Forensic Analyst" value={item.forensicAnalystName} />
                        <InfoField label="Forensic Report Number" value={item.forensicReportNumber} />
                        <InfoField label="DNA Profile" value={item.dnaProfile} />
                        <InfoField label="Fingerprints Found" value={item.fingerprintsFound ? 'Yes' : 'No'} />
                        <InfoField label="Admissible" value={item.admissible ? 'Yes' : 'No'} />
                        {item.deviceType && (
                          <>
                            <InfoField label="Device Type" value={item.deviceType} />
                            <InfoField label="Device Make" value={item.deviceMake} />
                            <InfoField label="Device Model" value={item.deviceModel} />
                            <InfoField label="Serial Number" value={item.deviceSerialNumber} />
                            <InfoField label="Storage Capacity" value={item.storageCapacity} />
                          </>
                        )}
                        {item.dataType && (
                          <>
                            <InfoField label="Data Type" value={item.dataType} />
                            <InfoField label="File Format" value={item.fileFormat} />
                            <InfoField label="File Size" value={item.fileSize} />
                            <InfoField label="Hash Value" value={item.hashValue} />
                          </>
                        )}
                        <div className="md:col-span-2 lg:col-span-3">
                          <InfoField label="Description" value={item.description} />
                        </div>
                        {item.physicalDescription && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Physical Description" value={item.physicalDescription} />
                          </div>
                        )}
                        {item.collectionCircumstances && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Collection Circumstances" value={item.collectionCircumstances} />
                          </div>
                        )}
                        {item.storageConditions && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Storage Conditions" value={item.storageConditions} />
                          </div>
                        )}
                        {item.forensicFindings && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Forensic Findings" value={item.forensicFindings} />
                          </div>
                        )}
                        {item.admissibilityNotes && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Admissibility Notes" value={item.admissibilityNotes} />
                          </div>
                        )}
                        {item.legalChallenges && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Legal Challenges" value={item.legalChallenges} />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    No evidence records available
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              {caseData.services && caseData.services.length > 0 ? (
                caseData.services.map((service: any, index: number) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <CardTitle>Service {index + 1}: {service.serviceType}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InfoField label="Service Number" value={service.serviceNumber} />
                        <InfoField label="Service Type" value={service.serviceType} />
                        <InfoField label="Service Name" value={service.serviceName} />
                        <InfoField label="Service Category" value={service.serviceCategory} />
                        <InfoField label="Provider Name" value={service.providerName} />
                        <InfoField label="Provider Type" value={service.providerType} />
                        <InfoField label="Provider Contact" value={service.providerContact} />
                        <InfoField label="Provider Email" value={service.providerEmail} />
                        <InfoField label="Provider Phone" value={service.providerPhone} />
                        <InfoField label="Referral Date" value={service.referralDate ? formatDate(service.referralDate) : 'N/A'} />
                        <InfoField label="Referred By" value={service.referredByName} />
                        <InfoField label="Urgency" value={service.urgency} />
                        <InfoField label="Service Status" value={service.serviceStatus} />
                        <InfoField label="Appointment Scheduled" value={service.appointmentScheduled ? 'Yes' : 'No'} />
                        {service.appointmentScheduled && (
                          <>
                            <InfoField label="Appointment Date" value={service.appointmentDate ? formatDate(service.appointmentDate) : 'N/A'} />
                            <InfoField label="Appointment Time" value={service.appointmentTime} />
                            <InfoField label="Appointment Location" value={service.appointmentLocation} />
                            <InfoField label="Appointment Confirmed" value={service.appointmentConfirmed ? 'Yes' : 'No'} />
                            <InfoField label="Appointment Attended" value={service.appointmentAttended ? 'Yes' : 'No'} />
                          </>
                        )}
                        <InfoField label="Service Start Date" value={service.serviceStartDate ? formatDate(service.serviceStartDate) : 'N/A'} />
                        <InfoField label="Service End Date" value={service.serviceEndDate ? formatDate(service.serviceEndDate) : 'N/A'} />
                        <InfoField label="Service Duration (days)" value={service.serviceDuration} />
                        <InfoField label="Sessions Planned" value={service.sessionsPlanned} />
                        <InfoField label="Sessions Completed" value={service.sessionsCompleted} />
                        <InfoField label="Estimated Cost" value={service.estimatedCost ? `₦${service.estimatedCost}` : 'N/A'} />
                        <InfoField label="Actual Cost" value={service.actualCost ? `₦${service.actualCost}` : 'N/A'} />
                        <InfoField label="Funding Source" value={service.fundingSource} />
                        <InfoField label="Payment Status" value={service.paymentStatus} />
                        <InfoField label="Outcome Achieved" value={service.outcomeAchieved === true ? 'Yes' : service.outcomeAchieved === false ? 'No' : 'N/A'} />
                        <InfoField label="Beneficiary Satisfaction" value={service.beneficiarySatisfaction} />
                        <InfoField label="Follow-up Required" value={service.followUpRequired ? 'Yes' : 'No'} />
                        {service.followUpRequired && (
                          <InfoField label="Follow-up Date" value={service.followUpDate ? formatDate(service.followUpDate) : 'N/A'} />
                        )}
                        <div className="md:col-span-2 lg:col-span-3">
                          <InfoField label="Provider Address" value={service.providerAddress} />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                          <InfoField label="Referral Reason" value={service.referralReason} />
                        </div>
                        {service.appointmentOutcome && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Appointment Outcome" value={service.appointmentOutcome} />
                          </div>
                        )}
                        {service.outcomeDescription && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Outcome Description" value={service.outcomeDescription} />
                          </div>
                        )}
                        {service.feedback && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Feedback" value={service.feedback} />
                          </div>
                        )}
                        {service.notes && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <InfoField label="Notes" value={service.notes} />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    No service records available
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
