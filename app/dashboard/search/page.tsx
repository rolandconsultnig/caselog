'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Search, Filter, Save, Clock, X, Eye, FileText, User, Shield, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { NIGERIAN_STATES } from '@/lib/nigerian-locations';

interface SearchResult {
  cases: any[];
  victims: any[];
  suspects: any[];
  evidence: any[];
  documents: any[];
}

export default function AdvancedSearchPage() {
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    caseType: '',
    dateFrom: '',
    dateTo: '',
    state: '',
    lga: '',
  });
  const [results, setResults] = useState<SearchResult>({
    cases: [],
    victims: [],
    suspects: [],
    evidence: [],
    documents: [],
  });
  const [loading, setLoading] = useState(false);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    fetchSavedSearches();
    fetchSearchHistory();
  }, []);

  const fetchSavedSearches = async () => {
    try {
      const response = await fetch('/api/search/saved');
      if (response.ok) {
        const data = await response.json();
        setSavedSearches(data.savedSearches || []);
      }
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const response = await fetch('/api/search/history');
      if (response.ok) {
        const data = await response.json();
        setSearchHistory(data.history || []);
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  const performSearch = async () => {
    if (!query.trim() && searchType === 'all') {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        type: searchType,
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.caseType && { caseType: filters.caseType }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
        ...(filters.state && { state: filters.state }),
        ...(filters.lga && { lga: filters.lga }),
      });

      const response = await fetch(`/api/search?${params}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || {});
        fetchSearchHistory();
      } else {
        toast.error('Search failed');
      }
    } catch (error) {
      console.error('Error performing search:', error);
      toast.error('An error occurred during search');
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query to save');
      return;
    }

    const name = prompt('Enter a name for this saved search:');
    if (!name) return;

    try {
      const response = await fetch('/api/search/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          query,
          type: searchType,
          filters,
        }),
      });

      if (response.ok) {
        toast.success('Search saved successfully');
        fetchSavedSearches();
      } else {
        toast.error('Failed to save search');
      }
    } catch (error) {
      console.error('Error saving search:', error);
      toast.error('Failed to save search');
    }
  };

  const loadSavedSearch = (saved: any) => {
    setQuery(saved.searchQuery);
    setSearchType(saved.searchType);
    setFilters(saved.filters || {});
    performSearch();
  };

  const deleteSavedSearch = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved search?')) return;

    try {
      const response = await fetch(`/api/search/saved?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Saved search deleted');
        fetchSavedSearches();
      } else {
        toast.error('Failed to delete saved search');
      }
    } catch (error) {
      console.error('Error deleting saved search:', error);
      toast.error('Failed to delete saved search');
    }
  };

  const clearHistory = async () => {
    if (!confirm('Are you sure you want to clear all search history?')) return;

    try {
      const response = await fetch('/api/search/history', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Search history cleared');
        fetchSearchHistory();
      } else {
        toast.error('Failed to clear history');
      }
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('Failed to clear history');
    }
  };

  const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Advanced Search</h1>
            <p className="text-gray-600 mt-1">
              Search across cases, victims, suspects, evidence, and documents
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSaved(!showSaved)}>
              <Save className="w-4 h-4 mr-2" />
              Saved Searches ({savedSearches.length})
            </Button>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by case number, name, location, description..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      performSearch();
                    }
                  }}
                  className="pl-10"
                />
              </div>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="cases">Cases</SelectItem>
                  <SelectItem value="victims">Victims</SelectItem>
                  <SelectItem value="suspects">Suspects</SelectItem>
                  <SelectItem value="evidence">Evidence</SelectItem>
                  <SelectItem value="documents">Documents</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={performSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
              <Button variant="outline" onClick={saveSearch}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.priority} onValueChange={(v) => setFilters({ ...filters, priority: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Priorities</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.caseType} onValueChange={(v) => setFilters({ ...filters, caseType: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Case Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="RAPE">Rape</SelectItem>
                    <SelectItem value="ASSAULT">Assault</SelectItem>
                    <SelectItem value="DOMESTIC_VIOLENCE">Domestic Violence</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  placeholder="Date From"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
                <Input
                  type="date"
                  placeholder="Date To"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
                <Select value={filters.state} onValueChange={(v) => setFilters({ ...filters, state: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All States</SelectItem>
                    {NIGERIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setFilters({
                    status: '',
                    priority: '',
                    caseType: '',
                    dateFrom: '',
                    dateTo: '',
                    state: '',
                    lga: '',
                  })}>
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Saved Searches Sidebar */}
        {showSaved && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Saved Searches</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSaved(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            {savedSearches.length === 0 ? (
              <p className="text-sm text-gray-500">No saved searches</p>
            ) : (
              <div className="space-y-2">
                {savedSearches.map((saved) => (
                  <div key={saved.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <button onClick={() => loadSavedSearch(saved)} className="flex-1 text-left">
                      <p className="font-medium text-sm">{saved.name}</p>
                      <p className="text-xs text-gray-500">{saved.searchQuery}</p>
                    </button>
                    <Button variant="ghost" size="sm" onClick={() => deleteSavedSearch(saved.id)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </h3>
              <Button variant="ghost" size="sm" onClick={clearHistory}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.slice(0, 10).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setQuery(item.searchQuery);
                    setSearchType(item.searchType);
                    performSearch();
                  }}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                  {item.searchQuery}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Results */}
        {totalResults > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Search Results ({totalResults} found)
              </h2>
            </div>

            {/* Cases */}
            {results.cases.length > 0 && (
              <Card>
                <div className="p-4 border-b">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Cases ({results.cases.length})
                  </h3>
                </div>
                <div className="divide-y">
                  {results.cases.map((caseItem) => (
                    <Link key={caseItem.id} href={`/dashboard/cases/${caseItem.id}`}>
                      <div className="p-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{caseItem.caseNumber || caseItem.mojFileNumber}</p>
                            <p className="text-sm text-gray-500">{caseItem.incidentLocation}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="info">{caseItem.status}</Badge>
                            <Badge variant="default">{caseItem.priority}</Badge>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {/* Victims */}
            {results.victims.length > 0 && (
              <Card>
                <div className="p-4 border-b">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Victims ({results.victims.length})
                  </h3>
                </div>
                <div className="divide-y">
                  {results.victims.map((victim) => (
                    <Link key={victim.id} href={`/dashboard/cases/${victim.caseId}`}>
                      <div className="p-4 hover:bg-gray-50 cursor-pointer">
                        <p className="font-medium">
                          {victim.firstName} {victim.middleName} {victim.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{victim.email || victim.phoneNumber}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {/* Suspects */}
            {results.suspects.length > 0 && (
              <Card>
                <div className="p-4 border-b">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Suspects ({results.suspects.length})
                  </h3>
                </div>
                <div className="divide-y">
                  {results.suspects.map((suspect) => (
                    <Link key={suspect.id} href={`/dashboard/cases/${suspect.caseId}`}>
                      <div className="p-4 hover:bg-gray-50 cursor-pointer">
                        <p className="font-medium">
                          {suspect.firstName} {suspect.middleName} {suspect.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{suspect.email || suspect.phoneNumber}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {/* Evidence */}
            {results.evidence.length > 0 && (
              <Card>
                <div className="p-4 border-b">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FolderOpen className="w-5 h-5" />
                    Evidence ({results.evidence.length})
                  </h3>
                </div>
                <div className="divide-y">
                  {results.evidence.map((evidence) => (
                    <Link key={evidence.id} href={`/dashboard/cases/${evidence.caseId}`}>
                      <div className="p-4 hover:bg-gray-50 cursor-pointer">
                        <p className="font-medium">{evidence.evidenceNumber}</p>
                        <p className="text-sm text-gray-500">{evidence.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {/* Documents */}
            {results.documents.length > 0 && (
              <Card>
                <div className="p-4 border-b">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documents ({results.documents.length})
                  </h3>
                </div>
                <div className="divide-y">
                  {results.documents.map((doc) => (
                    <Link key={doc.id} href={`/dashboard/cases/${doc.caseId}/documents/${doc.id}`}>
                      <div className="p-4 hover:bg-gray-50 cursor-pointer">
                        <p className="font-medium">{doc.originalFileName}</p>
                        <p className="text-sm text-gray-500">{doc.description || doc.fileType}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && query && totalResults === 0 && (
          <Card className="p-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search query or filters</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

