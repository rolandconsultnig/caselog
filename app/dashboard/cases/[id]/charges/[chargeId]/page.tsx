'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { ArrowLeft, Calendar, Gavel, Scale, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CaseOffence {
  id: string;
  offenceName: string;
  offenceCode: string;
  applicableLaw: string;
  penalty: string;
  dateOfOffence?: string;
  placeOfOffence?: string;
  pleaType?: string;
  pleaDate?: string;
  pleaDetails?: string;
  verdictType?: string;
  verdictDate?: string;
  verdictDetails?: string;
  sentenceType?: string;
  sentenceDetails?: string;
  courtDate?: string;
  courtLocation?: string;
  judgeName?: string;
  prosecutorName?: string;
  defenseAttorneyName?: string;
  trialStatus: string;
  appealFiled: boolean;
  appealDate?: string;
  appealOutcome?: string;
  chargeNumber?: string;
}

export default function ChargeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [charge, setCharge] = useState<CaseOffence | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'plea' | 'trial' | 'verdict' | 'appeal'>('details');
  const [showPleaForm, setShowPleaForm] = useState(false);
  const [showTrialForm, setShowTrialForm] = useState(false);
  const [showVerdictForm, setShowVerdictForm] = useState(false);
  const [showAppealForm, setShowAppealForm] = useState(false);

  useEffect(() => {
    fetchCharge();
  }, [params.chargeId]);

  const fetchCharge = async () => {
    try {
      const response = await fetch(`/api/cases/${params.id}/charges`);
      if (response.ok) {
        const data = await response.json();
        const foundCharge = data.charges?.find((c: CaseOffence) => c.id === params.chargeId);
        if (foundCharge) {
          setCharge(foundCharge);
        } else {
          toast.error('Charge not found');
          router.push(`/dashboard/cases/${params.id}/charges`);
        }
      }
    } catch (error) {
      console.error('Error fetching charge:', error);
      toast.error('Failed to load charge');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (field: string, value: any) => {
    try {
      const response = await fetch(`/api/cases/${params.id}/charges/${params.chargeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Update failed');
      }

      toast.success('Charge updated successfully');
      fetchCharge();
    } catch (error: any) {
      console.error('Error updating charge:', error);
      toast.error(error.message || 'Failed to update charge');
    }
  };

  const getPleaColor = (plea?: string) => {
    if (!plea) return 'default';
    switch (plea) {
      case 'GUILTY': return 'error';
      case 'NOT_GUILTY': return 'success';
      case 'NO_CONTEST': return 'warning';
      default: return 'default';
    }
  };

  const getVerdictColor = (verdict?: string) => {
    if (!verdict) return 'default';
    switch (verdict) {
      case 'GUILTY': return 'error';
      case 'NOT_GUILTY': return 'success';
      case 'ACQUITTED': return 'success';
      case 'CONVICTED': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading charge...</p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  if (!charge) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">Charge not found</p>
            <Link href={`/dashboard/cases/${params.id}/charges`}>
              <Button className="mt-4">Back to Charges</Button>
            </Link>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/cases/${params.id}/charges`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{charge.offenceName}</h1>
              <p className="text-gray-600 mt-1">
                Charge Number: {charge.chargeNumber || charge.offenceCode}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={charge.trialStatus === 'VERDICT' ? 'success' : 'warning'}>
              {charge.trialStatus}
            </Badge>
            {charge.pleaType && (
              <Badge variant={getPleaColor(charge.pleaType)}>
                Plea: {charge.pleaType}
              </Badge>
            )}
            {charge.verdictType && (
              <Badge variant={getVerdictColor(charge.verdictType)}>
                {charge.verdictType}
              </Badge>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {(['details', 'plea', 'trial', 'verdict', 'appeal'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm capitalize
                  ${activeTab === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab === 'plea' && 'Plea Bargain'}
                {tab === 'trial' && 'Trial Schedule'}
                {tab === 'verdict' && 'Verdict & Sentence'}
                {tab === 'appeal' && 'Appeal'}
                {tab === 'details' && 'Charge Details'}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Charge Details Tab */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Offence Information</h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Offence Name:</span>
                      <p className="font-medium">{charge.offenceName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Offence Code:</span>
                      <p className="font-medium">{charge.offenceCode}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Applicable Law:</span>
                      <p className="font-medium">{charge.applicableLaw}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Penalty:</span>
                      <p className="font-medium">{charge.penalty}</p>
                    </div>
                    {charge.dateOfOffence && (
                      <div>
                        <span className="text-gray-500">Date of Offence:</span>
                        <p className="font-medium">
                          {new Date(charge.dateOfOffence).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {charge.placeOfOffence && (
                      <div>
                        <span className="text-gray-500">Place of Offence:</span>
                        <p className="font-medium">{charge.placeOfOffence}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Court Information</h2>
                  <div className="space-y-3 text-sm">
                    {charge.courtLocation && (
                      <div>
                        <span className="text-gray-500">Court Location:</span>
                        <p className="font-medium">{charge.courtLocation}</p>
                      </div>
                    )}
                    {charge.judgeName && (
                      <div>
                        <span className="text-gray-500">Judge:</span>
                        <p className="font-medium">{charge.judgeName}</p>
                      </div>
                    )}
                    {charge.prosecutorName && (
                      <div>
                        <span className="text-gray-500">Prosecutor:</span>
                        <p className="font-medium">{charge.prosecutorName}</p>
                      </div>
                    )}
                    {charge.defenseAttorneyName && (
                      <div>
                        <span className="text-gray-500">Defense Attorney:</span>
                        <p className="font-medium">{charge.defenseAttorneyName}</p>
                      </div>
                    )}
                    {charge.courtDate && (
                      <div>
                        <span className="text-gray-500">Court Date:</span>
                        <p className="font-medium">
                          {new Date(charge.courtDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Plea Bargain Tab */}
          {activeTab === 'plea' && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Plea Bargain</h2>
                  {!charge.pleaType && (
                    <Button onClick={() => setShowPleaForm(!showPleaForm)}>
                      {showPleaForm ? 'Cancel' : 'Record Plea'}
                    </Button>
                  )}
                </div>

                {showPleaForm ? (
                  <PleaForm
                    charge={charge}
                    onSave={(data) => {
                      handleUpdate('plea', data);
                      setShowPleaForm(false);
                    }}
                    onCancel={() => setShowPleaForm(false)}
                  />
                ) : charge.pleaType ? (
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Plea Type:</span>
                      <Badge variant={getPleaColor(charge.pleaType)} className="ml-2">
                        {charge.pleaType}
                      </Badge>
                    </div>
                    {charge.pleaDate && (
                      <div>
                        <span className="text-gray-500">Plea Date:</span>
                        <p className="font-medium">
                          {new Date(charge.pleaDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {charge.pleaDetails && (
                      <div>
                        <span className="text-gray-500">Plea Details:</span>
                        <p className="font-medium">{charge.pleaDetails}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No plea recorded yet</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Trial Schedule Tab */}
          {activeTab === 'trial' && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Trial Schedule</h2>
                  {charge.trialStatus !== 'VERDICT' && (
                    <Button onClick={() => setShowTrialForm(!showTrialForm)}>
                      {showTrialForm ? 'Cancel' : 'Schedule Trial'}
                    </Button>
                  )}
                </div>

                {showTrialForm ? (
                  <TrialScheduleForm
                    charge={charge}
                    onSave={(data) => {
                      handleUpdate('trial', data);
                      setShowTrialForm(false);
                    }}
                    onCancel={() => setShowTrialForm(false)}
                  />
                ) : (
                  <div className="space-y-3 text-sm">
                    {charge.courtDate ? (
                      <>
                        <div>
                          <span className="text-gray-500">Court Date:</span>
                          <p className="font-medium">
                            {new Date(charge.courtDate).toLocaleDateString()}
                          </p>
                        </div>
                        {charge.courtLocation && (
                          <div>
                            <span className="text-gray-500">Court Location:</span>
                            <p className="font-medium">{charge.courtLocation}</p>
                          </div>
                        )}
                        {charge.judgeName && (
                          <div>
                            <span className="text-gray-500">Presiding Judge:</span>
                            <p className="font-medium">{charge.judgeName}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>No trial scheduled yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Verdict & Sentence Tab */}
          {activeTab === 'verdict' && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Verdict & Sentence</h2>
                  {charge.trialStatus === 'TRIAL' && (
                    <Button onClick={() => setShowVerdictForm(!showVerdictForm)}>
                      {showVerdictForm ? 'Cancel' : 'Record Verdict'}
                    </Button>
                  )}
                </div>

                {showVerdictForm ? (
                  <VerdictForm
                    charge={charge}
                    onSave={(data) => {
                      handleUpdate('verdict', data);
                      setShowVerdictForm(false);
                    }}
                    onCancel={() => setShowVerdictForm(false)}
                  />
                ) : charge.verdictType ? (
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Verdict:</span>
                      <Badge variant={getVerdictColor(charge.verdictType)} className="ml-2">
                        {charge.verdictType}
                      </Badge>
                    </div>
                    {charge.verdictDate && (
                      <div>
                        <span className="text-gray-500">Verdict Date:</span>
                        <p className="font-medium">
                          {new Date(charge.verdictDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {charge.verdictDetails && (
                      <div>
                        <span className="text-gray-500">Verdict Details:</span>
                        <p className="font-medium">{charge.verdictDetails}</p>
                      </div>
                    )}
                    {charge.sentenceType && (
                      <div>
                        <span className="text-gray-500">Sentence Type:</span>
                        <p className="font-medium">{charge.sentenceType}</p>
                      </div>
                    )}
                    {charge.sentenceDetails && (
                      <div>
                        <span className="text-gray-500">Sentence Details:</span>
                        <p className="font-medium">{charge.sentenceDetails}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Gavel className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No verdict recorded yet</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Appeal Tab */}
          {activeTab === 'appeal' && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Appeal</h2>
                  {charge.verdictType && !charge.appealFiled && (
                    <Button onClick={() => setShowAppealForm(!showAppealForm)}>
                      {showAppealForm ? 'Cancel' : 'File Appeal'}
                    </Button>
                  )}
                </div>

                {showAppealForm ? (
                  <AppealForm
                    charge={charge}
                    onSave={(data) => {
                      handleUpdate('appeal', data);
                      setShowAppealForm(false);
                    }}
                    onCancel={() => setShowAppealForm(false)}
                  />
                ) : charge.appealFiled ? (
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Appeal Status:</span>
                      <Badge variant="warning" className="ml-2">Filed</Badge>
                    </div>
                    {charge.appealDate && (
                      <div>
                        <span className="text-gray-500">Appeal Date:</span>
                        <p className="font-medium">
                          {new Date(charge.appealDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {charge.appealOutcome && (
                      <div>
                        <span className="text-gray-500">Appeal Outcome:</span>
                        <p className="font-medium">{charge.appealOutcome}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Scale className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No appeal filed</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// Form Components
function PleaForm({ charge, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    pleaType: charge.pleaType || '',
    pleaDate: charge.pleaDate ? new Date(charge.pleaDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    pleaDetails: charge.pleaDetails || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Plea Type *
        </label>
        <select
          value={formData.pleaType}
          onChange={(e) => setFormData({ ...formData, pleaType: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select plea</option>
          <option value="GUILTY">Guilty</option>
          <option value="NOT_GUILTY">Not Guilty</option>
          <option value="NO_CONTEST">No Contest</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Plea Date *
        </label>
        <input
          type="date"
          value={formData.pleaDate}
          onChange={(e) => setFormData({ ...formData, pleaDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Plea Details
        </label>
        <textarea
          value={formData.pleaDetails}
          onChange={(e) => setFormData({ ...formData, pleaDetails: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save Plea</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function TrialScheduleForm({ charge, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    courtDate: charge.courtDate ? new Date(charge.courtDate).toISOString().split('T')[0] : '',
    courtLocation: charge.courtLocation || '',
    judgeName: charge.judgeName || '',
    prosecutorName: charge.prosecutorName || '',
    defenseAttorneyName: charge.defenseAttorneyName || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Court Date *
        </label>
        <input
          type="date"
          value={formData.courtDate}
          onChange={(e) => setFormData({ ...formData, courtDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Court Location *
        </label>
        <input
          type="text"
          value={formData.courtLocation}
          onChange={(e) => setFormData({ ...formData, courtLocation: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Presiding Judge
        </label>
        <input
          type="text"
          value={formData.judgeName}
          onChange={(e) => setFormData({ ...formData, judgeName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prosecutor Name
        </label>
        <input
          type="text"
          value={formData.prosecutorName}
          onChange={(e) => setFormData({ ...formData, prosecutorName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Defense Attorney Name
        </label>
        <input
          type="text"
          value={formData.defenseAttorneyName}
          onChange={(e) => setFormData({ ...formData, defenseAttorneyName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Schedule Trial</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function VerdictForm({ charge, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    verdictType: charge.verdictType || '',
    verdictDate: charge.verdictDate ? new Date(charge.verdictDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    verdictDetails: charge.verdictDetails || '',
    sentenceType: charge.sentenceType || '',
    sentenceDetails: charge.sentenceDetails || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verdict Type *
        </label>
        <select
          value={formData.verdictType}
          onChange={(e) => setFormData({ ...formData, verdictType: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select verdict</option>
          <option value="GUILTY">Guilty</option>
          <option value="NOT_GUILTY">Not Guilty</option>
          <option value="CONVICTED">Convicted</option>
          <option value="ACQUITTED">Acquitted</option>
          <option value="DISMISSED">Dismissed</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verdict Date *
        </label>
        <input
          type="date"
          value={formData.verdictDate}
          onChange={(e) => setFormData({ ...formData, verdictDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verdict Details
        </label>
        <textarea
          value={formData.verdictDetails}
          onChange={(e) => setFormData({ ...formData, verdictDetails: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      {(formData.verdictType === 'GUILTY' || formData.verdictType === 'CONVICTED') && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sentence Type
            </label>
            <select
              value={formData.sentenceType}
              onChange={(e) => setFormData({ ...formData, sentenceType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select sentence type</option>
              <option value="IMPRISONMENT">Imprisonment</option>
              <option value="FINE">Fine</option>
              <option value="COMMUNITY_SERVICE">Community Service</option>
              <option value="PROBATION">Probation</option>
              <option value="DEATH_PENALTY">Death Penalty</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sentence Details
            </label>
            <textarea
              value={formData.sentenceDetails}
              onChange={(e) => setFormData({ ...formData, sentenceDetails: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </>
      )}
      <div className="flex gap-2">
        <Button type="submit">Record Verdict</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function AppealForm({ charge, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    appealFiled: true,
    appealDate: new Date().toISOString().split('T')[0],
    appealOutcome: charge.appealOutcome || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Appeal Date *
        </label>
        <input
          type="date"
          value={formData.appealDate}
          onChange={(e) => setFormData({ ...formData, appealDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Appeal Outcome
        </label>
        <select
          value={formData.appealOutcome}
          onChange={(e) => setFormData({ ...formData, appealOutcome: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Pending</option>
          <option value="UPHELD">Upheld</option>
          <option value="OVERTURNED">Overturned</option>
          <option value="MODIFIED">Modified</option>
          <option value="DISMISSED">Dismissed</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit">File Appeal</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

