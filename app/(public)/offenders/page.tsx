'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Search, User, Calendar, MapPin, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface Offender {
  id: string;
  name: string;
  age: number;
  gender: string;
  convictionDate: string;
  offence: string;
  sentence: string;
  state: string;
  status: string;
  caseNumber: string;
}

export default function OffendersLedgerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Offender[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    state: '',
    offence: '',
    status: '',
  });

  // Mock data - In production, this would come from an API
  const mockOffenders: Offender[] = [
    {
      id: '1',
      name: 'John Doe',
      age: 35,
      gender: 'MALE',
      convictionDate: '2023-05-15',
      offence: 'Rape',
      sentence: '15 years imprisonment',
      state: 'Lagos',
      status: 'CONVICTED',
      caseNumber: 'MOJ/2023/001',
    },
    {
      id: '2',
      name: 'Jane Smith',
      age: 28,
      gender: 'FEMALE',
      convictionDate: '2023-08-20',
      offence: 'Domestic Violence',
      sentence: '5 years imprisonment',
      state: 'Abuja',
      status: 'CONVICTED',
      caseNumber: 'MOJ/2023/045',
    },
    {
      id: '3',
      name: 'Michael Johnson',
      age: 42,
      gender: 'MALE',
      convictionDate: '2024-01-10',
      offence: 'Sexual Assault',
      sentence: '10 years imprisonment',
      state: 'Rivers',
      status: 'CONVICTED',
      caseNumber: 'MOJ/2024/012',
    },
  ];

  const handleSearch = () => {
    if (!searchQuery.trim() && !filters.state && !filters.offence) {
      toast.error('Please enter a search term or select filters');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let results = mockOffenders;
      
      // Apply search query
      if (searchQuery.trim()) {
        results = results.filter(offender =>
          offender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offender.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offender.offence.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply filters
      if (filters.state) {
        results = results.filter(offender => offender.state === filters.state);
      }
      
      if (filters.offence) {
        results = results.filter(offender => offender.offence === filters.offence);
      }
      
      if (filters.status) {
        results = results.filter(offender => offender.status === filters.status);
      }
      
      setSearchResults(results);
      setLoading(false);
      
      if (results.length === 0) {
        toast.info('No offenders found matching your search criteria');
      } else {
        toast.success(`Found ${results.length} offender(s)`);
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* Coat of Arms - Top Center */}
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
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SGBV Information System</h1>
                <p className="text-xs text-gray-600">Ministry of Justice</p>
              </div>
            </Link>
            <Link 
              href="/"
              className="text-gray-700 hover:text-green-600 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Offenders Ledger</h1>
          <p className="text-gray-600">
            Search for convicted offenders in the SGBV database. This information is public record.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, case number, or offence..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All States</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Rivers">Rivers</option>
                  <option value="Kano">Kano</option>
                  <option value="Kaduna">Kaduna</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offence Type
                </label>
                <select
                  value={filters.offence}
                  onChange={(e) => setFilters({ ...filters, offence: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Offences</option>
                  <option value="Rape">Rape</option>
                  <option value="Sexual Assault">Sexual Assault</option>
                  <option value="Domestic Violence">Domestic Violence</option>
                  <option value="Harassment">Harassment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Status</option>
                  <option value="CONVICTED">Convicted</option>
                  <option value="SERVING">Serving Sentence</option>
                  <option value="RELEASED">Released</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Search Results ({searchResults.length})
              </h2>
            </div>
            <div className="divide-y">
              {searchResults.map((offender) => (
                <div key={offender.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{offender.name}</h3>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                          {offender.status}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span><strong>Case:</strong> {offender.caseNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span><strong>Offence:</strong> {offender.offence}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span><strong>Convicted:</strong> {new Date(offender.convictionDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span><strong>State:</strong> {offender.state}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span><strong>Age:</strong> {offender.age} years | <strong>Gender:</strong> {offender.gender}</span>
                        </div>
                        <div>
                          <span><strong>Sentence:</strong> {offender.sentence}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && searchQuery && searchResults.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This ledger contains information about convicted offenders only. 
            All information is public record and is maintained for public safety and transparency purposes.
          </p>
        </div>
      </main>
    </div>
  );
}

