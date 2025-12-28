'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2, Star, Upload, Calendar, Target } from 'lucide-react';
import { toast } from 'sonner';

interface NGOPartnership {
  id: string;
  ngoName: string;
  ngoType?: string;
  contactPerson: string;
  contactEmail?: string;
  contactPhone: string;
  officeAddress?: string;
  referralDate: string;
  referralReason: string;
  servicesRequested: string[];
  supportStartDate: string;
  supportEndDate?: string;
  supportFrequency?: string;
  progressReports: any[];
  milestonesAchieved: string[];
  challengesFaced?: string;
  finalReportSubmitted: boolean;
  finalReportDate?: string;
  finalReportPath?: string;
  overallOutcome?: string;
  recommendationsForFuture?: string;
  satisfactionRating?: string;
  notes?: string;
}

export default function NGOPartnershipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [partnership, setPartnership] = useState<NGOPartnership | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'milestones' | 'final-report' | 'satisfaction'>('overview');
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [showFinalReportForm, setShowFinalReportForm] = useState(false);
  const [showSatisfactionForm, setShowSatisfactionForm] = useState(false);

  useEffect(() => {
    fetchPartnership();
  }, [params.ngoId]);

  const fetchPartnership = async () => {
    try {
      const response = await fetch(`/api/cases/${params.id}/ngo`);
      if (response.ok) {
        const data = await response.json();
        const foundPartnership = data.ngoPartnerships?.find((p: NGOPartnership) => p.id === params.ngoId);
        if (foundPartnership) {
          setPartnership(foundPartnership);
        } else {
          toast.error('Partnership not found');
          router.push(`/dashboard/cases/${params.id}/ngo`);
        }
      }
    } catch (error) {
      console.error('Error fetching partnership:', error);
      toast.error('Failed to load partnership');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (field: string, value: any) => {
    try {
      const response = await fetch(`/api/cases/${params.id}/ngo/${params.ngoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Update failed');
      }

      toast.success('Partnership updated successfully');
      fetchPartnership();
    } catch (error: any) {
      console.error('Error updating partnership:', error);
      toast.error(error.message || 'Failed to update partnership');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading partnership...</p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  if (!partnership) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">Partnership not found</p>
            <Link href={`/dashboard/cases/${params.id}/ngo`}>
              <Button className="mt-4">Back to Partnerships</Button>
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
            <Link href={`/dashboard/cases/${params.id}/ngo`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{partnership.ngoName}</h1>
              <p className="text-gray-600 mt-1">NGO Partnership</p>
            </div>
          </div>
          <div className="flex gap-2">
            {partnership.finalReportSubmitted && (
              <Badge variant="success">Final Report Submitted</Badge>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {(['overview', 'progress', 'milestones', 'final-report', 'satisfaction'] as const).map((tab) => (
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
                {tab === 'final-report' ? 'Final Report' : tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">NGO Information</h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">NGO Name:</span>
                      <p className="font-medium">{partnership.ngoName}</p>
                    </div>
                    {partnership.ngoType && (
                      <div>
                        <span className="text-gray-500">NGO Type:</span>
                        <p className="font-medium">{partnership.ngoType}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Contact Person:</span>
                      <p className="font-medium">{partnership.contactPerson}</p>
                    </div>
                    {partnership.contactEmail && (
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium">{partnership.contactEmail}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-medium">{partnership.contactPhone}</p>
                    </div>
                    {partnership.officeAddress && (
                      <div>
                        <span className="text-gray-500">Address:</span>
                        <p className="font-medium">{partnership.officeAddress}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Partnership Details</h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Referral Date:</span>
                      <p className="font-medium">
                        {new Date(partnership.referralDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Referral Reason:</span>
                      <p className="font-medium">{partnership.referralReason}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Support Start Date:</span>
                      <p className="font-medium">
                        {new Date(partnership.supportStartDate).toLocaleDateString()}
                      </p>
                    </div>
                    {partnership.supportEndDate && (
                      <div>
                        <span className="text-gray-500">Support End Date:</span>
                        <p className="font-medium">
                          {new Date(partnership.supportEndDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {partnership.supportFrequency && (
                      <div>
                        <span className="text-gray-500">Support Frequency:</span>
                        <p className="font-medium">{partnership.supportFrequency}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Services Requested:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {partnership.servicesRequested?.map((service, index) => (
                          <Badge key={index} variant="info">{service}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Progress Reports Tab */}
          {activeTab === 'progress' && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Progress Reports</h2>
                  <Button onClick={() => setShowProgressForm(!showProgressForm)}>
                    {showProgressForm ? 'Cancel' : 'Add Progress Report'}
                  </Button>
                </div>

                {showProgressForm ? (
                  <ProgressReportForm
                    onSave={(data) => {
                      handleUpdate('progress', data);
                      setShowProgressForm(false);
                    }}
                    onCancel={() => setShowProgressForm(false)}
                  />
                ) : partnership.progressReports && partnership.progressReports.length > 0 ? (
                  <div className="space-y-4">
                    {partnership.progressReports.map((report: any, index: number) => (
                      <Card key={index} className="bg-gray-50">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <span className="font-semibold">
                                Progress Report #{index + 1}
                              </span>
                            </div>
                            {report.reportDate && (
                              <span className="text-sm text-gray-500">
                                {new Date(report.reportDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          {report.period && (
                            <p className="text-sm text-gray-600 mb-2">
                              Period: {report.period}
                            </p>
                          )}
                          {report.activitiesCompleted && (
                            <div className="mb-2">
                              <p className="text-sm font-medium text-gray-700">Activities Completed:</p>
                              <p className="text-sm text-gray-600">{report.activitiesCompleted}</p>
                            </div>
                          )}
                          {report.challenges && (
                            <div className="mb-2">
                              <p className="text-sm font-medium text-gray-700">Challenges:</p>
                              <p className="text-sm text-gray-600">{report.challenges}</p>
                            </div>
                          )}
                          {report.nextSteps && (
                            <div>
                              <p className="text-sm font-medium text-gray-700">Next Steps:</p>
                              <p className="text-sm text-gray-600">{report.nextSteps}</p>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No progress reports submitted yet</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Milestones</h2>
                  <Button onClick={() => setShowMilestoneForm(!showMilestoneForm)}>
                    {showMilestoneForm ? 'Cancel' : 'Add Milestone'}
                  </Button>
                </div>

                {showMilestoneForm ? (
                  <MilestoneForm
                    existingMilestones={partnership.milestonesAchieved || []}
                    onSave={(data) => {
                      handleUpdate('milestone', data);
                      setShowMilestoneForm(false);
                    }}
                    onCancel={() => setShowMilestoneForm(false)}
                  />
                ) : partnership.milestonesAchieved && partnership.milestonesAchieved.length > 0 ? (
                  <div className="space-y-3">
                    {partnership.milestonesAchieved.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="font-medium">{milestone}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No milestones achieved yet</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Final Report Tab */}
          {activeTab === 'final-report' && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Final Report</h2>
                  {!partnership.finalReportSubmitted && (
                    <Button onClick={() => setShowFinalReportForm(!showFinalReportForm)}>
                      {showFinalReportForm ? 'Cancel' : 'Submit Final Report'}
                    </Button>
                  )}
                </div>

                {showFinalReportForm ? (
                  <FinalReportForm
                    partnership={partnership}
                    onSave={(data) => {
                      handleUpdate('finalReport', data);
                      setShowFinalReportForm(false);
                    }}
                    onCancel={() => setShowFinalReportForm(false)}
                  />
                ) : partnership.finalReportSubmitted ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">Final Report Submitted</p>
                        {partnership.finalReportDate && (
                          <p className="text-sm text-green-700">
                            Submitted on {new Date(partnership.finalReportDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {partnership.finalReportPath && (
                      <div>
                        <a
                          href={partnership.finalReportPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                          <FileText className="w-5 h-5" />
                          <span>View Final Report</span>
                        </a>
                      </div>
                    )}
                    {partnership.overallOutcome && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Overall Outcome:</p>
                        <p className="text-gray-600">{partnership.overallOutcome}</p>
                      </div>
                    )}
                    {partnership.recommendationsForFuture && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Recommendations for Future:</p>
                        <p className="text-gray-600">{partnership.recommendationsForFuture}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Final report not submitted yet</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Satisfaction Tab */}
          {activeTab === 'satisfaction' && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Satisfaction Rating</h2>
                  {partnership.finalReportSubmitted && !partnership.satisfactionRating && (
                    <Button onClick={() => setShowSatisfactionForm(!showSatisfactionForm)}>
                      {showSatisfactionForm ? 'Cancel' : 'Rate Partnership'}
                    </Button>
                  )}
                </div>

                {showSatisfactionForm ? (
                  <SatisfactionForm
                    partnership={partnership}
                    onSave={(data) => {
                      handleUpdate('satisfaction', data);
                      setShowSatisfactionForm(false);
                    }}
                    onCancel={() => setShowSatisfactionForm(false)}
                  />
                ) : partnership.satisfactionRating ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                      <Star className="w-8 h-8 text-yellow-600 fill-yellow-600" />
                      <div>
                        <p className="text-sm text-gray-500">Satisfaction Rating</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {partnership.satisfactionRating}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No satisfaction rating recorded</p>
                    {!partnership.finalReportSubmitted && (
                      <p className="text-sm mt-2">Submit final report to rate partnership</p>
                    )}
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
function ProgressReportForm({ onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    reportDate: new Date().toISOString().split('T')[0],
    period: '',
    activitiesCompleted: '',
    challenges: '',
    nextSteps: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Date *
          </label>
          <input
            type="date"
            value={formData.reportDate}
            onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reporting Period *
          </label>
          <input
            type="text"
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., January 2024"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Activities Completed *
        </label>
        <textarea
          value={formData.activitiesCompleted}
          onChange={(e) => setFormData({ ...formData, activitiesCompleted: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Challenges Faced
        </label>
        <textarea
          value={formData.challenges}
          onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Next Steps
        </label>
        <textarea
          value={formData.nextSteps}
          onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Submit Progress Report</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function MilestoneForm({ existingMilestones, onSave, onCancel }: any) {
  const [milestone, setMilestone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (milestone.trim()) {
      onSave([...existingMilestones, milestone.trim()]);
      setMilestone('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Milestone Achievement *
        </label>
        <input
          type="text"
          value={milestone}
          onChange={(e) => setMilestone(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="e.g., Completed counseling sessions for 10 victims"
          required
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Add Milestone</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function FinalReportForm({ partnership, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    finalReportDate: new Date().toISOString().split('T')[0],
    overallOutcome: '',
    recommendationsForFuture: '',
    finalReportFile: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, finalReportFile: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If file is uploaded, upload it first
    let reportPath = '';
    if (formData.finalReportFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.finalReportFile);
      uploadFormData.append('relatedEntityType', 'ngo');
      uploadFormData.append('relatedEntityId', partnership.id);
      uploadFormData.append('description', 'Final Report');
      uploadFormData.append('category', 'FINAL_REPORT');

      try {
        const uploadResponse = await fetch(`/api/cases/${partnership.caseId}/documents`, {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          reportPath = uploadData.document?.fileUrl || '';
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Failed to upload report file');
        return;
      }
    }

    onSave({
      ...formData,
      finalReportPath: reportPath,
      finalReportSubmitted: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Date *
        </label>
        <input
          type="date"
          value={formData.finalReportDate}
          onChange={(e) => setFormData({ ...formData, finalReportDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Final Report (PDF)
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overall Outcome *
        </label>
        <textarea
          value={formData.overallOutcome}
          onChange={(e) => setFormData({ ...formData, overallOutcome: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recommendations for Future
        </label>
        <textarea
          value={formData.recommendationsForFuture}
          onChange={(e) => setFormData({ ...formData, recommendationsForFuture: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Submit Final Report</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function SatisfactionForm({ partnership, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    satisfactionRating: partnership.satisfactionRating || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Satisfaction Rating *
        </label>
        <select
          value={formData.satisfactionRating}
          onChange={(e) => setFormData({ ...formData, satisfactionRating: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select rating</option>
          <option value="EXCELLENT">Excellent ⭐⭐⭐⭐⭐</option>
          <option value="GOOD">Good ⭐⭐⭐⭐</option>
          <option value="SATISFACTORY">Satisfactory ⭐⭐⭐</option>
          <option value="POOR">Poor ⭐⭐</option>
          <option value="VERY_POOR">Very Poor ⭐</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Submit Rating</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

