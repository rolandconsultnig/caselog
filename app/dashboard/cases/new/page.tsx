'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import axios from 'axios';
import { getPermissions } from '@/lib/permissions';
import { TenantType } from '@prisma/client';
import { MultiStepForm, FormStep } from '@/components/ui/MultiStepForm';
import { NIGERIAN_STATES, getLGAsByState } from '@/lib/nigerian-locations';
import { generateMOJFileNumber, getStateCodeFromName } from '@/lib/generate-moj-number';
import offencesData from '@/lib/offences-reference.json';

type OffenceRef = {
  offenceName: string;
  offenceCategory?: string;
  section?: string;
  act?: string;
  law?: string;
  penalty?: string;
};

const offenceRefs = offencesData as unknown as OffenceRef[];

export default function NewCasePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isFederalUser, setIsFederalUser] = useState(false);
  const [availableLGAs, setAvailableLGAs] = useState<string[]>([]);

  const parseDdMmYyyyToDate = (value: string): Date | null => {
    const trimmed = value.trim();
    const match = /^([0-3]\d)-([0-1]\d)-(\d{4})$/.exec(trimmed);
    if (!match) return null;

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return null;
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;

    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  };

  const permissions = session
    ? getPermissions(session.user.accessLevel, session.user.tenantType as TenantType)
    : null;

  // Form state
  const [formData, setFormData] = useState({
    // Case overview
    title: '',
    description: '',
    incidentDate: '',
    incidentState: '',
    incidentLga: '',
    incidentAddress: '',
    priority: 'MEDIUM',
    formOfSGBV: 'RAPE',
    legalServiceType: 'PROSECUTION',
    dateCharged: '',
    chargeNumber: '',
    dateFiledInCourt: '',
    administrativeNumber: '',
    mojCaseNumber: '',
    dateOfArraignment: '',
    bailConditions: '',
    statusOfCase: '',
    suspectReleasedOnBail: false,
    bailReleaseDate: '',
    suretysNIN: '',
    suretysPhoneNumber: '',

    // Victim
    victim: {
      name: '',
      complainantName: '',
      gender: 'FEMALE',
      age: 0,
      dateOfBirth: '',
      phoneNumber: '',
      email: '',
      educationQualification: '',
      nationality: 'Nigerian',
      maritalStatus: 'SINGLE',
      occupation: '',
      address: '',
      language: '',
      fingerprintId: '',
      faceRecognitionId: '',
      guardianName: '',
      guardianPhoneNumber: '',
      guardianAddress: '',
    },

    // Perpetrator
    perpetrator: {
      name: '',
      dateOfBirth: '',
      placeOfBirth: '',
      age: 0,
      address: '',
      phoneNumber: '',
      email: '',
      gender: 'MALE',
      educationQualification: '',
      nationality: 'Nigerian',
      maritalStatus: 'SINGLE',
      language: '',
      occupation: '',
      relationshipWithVictim: '',
      previousCriminalHistory: '',
      fingerprintId: '',
      faceRecognitionId: '',
    },

    // Offence
    offence: {
      dateOfOffence: '',
      placeOfOffence: '',
      natureOfOffence: '',
      offenceCode: '',
      offenceName: '',
      applicableLaw: '',
      penalty: '',
      dateReported: '',
      suspectArrested: false,
      dateArrested: '',
      dateInvestigationStarted: '',
      investigationStatus: '',
      suspectReleasedOnBail: false,
      addressOfInvestigatingAgency: '',
    },

    // Medical & Autopsy Reports
    victimDied: false,
    medicalReport: '',
    medicalReportUpload: null as File | null,
    autopsyReport: '',
    autopsyReportUpload: null as File | null,

    // Evidence & Forensic
    evidenceStorageLocation: '',
    chainOfCustody: {
      transferredFrom: '',
      transferredTo: '',
      transferDate: '',
      purpose: '',
      condition: '',
      receivedBy: '',
      notes: '',
    },
    forensicExaminer: {
      name: '',
      id: '',
      agency: '',
      contact: '',
    },
  });

  // Auto-populate incident state based on user's tenant
  useEffect(() => {
    if (session?.user) {
      const userTenantName = session.user.tenantName || '';
      const isFederal = session.user.tenantType === 'FEDERAL';
      setIsFederalUser(isFederal);
      
      // If not federal user, auto-populate incident state with user's state
      if (!isFederal && userTenantName) {
        setFormData(prev => ({
          ...prev,
          incidentState: userTenantName
        }));
        // Load LGAs for user's state
        const lgas = getLGAsByState(userTenantName);
        setAvailableLGAs(lgas);
      }
    }
  }, [session]);

  useEffect(() => {
    if (!session?.user) return;

    const isFederal = session.user.tenantType === 'FEDERAL';
    const userTenantName = session.user.tenantName || '';
    const stateNameForMoj = isFederal ? formData.incidentState : userTenantName;

    if (!stateNameForMoj) return;

    const stateCode = getStateCodeFromName(stateNameForMoj);
    const mojNumber = generateMOJFileNumber(stateCode);

    setFormData((prev) =>
      prev.mojCaseNumber === mojNumber
        ? prev
        : {
            ...prev,
            mojCaseNumber: mojNumber,
          }
    );
  }, [session, formData.incidentState]);

  // Update available LGAs when incident state changes
  useEffect(() => {
    if (formData.incidentState) {
      const lgas = getLGAsByState(formData.incidentState);
      setAvailableLGAs(lgas);
      // Reset LGA selection if state changes
      if (formData.incidentLga && !lgas.includes(formData.incidentLga)) {
        setFormData(prev => ({ ...prev, incidentLga: '' }));
      }
    } else {
      setAvailableLGAs([]);
    }
  }, [formData.incidentState, formData.incidentLga]);

  useEffect(() => {
    if (!formData.offence.offenceName) return;

    const selected = offenceRefs.find(
      (o) => o.offenceName === formData.offence.offenceName
    );

    if (!selected) return;

    const offenceCode = selected.section || '';
    const applicableLaw = selected.act
      ? `${selected.section} ${selected.act}`
      : selected.law
        ? `${selected.section} ${selected.law}`
        : selected.section || '';

    setFormData((prev) => {
      const next = {
        ...prev,
        offence: {
          ...prev.offence,
          offenceCode,
          applicableLaw,
          penalty: prev.offence.penalty || selected.penalty || '',
        },
      };

      if (
        next.offence.offenceCode === prev.offence.offenceCode &&
        next.offence.applicableLaw === prev.offence.applicableLaw &&
        next.offence.penalty === prev.offence.penalty
      ) {
        return prev;
      }

      return next;
    });
  }, [formData.offence.offenceName]);

  // Step validation functions
  const validateStep0 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!formData.title.trim()) errors.push('Case Title is required');
    if (!formData.description.trim()) errors.push('Case Description is required');
    if (!formData.incidentDate) errors.push('Incident Date is required');
    if (formData.incidentDate && !parseDdMmYyyyToDate(formData.incidentDate)) {
      errors.push('Incident Date must be in DD-MM-YYYY format');
    }
    if (!formData.incidentState) errors.push('Incident State is required');
    if (!formData.incidentLga) errors.push('Incident LGA is required');
    return { isValid: errors.length === 0, errors };
  };

  const validateStep1 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!formData.victim.name.trim()) errors.push('Victim Name is required');
    if (!formData.victim.gender) errors.push('Victim Gender is required');
    if (!formData.victim.age || formData.victim.age <= 0) errors.push('Victim Age is required and must be greater than 0');
    if (formData.victim.age > 0 && formData.victim.age < 18) {
      if (!formData.victim.guardianName.trim()) errors.push('Guardian Name is required for minors');
      if (!formData.victim.guardianPhoneNumber.trim()) errors.push('Guardian Phone Number is required for minors');
    }
    return { isValid: errors.length === 0, errors };
  };

  const validateStep2 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!formData.perpetrator.name.trim()) errors.push('Perpetrator Name is required');
    if (!formData.perpetrator.gender) errors.push('Perpetrator Gender is required');
    if (!formData.perpetrator.age || formData.perpetrator.age <= 0) errors.push('Perpetrator Age is required and must be greater than 0');
    return { isValid: errors.length === 0, errors };
  };

  const validateStep3 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!formData.offence.offenceName.trim()) errors.push('Offence Name is required');
    if (!formData.offence.offenceCode.trim()) errors.push('Offence Code is required');
    if (!formData.offence.applicableLaw.trim()) errors.push('Applicable Law is required');
    if (!formData.offence.dateOfOffence) errors.push('Date of Offence is required');
    if (formData.offence.dateOfOffence && !parseDdMmYyyyToDate(formData.offence.dateOfOffence)) {
      errors.push('Date of Offence must be in DD-MM-YYYY format');
    }
    if (formData.offence.dateReported && !parseDdMmYyyyToDate(formData.offence.dateReported)) {
      errors.push('Date Reported must be in DD-MM-YYYY format');
    }
    if (formData.offence.dateArrested && !parseDdMmYyyyToDate(formData.offence.dateArrested)) {
      errors.push('Date Arrested must be in DD-MM-YYYY format');
    }
    if (!formData.offence.placeOfOffence.trim()) errors.push('Place of Offence is required');
    if (!formData.offence.natureOfOffence.trim()) errors.push('Nature of Offence is required');
    if ((formData.legalServiceType === 'PROSECUTION' || formData.legalServiceType === 'FORENSIC_INTERVIEW') && !formData.chargeNumber.trim()) {
      errors.push('Charge Number is required when Prosecution or Forensic Interview is selected');
    }
    if (formData.suspectReleasedOnBail) {
      if (!formData.bailReleaseDate) errors.push('Bail Release Date is required');
      if (!formData.suretysNIN.trim()) errors.push("Surety's NIN is required");
      if (!formData.suretysPhoneNumber.trim()) errors.push("Surety's Phone Number is required");
    }
    return { isValid: errors.length === 0, errors };
  };

  const validateStep4 = (): { isValid: boolean; errors: string[] } => {
    // Medical & Autopsy Reports - optional step, no validation required
    return { isValid: true, errors: [] };
  };

  const validateStep5 = (): { isValid: boolean; errors: string[] } => {
    // Evidence and chain of custody are optional
    return { isValid: true, errors: [] };
  };

  const validateStep6 = (): { isValid: boolean; errors: string[] } => {
    // Forensic examiner details are optional
    return { isValid: true, errors: [] };
  };

  const stepValidators = [
    validateStep0,
    validateStep1,
    validateStep2,
    validateStep3,
    validateStep4,
    validateStep5,
    validateStep6,
  ];

  const handleSubmit = async () => {
    // Final validation - check all steps
    const allValidations = stepValidators.map((validator) => validator());
    const allErrors = allValidations.flatMap(v => v.errors);
    
    if (allErrors.length > 0) {
      toast.error(`Please fix all errors before submitting. ${allErrors.length} error(s) found.`);
      return;
    }

    try {
      const incidentDateParsed = parseDdMmYyyyToDate(formData.incidentDate);
      const victimDobParsed = formData.victim.dateOfBirth ? parseDdMmYyyyToDate(formData.victim.dateOfBirth) : null;
      const perpetratorDobParsed = formData.perpetrator.dateOfBirth ? parseDdMmYyyyToDate(formData.perpetrator.dateOfBirth) : null;
      const offenceDateParsed = formData.offence.dateOfOffence ? parseDdMmYyyyToDate(formData.offence.dateOfOffence) : null;

      // Prepare the data payload
      const payload = {
        title: formData.title,
        description: formData.description,
        incidentDate: incidentDateParsed ? incidentDateParsed.toISOString() : new Date().toISOString(),
        incidentState: formData.incidentState,
        incidentLga: formData.incidentLga,
        incidentAddress: formData.incidentAddress,
        formOfSGBV: formData.formOfSGBV,
        priority: formData.priority,
        victim: {
          name: formData.victim.name,
          firstName: formData.victim.name?.split(' ')[0] || '',
          lastName: formData.victim.name?.split(' ').slice(1).join(' ') || '',
          age: parseInt(formData.victim.age?.toString() || '0'),
          gender: formData.victim.gender,
          dateOfBirth: victimDobParsed ? victimDobParsed.toISOString() : null,
          phoneNumber: formData.victim.phoneNumber || null,
          email: formData.victim.email || null,
          address: formData.victim.address || null,
          nationality: formData.victim.nationality || 'Nigerian',
          complainantName: formData.victim.complainantName || null,
          guardianName: formData.victim.guardianName || null,
          guardianPhoneNumber: formData.victim.guardianPhoneNumber || null,
          guardianAddress: formData.victim.guardianAddress || null,
        },
        perpetrator: {
          name: formData.perpetrator.name,
          firstName: formData.perpetrator.name?.split(' ')[0] || '',
          lastName: formData.perpetrator.name?.split(' ').slice(1).join(' ') || '',
          age: formData.perpetrator.age ? parseInt(formData.perpetrator.age.toString()) : null,
          gender: formData.perpetrator.gender,
          dateOfBirth: perpetratorDobParsed ? perpetratorDobParsed.toISOString() : null,
          placeOfBirth: formData.perpetrator.placeOfBirth || null,
          phoneNumber: formData.perpetrator.phoneNumber || null,
          email: formData.perpetrator.email || null,
          address: formData.perpetrator.address || null,
          nationality: formData.perpetrator.nationality || 'Nigerian',
          relationshipWithVictim: formData.perpetrator.relationshipWithVictim || null,
          previousCriminalHistory: formData.perpetrator.previousCriminalHistory || null,
        },
        offence: {
          dateOfOffence: offenceDateParsed ? offenceDateParsed.toISOString() : null,
          placeOfOffence: formData.offence.placeOfOffence || null,
          natureOfOffence: formData.offence.natureOfOffence || '',
          offenceName: formData.offence.offenceName || formData.offence.natureOfOffence || 'Offence',
          offenceCode: formData.offence.offenceCode || null,
          applicableLaw: formData.offence.applicableLaw || null,
          penalty: formData.offence.penalty || null,
        },
      };

      const response = await axios.post('/api/cases', payload);
      
      if (response.data && response.data.id) {
        toast.success('Case created successfully');
        router.push(`/dashboard/cases/${response.data.id}`);
      } else {
        toast.error('Case created but no ID returned');
        router.push('/dashboard/cases');
      }
    } catch (error: unknown) {
      console.error('Case creation error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
      }
      
      let errorMessage = 'Failed to create case';
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as
          | { error?: string; details?: unknown }
          | undefined;

        if (data?.error) {
          errorMessage = data.error;
        }

        const details = data?.details;
        if (Array.isArray(details)) {
          const detailText = details
            .map((d) => {
              if (typeof d === 'string') return d;
              if (d && typeof d === 'object' && 'message' in d && typeof (d as { message?: unknown }).message === 'string') {
                return (d as { message: string }).message;
              }
              return String(d);
            })
            .join(', ');
          if (detailText) {
            errorMessage += `: ${detailText}`;
          }
        } else if (typeof details === 'string' && details) {
          errorMessage += `: ${details}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  if (!session || !permissions?.canCreate) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-red-600">You do not have permission to create cases</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/cases">
            <Button type="button" variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cases
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Case</h1>
            <p className="text-sm text-gray-600 mt-1">
              Fill in the details to create a new SGBV case
            </p>
          </div>
        </div>
      </div>
      
      <MultiStepForm onSubmit={handleSubmit} stepValidators={stepValidators}>
        <FormStep>
          <Card>
            <CardHeader>
              <CardTitle>Case Overview</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Date *
                </label>
                <input
                  type="text"
                  required
                  value={formData.incidentDate}
                  onChange={(e) =>
                    setFormData({ ...formData, incidentDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="DD-MM-YYYY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident State *
                </label>
                {isFederalUser ? (
                  <select
                    required
                    value={formData.incidentState}
                    onChange={(e) =>
                      setFormData({ ...formData, incidentState: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select State</option>
                    {NIGERIAN_STATES.map((state) => (
                      <option key={state.code} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={formData.incidentState}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed focus:ring-2 focus:ring-green-500"
                    title="Auto-populated from your state"
                  />
                )}
                {!isFederalUser && (
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-populated from your state
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident LGA *
                </label>
                <select
                  required
                  value={formData.incidentLga}
                  onChange={(e) =>
                    setFormData({ ...formData, incidentLga: e.target.value })
                  }
                  disabled={!formData.incidentState || availableLGAs.length === 0}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select LGA</option>
                  {availableLGAs.map((lga) => (
                    <option key={lga} value={lga}>
                      {lga}
                    </option>
                  ))}
                </select>
                {!formData.incidentState && (
                  <p className="text-xs text-gray-500 mt-1">
                    Please select an incident state first
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Address
                </label>
                <textarea
                  value={formData.incidentAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, incidentAddress: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Priority *
                </label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Form of SGBV *
                </label>
                <select
                  required
                  value={formData.formOfSGBV}
                  onChange={(e) =>
                    setFormData({ ...formData, formOfSGBV: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="RAPE">Rape</option>
                  <option value="SEXUAL_ASSAULT">Sexual Assault</option>
                  <option value="DOMESTIC_VIOLENCE">Domestic Violence</option>
                  <option value="TRAFFICKING">Trafficking</option>
                  <option value="CHILD_ABUSE">Child Abuse</option>
                  <option value="FORCED_MARRIAGE">Forced Marriage</option>
                  <option value="FEMALE_GENITAL_MUTILATION">FGM</option>
                  <option value="HARMFUL_WIDOWHOOD_PRACTICES">Harmful Widowhood Practices</option>
                  <option value="SEXTORTION">Sextortion</option>
                  <option value="ONLINE_CHILD_SEXUAL_EXPLOITATION">Online Child Sexual Exploitation</option>
                  <option value="INTIMATE_IMAGE_ABUSE">Intimate Image Abuse</option>
                  <option value="EMOTIONAL_ABUSE">Emotional Abuse</option>
                  <option value="INCEST">Incest</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MOJ File Number
                </label>
                <input
                  type="text"
                  value={formData.mojCaseNumber}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed focus:ring-2 focus:ring-green-500"
                  title="Auto-generated MOJ File Number"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated based on state and year
                </p>
              </div>
            </div>
          </CardContent>
          </Card>
        </FormStep>
        <FormStep>
          <Card>
            <CardHeader>
              <CardTitle>Victim Details</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.victim.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      victim: { ...formData.victim, name: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name of Complainant
                </label>
                <input
                  type="text"
                  value={formData.victim.complainantName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      victim: { ...formData.victim, complainantName: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="If different from victim"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  required
                  value={formData.victim.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      victim: { ...formData.victim, gender: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.victim.age}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      victim: { ...formData.victim, age: parseInt(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.victim.phoneNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      victim: { ...formData.victim, phoneNumber: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.victim.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      victim: { ...formData.victim, email: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.victim.maritalStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      victim: { ...formData.victim, maritalStatus: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                  <option value="SEPARATED">Separated</option>
                  <option value="COHABITING">Cohabiting</option>
                  <option value="INTIMATE_PARTNER">Intimate Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  value={formData.victim.occupation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      victim: { ...formData.victim, occupation: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality
                </label>
                <input
                  type="text"
                  value={formData.victim.nationality}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      victim: { ...formData.victim, nationality: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.victim.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      victim: { ...formData.victim, address: e.target.value },
                    })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              {formData.victim.age > 0 && formData.victim.age < 18 && (
                <div className="md:col-span-2 border-t pt-4 mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Guardian Details (Required for Minors)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Guardian Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.victim.guardianName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            victim: { ...formData.victim, guardianName: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Guardian Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.victim.guardianPhoneNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            victim: { ...formData.victim, guardianPhoneNumber: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Guardian Address
                      </label>
                      <textarea
                        rows={2}
                        value={formData.victim.guardianAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            victim: { ...formData.victim, guardianAddress: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          </Card>
        </FormStep>
        <FormStep>
          <Card>
            <CardHeader>
              <CardTitle>Perpetrator/Suspect Details</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.perpetrator.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      perpetrator: { ...formData.perpetrator, name: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.perpetrator.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      perpetrator: { ...formData.perpetrator, gender: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.perpetrator.age || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      perpetrator: {
                        ...formData.perpetrator,
                        age: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.perpetrator.phoneNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      perpetrator: {
                        ...formData.perpetrator,
                        phoneNumber: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship with Victim
                </label>
                <input
                  type="text"
                  value={formData.perpetrator.relationshipWithVictim}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      perpetrator: {
                        ...formData.perpetrator,
                        relationshipWithVictim: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  value={formData.perpetrator.occupation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      perpetrator: {
                        ...formData.perpetrator,
                        occupation: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.perpetrator.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      perpetrator: {
                        ...formData.perpetrator,
                        address: e.target.value,
                      },
                    })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Criminal History
                </label>
                <textarea
                  value={formData.perpetrator.previousCriminalHistory}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      perpetrator: {
                        ...formData.perpetrator,
                        previousCriminalHistory: e.target.value,
                      },
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="md:col-span-2 border-t pt-6 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bail Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.suspectReleasedOnBail}
                        onChange={(e) =>
                          setFormData({ ...formData, suspectReleasedOnBail: e.target.checked })
                        }
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Suspect Released on Bail
                      </span>
                    </label>
                  </div>
                  {formData.suspectReleasedOnBail && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bail Release Date *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.bailReleaseDate}
                          onChange={(e) =>
                            setFormData({ ...formData, bailReleaseDate: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                          placeholder="DD-MM-YYYY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Surety&apos;s NIN *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.suretysNIN}
                          onChange={(e) =>
                            setFormData({ ...formData, suretysNIN: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Surety&apos;s Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.suretysPhoneNumber}
                          onChange={(e) =>
                            setFormData({ ...formData, suretysPhoneNumber: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          </Card>
        </FormStep>
        <FormStep>
          <Card>
            <CardHeader>
              <CardTitle>Offence & Investigation Details</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offence Name *
                </label>
                <select
                  required
                  value={formData.offence.offenceName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      offence: { ...formData.offence, offenceName: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- Select an offence --</option>
                  {Object.entries(
                    offenceRefs.reduce((acc: Record<string, OffenceRef[]>, offence) => {
                      const category = offence.offenceCategory || 'Other';
                      if (!acc[category]) acc[category] = [];
                      acc[category].push(offence);
                      return acc;
                    }, {})
                  ).map(([category, offences]) => (
                    <optgroup key={category} label={category}>
                      {offences.map((offence, idx) => (
                        <option key={`${category}-${idx}`} value={offence.offenceName}>
                          {offence.offenceName} ({offence.section})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offence Code
                </label>
                <input
                  type="text"
                  value={formData.offence.offenceCode}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Offence
                </label>
                <input
                  type="text"
                  value={formData.offence.dateOfOffence}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      offence: { ...formData.offence, dateOfOffence: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="DD-MM-YYYY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Reported
                </label>
                <input
                  type="text"
                  value={formData.offence.dateReported}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      offence: { ...formData.offence, dateReported: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="DD-MM-YYYY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicable Law
                </label>
                <input
                  type="text"
                  value={formData.offence.applicableLaw}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Section 1 VAPPA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investigation Status
                </label>
                <input
                  type="text"
                  value={formData.offence.investigationStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      offence: {
                        ...formData.offence,
                        investigationStatus: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.offence.suspectArrested}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        offence: {
                          ...formData.offence,
                          suspectArrested: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Suspect Arrested
                  </span>
                </label>
              </div>

              {formData.offence.suspectArrested && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Arrested
                  </label>
                  <input
                    type="text"
                    value={formData.offence.dateArrested}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        offence: {
                          ...formData.offence,
                          dateArrested: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    placeholder="DD-MM-YYYY"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nature of Offence *
                </label>
                <textarea
                  required
                  value={formData.offence.natureOfOffence}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      offence: {
                        ...formData.offence,
                        natureOfOffence: e.target.value,
                      },
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Describe the nature of the offence in detail..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Place of Offence
                </label>
                <textarea
                  value={formData.offence.placeOfOffence}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      offence: {
                        ...formData.offence,
                        placeOfOffence: e.target.value,
                      },
                    })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Services Required Section */}
              <div className="md:col-span-2 mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Required</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legal Service Type *
                </label>
                <select
                  required
                  value={formData.legalServiceType}
                  onChange={(e) =>
                    setFormData({ ...formData, legalServiceType: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="FORENSIC_INTERVIEW">Forensic Interview</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="PROSECUTION">Prosecution</option>
                  <option value="MEDIATION">Mediation</option>
                  <option value="LEGAL_COUNSELLING">Legal Counselling</option>
                  <option value="DIVERSION">Diversion</option>
                </select>
              </div>

              {formData.legalServiceType === 'PROSECUTION' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Charge Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.chargeNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, chargeNumber: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Charged
                </label>
                <input
                  type="text"
                  value={formData.dateCharged}
                  onChange={(e) =>
                    setFormData({ ...formData, dateCharged: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="DD-MM-YYYY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Filed in Court
                </label>
                <input
                  type="text"
                  value={formData.dateFiledInCourt}
                  onChange={(e) =>
                    setFormData({ ...formData, dateFiledInCourt: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="DD-MM-YYYY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Administrative Number
                </label>
                <input
                  type="text"
                  value={formData.administrativeNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, administrativeNumber: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Arraignment
                </label>
                <input
                  type="text"
                  value={formData.dateOfArraignment}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfArraignment: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="DD-MM-YYYY"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bail Conditions
                </label>
                <textarea
                  value={formData.bailConditions}
                  onChange={(e) =>
                    setFormData({ ...formData, bailConditions: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Enter bail conditions if applicable..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status of Case
                </label>
                <textarea
                  value={formData.statusOfCase}
                  onChange={(e) =>
                    setFormData({ ...formData, statusOfCase: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Enter current status of the case..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.suspectReleasedOnBail}
                    onChange={(e) =>
                      setFormData({ ...formData, suspectReleasedOnBail: e.target.checked })
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Suspect Released on Bail
                  </span>
                </label>
              </div>

              {formData.suspectReleasedOnBail && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bail Release Date *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.bailReleaseDate}
                      onChange={(e) =>
                        setFormData({ ...formData, bailReleaseDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="DD-MM-YYYY"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surety&apos;s NIN *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.suretysNIN}
                      onChange={(e) =>
                        setFormData({ ...formData, suretysNIN: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surety&apos;s Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.suretysPhoneNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, suretysPhoneNumber: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
          </Card>
        </FormStep>
        <FormStep>
          <Card>
            <CardHeader>
              <CardTitle>Medical & Autopsy Reports</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.victimDied}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        victimDied: e.target.checked,
                        ...(e.target.checked
                          ? {}
                          : {
                              autopsyReport: '',
                              autopsyReportUpload: null,
                            }),
                      })
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Victim died
                  </span>
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Report
                </label>
                <textarea
                  value={formData.medicalReport}
                  onChange={(e) =>
                    setFormData({ ...formData, medicalReport: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Enter medical report details..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Report Upload
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medicalReportUpload: e.target.files?.[0] || null,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
                {formData.medicalReportUpload && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {formData.medicalReportUpload.name}
                  </p>
                )}
              </div>
              {formData.victimDied && (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Autopsy Report
                    </label>
                    <textarea
                      value={formData.autopsyReport}
                      onChange={(e) =>
                        setFormData({ ...formData, autopsyReport: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="Enter autopsy report details..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Autopsy Report Upload
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          autopsyReportUpload: e.target.files?.[0] || null,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                    {formData.autopsyReportUpload && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: {formData.autopsyReportUpload.name}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardContent>
          </Card>
        </FormStep>
        <FormStep>
          <Card>
            <CardHeader>
              <CardTitle>Evidence Storage & Chain of Custody</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Evidence storage and chain of custody details are optional. You can skip this step if not applicable.
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidence Storage Location
                </label>
                <input
                  type="text"
                  value={formData.evidenceStorageLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, evidenceStorageLocation: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Optional - Enter evidence storage location..."
                />
              </div>
              <div className="md:col-span-2 border-t pt-6 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chain of Custody (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transferred From
                    </label>
                    <input
                      type="text"
                      value={formData.chainOfCustody.transferredFrom}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          chainOfCustody: {
                            ...formData.chainOfCustody,
                            transferredFrom: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transferred To
                    </label>
                    <input
                      type="text"
                      value={formData.chainOfCustody.transferredTo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          chainOfCustody: {
                            ...formData.chainOfCustody,
                            transferredTo: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transfer Date
                    </label>
                    <input
                      type="text"
                      value={formData.chainOfCustody.transferDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          chainOfCustody: {
                            ...formData.chainOfCustody,
                            transferDate: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="DD-MM-YYYY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Received By
                    </label>
                    <input
                      type="text"
                      value={formData.chainOfCustody.receivedBy}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          chainOfCustody: {
                            ...formData.chainOfCustody,
                            receivedBy: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose
                    </label>
                    <textarea
                      value={formData.chainOfCustody.purpose}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          chainOfCustody: {
                            ...formData.chainOfCustody,
                            purpose: e.target.value,
                          },
                        })
                      }
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="Optional"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition
                    </label>
                    <input
                      type="text"
                      value={formData.chainOfCustody.condition}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          chainOfCustody: {
                            ...formData.chainOfCustody,
                            condition: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.chainOfCustody.notes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          chainOfCustody: {
                            ...formData.chainOfCustody,
                            notes: e.target.value,
                          },
                        })
                      }
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          </Card>
        </FormStep>
        <FormStep>
          <Card>
            <CardHeader>
              <CardTitle>Details of Forensic Examiner</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Forensic examiner details are optional. You can skip this step if not applicable.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Examiner Name
                </label>
                <input
                  type="text"
                  value={formData.forensicExaminer.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      forensicExaminer: {
                        ...formData.forensicExaminer,
                        name: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Examiner ID
                </label>
                <input
                  type="text"
                  value={formData.forensicExaminer.id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      forensicExaminer: {
                        ...formData.forensicExaminer,
                        id: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Examiner Agency
                </label>
                <input
                  type="text"
                  value={formData.forensicExaminer.agency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      forensicExaminer: {
                        ...formData.forensicExaminer,
                        agency: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Examiner Contact
                </label>
                <input
                  type="text"
                  value={formData.forensicExaminer.contact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      forensicExaminer: {
                        ...formData.forensicExaminer,
                        contact: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Optional"
                />
              </div>
            </div>
          </CardContent>
          </Card>
        </FormStep>
      </MultiStepForm>
    </DashboardLayout>
  );
}

