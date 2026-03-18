'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import axios from 'axios';
import { NIGERIAN_STATES, getLGAsByState } from '@/lib/nigerian-locations';
import offencesData from '@/lib/offences-reference.json';

export default function SimpleNewCasePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userState, setUserState] = useState('');
  const [availableLGAs, setAvailableLGAs] = useState<string[]>([]);
  const [isFederalUser, setIsFederalUser] = useState(false);

  // Simplified form state - only essential fields
  const [formData, setFormData] = useState({
    // Step 1: Basic Case Info
    title: '',
    description: '',
    incidentDate: new Date().toISOString().split('T')[0],
    incidentState: '',
    incidentLga: '',
    priority: 'MEDIUM',
    
    // Step 2: Victim & Perpetrator
    victimName: '',
    victimAge: '',
    victimGender: 'FEMALE',
    perpetratorName: '',
    perpetratorAge: '',
    perpetratorGender: 'MALE',
    
    // Step 3: Offence Details
    selectedOffence: '',
    offenceDate: new Date().toISOString().split('T')[0],
    offenceLocation: '',
  });

  // Auto-populate user's state and LGAs on component mount
  useEffect(() => {
    if (session?.user) {
      // Get user's state from tenant name
      const tenantName = session.user.tenantName || '';
      const isFederal = tenantName.toLowerCase().includes('federal');
      setIsFederalUser(isFederal);
      
      // If not federal user, auto-populate with user's state
      if (!isFederal) {
        // Check if tenant name matches a state
        const matchedState = NIGERIAN_STATES.find(
          state => tenantName.toLowerCase().includes(state.name.toLowerCase().replace(' State', ''))
        );
        
        if (matchedState) {
          const stateName = matchedState.name;
          setUserState(stateName);
          setFormData(prev => ({ ...prev, incidentState: stateName }));
          
          // Load LGAs for this state
          const lgas = getLGAsByState(stateName);
          setAvailableLGAs(lgas);
        }
      }
    }
  }, [session]);

  // Update LGAs when state changes
  useEffect(() => {
    if (formData.incidentState) {
      const lgas = getLGAsByState(formData.incidentState);
      setAvailableLGAs(lgas);
      // Reset LGA selection when state changes
      if (formData.incidentState !== userState) {
        setFormData(prev => ({ ...prev, incidentLga: '' }));
      }
    }
  }, [formData.incidentState, userState]);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!formData.title.trim()) {
          toast.error('Case title is required');
          return false;
        }
        if (!formData.description.trim()) {
          toast.error('Case description is required');
          return false;
        }
        if (!formData.incidentState) {
          toast.error('Incident state is required');
          return false;
        }
        return true;
      
      case 1:
        if (!formData.victimName.trim()) {
          toast.error('Victim name is required');
          return false;
        }
        if (!formData.victimAge || parseInt(formData.victimAge) <= 0) {
          toast.error('Valid victim age is required');
          return false;
        }
        if (!formData.perpetratorName.trim()) {
          toast.error('Perpetrator name is required');
          return false;
        }
        return true;
      
      case 2:
        if (!formData.selectedOffence) {
          toast.error('Please select an offence');
          return false;
        }
        if (!formData.offenceLocation.trim()) {
          toast.error('Offence location is required');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      const selectedOffenceData = offencesData.find(o => o.offenceName === formData.selectedOffence);
      
      const payload = {
        title: formData.title,
        description: formData.description,
        incidentDate: new Date(formData.incidentDate).toISOString(),
        incidentState: formData.incidentState,
        incidentLga: formData.incidentLga || null,
        priority: formData.priority,
        caseType: selectedOffenceData?.offenceCategory || 'SGBV',
        victim: {
          name: formData.victimName,
          firstName: formData.victimName.split(' ')[0] || '',
          lastName: formData.victimName.split(' ').slice(1).join(' ') || '',
          age: parseInt(formData.victimAge),
          gender: formData.victimGender,
        },
        perpetrator: {
          name: formData.perpetratorName,
          firstName: formData.perpetratorName.split(' ')[0] || '',
          lastName: formData.perpetratorName.split(' ').slice(1).join(' ') || '',
          age: formData.perpetratorAge ? parseInt(formData.perpetratorAge) : null,
          gender: formData.perpetratorGender,
        },
        offence: {
          offenceName: formData.selectedOffence,
          natureOfOffence: formData.selectedOffence,
          dateOfOffence: new Date(formData.offenceDate).toISOString(),
          placeOfOffence: formData.offenceLocation,
          applicableLaw: selectedOffenceData?.law || null,
          penalty: selectedOffenceData?.penalty || null,
        },
      };

      const response = await axios.post('/api/cases', payload);
      
      if (response.data && response.data.id) {
        toast.success('Case created successfully!');
        router.push(`/dashboard/cases/${response.data.id}`);
      } else {
        toast.success('Case created successfully!');
        router.push('/dashboard/cases');
      }
    } catch (error: unknown) {
      console.error('Case creation error:', error);
      
      let errorMessage = 'Failed to create case';
      if (axios.isAxiosError(error)) {
        const apiMessage = (error.response?.data as { error?: string } | undefined)?.error;
        if (apiMessage) {
          errorMessage = apiMessage;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { title: 'Case Information', description: 'Basic case details' },
    { title: 'Victim & Perpetrator', description: 'Key parties involved' },
    { title: 'Offence Details', description: 'What happened' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Case</h1>
            <p className="text-gray-600 mt-1">Quick case creation - only essential information required</p>
          </div>
          <Link href="/dashboard/cases">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cases
            </Button>
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-3">
                  <p className={`font-medium ${index <= currentStep ? 'text-blue-600' : 'text-gray-600'}`}>
                    {step.title}
                  </p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <Card>
          <CardContent className="pt-6">
            {/* Step 1: Case Information */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Case Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief title for the case"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Case Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what happened..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Incident Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.incidentDate}
                      onChange={(e) => handleChange('incidentDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleChange('priority', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Incident State <span className="text-red-500">*</span>
                    </label>
                    {isFederalUser ? (
                      <select
                        value={formData.incidentState}
                        onChange={(e) => handleChange('incidentState', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select State</option>
                        {NIGERIAN_STATES.map((state) => (
                          <option key={state.code} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={formData.incidentState}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          title="Auto-populated from your state"
                        />
                        <p className="text-xs text-blue-600 mt-1">
                          Auto-populated from your state
                        </p>
                      </>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Incident LGA <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.incidentLga}
                      onChange={(e) => handleChange('incidentLga', e.target.value)}
                      disabled={!formData.incidentState || availableLGAs.length === 0}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    {formData.incidentState && availableLGAs.length > 0 && (
                      <p className="text-xs text-blue-600 mt-1">
                        Showing {availableLGAs.length} LGAs for {formData.incidentState}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Victim & Perpetrator */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Victim Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.victimName}
                        onChange={(e) => handleChange('victimName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Victim's full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.victimAge}
                        onChange={(e) => handleChange('victimAge', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Age"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.victimGender}
                      onChange={(e) => handleChange('victimGender', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="FEMALE">Female</option>
                      <option value="MALE">Male</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Perpetrator Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.perpetratorName}
                        onChange={(e) => handleChange('perpetratorName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Perpetrator's full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age (Optional)
                      </label>
                      <input
                        type="number"
                        value={formData.perpetratorAge}
                        onChange={(e) => handleChange('perpetratorAge', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Age"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.perpetratorGender}
                      onChange={(e) => handleChange('perpetratorGender', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Offence Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Offence <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.selectedOffence}
                    onChange={(e) => handleChange('selectedOffence', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Select an offence --</option>
                    {Object.entries(
                      offencesData.reduce((acc, offence) => {
                        if (!acc[offence.offenceCategory]) {
                          acc[offence.offenceCategory] = [];
                        }
                        acc[offence.offenceCategory].push(offence);
                        return acc;
                      }, {} as Record<string, typeof offencesData>)
                    ).map(([category, offences]) => (
                      <optgroup key={category} label={category}>
                        {offences.map((offence, idx) => (
                          <option key={idx} value={offence.offenceName}>
                            {offence.offenceName} ({offence.section})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {formData.selectedOffence && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    {(() => {
                      const selected = offencesData.find(o => o.offenceName === formData.selectedOffence);
                      return selected ? (
                        <div className="space-y-2 text-sm">
                          <p><strong>Law:</strong> {selected.law}</p>
                          <p><strong>Section:</strong> {selected.section}</p>
                          <p><strong>Penalty:</strong> {selected.penalty}</p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Offence <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.offenceDate}
                      onChange={(e) => handleChange('offenceDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location of Offence <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.offenceLocation}
                      onChange={(e) => handleChange('offenceLocation', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Where did it happen?"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Creating...' : 'Create Case'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
