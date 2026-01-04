'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  MapPin, 
  ArrowLeft,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import axios from 'axios';

interface Statistics {
  totalCases: number;
  activeCases: number;
  closedCases: number;
  casesByStatus: { status: string; count: number }[];
  casesByPriority: { priority: string; count: number }[];
  casesByState?: { state: string; code: string; count: number }[];
  casesByMonth: { month: string; count: number }[];
}

interface StateInfo {
  name: string;
  code: string;
  type: string;
}

export default function PublicReportsPage() {
  const [view, setView] = useState<'national' | 'state'>('national');
  const [selectedState, setSelectedState] = useState<string>('');
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [states, setStates] = useState<StateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateInfo, setStateInfo] = useState<StateInfo | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, [selectedState]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const url = selectedState 
        ? `/api/public/stats?state=${selectedState}`
        : '/api/public/stats';
      
      const response = await axios.get(url);
      
      if (selectedState) {
        setStatistics(response.data.statistics);
        setStateInfo(response.data.state);
      } else {
        setStatistics(response.data.statistics);
        setStates(response.data.states || []);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      NEW: 'bg-blue-500',
      ACTIVE: 'bg-green-500',
      INVESTIGATION: 'bg-yellow-500',
      PENDING_COURT: 'bg-orange-500',
      CLOSED: 'bg-gray-500',
      ARCHIVED: 'bg-gray-400',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      LOW: 'bg-green-500',
      MEDIUM: 'bg-yellow-500',
      HIGH: 'bg-orange-500',
      URGENT: 'bg-red-500',
    };
    return colors[priority] || 'bg-gray-500';
  };

  const formatStatusName = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleDownloadPDF = () => {
    setIsExporting(true);
    window.print();
    setTimeout(() => setIsExporting(false), 1000);
  };

  const handleDownloadCSV = () => {
    if (!statistics) return;

    const title = view === 'national' ? 'National SGBV Statistics' : `${stateInfo?.name} SGBV Statistics`;
    const date = new Date().toLocaleDateString();
    
    let csvContent = `${title}\nGenerated: ${date}\n\n`;
    
    // Summary
    csvContent += `Summary\n`;
    csvContent += `Total Cases,${statistics.totalCases}\n`;
    csvContent += `Active Cases,${statistics.activeCases}\n`;
    csvContent += `Closed Cases,${statistics.closedCases}\n\n`;
    
    // Cases by Status
    csvContent += `Cases by Status\n`;
    csvContent += `Status,Count,Percentage\n`;
    statistics.casesByStatus.forEach(item => {
      const percentage = statistics.totalCases > 0 
        ? ((item.count / statistics.totalCases) * 100).toFixed(1)
        : 0;
      csvContent += `${formatStatusName(item.status)},${item.count},${percentage}%\n`;
    });
    csvContent += `\n`;
    
    // Cases by Priority
    csvContent += `Cases by Priority\n`;
    csvContent += `Priority,Count,Percentage\n`;
    statistics.casesByPriority.forEach(item => {
      const percentage = statistics.totalCases > 0
        ? ((item.count / statistics.totalCases) * 100).toFixed(1)
        : 0;
      csvContent += `${item.priority},${item.count},${percentage}%\n`;
    });
    csvContent += `\n`;
    
    // Cases by State (if national view)
    if (view === 'national' && statistics.casesByState) {
      csvContent += `Cases by State\n`;
      csvContent += `State,Cases\n`;
      statistics.casesByState.forEach(item => {
        csvContent += `${item.state},${item.count}\n`;
      });
      csvContent += `\n`;
    }
    
    // Monthly Trend
    csvContent += `Monthly Trend (Last 12 Months)\n`;
    csvContent += `Month,Cases\n`;
    statistics.casesByMonth.slice().reverse().forEach((item: any) => {
      const date = new Date(item.month + '-01');
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      csvContent += `${monthName},${item.count}\n`;
    });
    
    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sgbv-report-${view}-${date.replace(/\//g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:block {
            display: block !important;
          }
          
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
          
          header {
            position: static !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          /* Ensure charts and graphs print properly */
          .bg-blue-500, .bg-green-500, .bg-yellow-500, 
          .bg-orange-500, .bg-red-500, .bg-gray-500 {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
      
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="bg-white border-b border-gray-200 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
            <img 
              src="/coat-of-arms.png" 
              alt="Nigerian Coat of Arms" 
              className="h-12 w-auto object-contain"
            />
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SGBV Public Reports</h1>
                <p className="text-xs text-gray-600">Statistical Overview & Analytics</p>
              </div>
            </div>
            <Link 
              href="/"
              className="flex items-center text-gray-700 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </nav>
      </header>

      {/* View Toggle & Export Buttons */}
      <div className="bg-white border-b print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            {/* View Toggle and State Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setView('national');
                    setSelectedState('');
                  }}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    view === 'national'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  National Report
                </button>
                <button
                  onClick={() => setView('state')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    view === 'state'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  State Reports
                </button>
              </div>

              {view === 'state' && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a State</option>
                    {states.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Export Buttons */}
            {statistics && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600 font-medium">Export:</span>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Download CSV</span>
                </button>
                <div className="text-xs text-gray-500 ml-2">
                  Generated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading statistics...</p>
            </div>
          </div>
        ) : !statistics ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No data available</p>
          </div>
        ) : (
          <>
            {/* Header Info */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {view === 'national' ? 'National SGBV Statistics' : stateInfo ? `${stateInfo.name} SGBV Statistics` : 'Select a State'}
              </h2>
              <p className="text-gray-600">
                {view === 'national' 
                  ? 'Comprehensive overview of SGBV cases across Nigeria'
                  : stateInfo 
                    ? `Detailed statistics for ${stateInfo.name}`
                    : 'Choose a state to view detailed statistics'}
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold">Total Cases</h3>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-4xl font-bold text-gray-900">{statistics.totalCases.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">All reported cases</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold">Active Cases</h3>
                  <Clock className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-4xl font-bold text-gray-900">{statistics.activeCases.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">Under investigation or in court</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold">Closed Cases</h3>
                  <CheckCircle className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-4xl font-bold text-gray-900">{statistics.closedCases.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">Resolved or archived</p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Cases by Status */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <PieChart className="w-6 h-6 mr-2 text-green-600" />
                  Cases by Status
                </h3>
                <div className="space-y-4">
                  {statistics.casesByStatus.map((item) => {
                    const percentage = statistics.totalCases > 0 
                      ? ((item.count / statistics.totalCases) * 100).toFixed(1)
                      : 0;
                    return (
                      <div key={item.status}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {formatStatusName(item.status)}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {item.count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${getStatusColor(item.status)}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cases by Priority */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-2 text-green-600" />
                  Cases by Priority
                </h3>
                <div className="space-y-4">
                  {statistics.casesByPriority.map((item) => {
                    const percentage = statistics.totalCases > 0
                      ? ((item.count / statistics.totalCases) * 100).toFixed(1)
                      : 0;
                    return (
                      <div key={item.priority}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {item.priority}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {item.count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${getPriorityColor(item.priority)}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Cases by State (National View Only) */}
            {view === 'national' && statistics.casesByState && statistics.casesByState.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-green-600" />
                  Top 10 States by Case Volume
                </h3>
                <div className="space-y-3">
                  {statistics.casesByState.map((item, index) => {
                    const maxCount = Math.max(...statistics.casesByState!.map(s => s.count));
                    const percentage = maxCount > 0 ? ((item.count / maxCount) * 100).toFixed(1) : 0;
                    return (
                      <div key={item.code} className="flex items-center gap-4">
                        <div className="w-8 text-center">
                          <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{item.state}</span>
                            <span className="text-sm font-bold text-gray-900">{item.count} cases</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-green-600"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cases Trend (Last 12 Months) */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
                Cases Trend (Last 12 Months)
              </h3>
              <div className="space-y-3">
                {statistics.casesByMonth.slice().reverse().map((item: any) => {
                  const maxCount = Math.max(...statistics.casesByMonth.map((m: any) => m.count));
                  const percentage = maxCount > 0 ? ((item.count / maxCount) * 100).toFixed(1) : 0;
                  const date = new Date(item.month + '-01');
                  const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                  
                  return (
                    <div key={item.month}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{monthName}</span>
                        <span className="text-sm font-bold text-gray-900">{item.count} cases</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Image 
                  src="/coat-of-arms.png" 
                  alt="Nigerian Coat of Arms" 
                  width={24} 
                  height={24}
                  className="flex-shrink-0 mt-1 object-contain"
                />
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">Data Privacy Notice</h4>
                  <p className="text-sm text-blue-800">
                    All statistics presented are aggregated and anonymized to protect the privacy and confidentiality of survivors. 
                    No personally identifiable information is included in these public reports. The data is updated regularly to 
                    reflect the current state of SGBV case management across Nigeria.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Federal Ministry of Justice, Nigeria. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Image 
              src="/coat-of-arms.png" 
              alt="Nigerian Coat of Arms" 
              width={16} 
              height={16}
              className="object-contain"
            />
            <p className="text-sm text-gray-500">
              Sexual and Gender-Based Violence Information System
            </p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
