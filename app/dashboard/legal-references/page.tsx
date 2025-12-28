'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search, BookOpen, Scale, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface LegalProvision {
  id: string;
  act: string;
  section: string;
  title: string;
  description: string;
  penalty: string;
  applicability: string;
  fullText: string;
}

export default function LegalReferencesPage() {
  const { data: session } = useSession();
  const [provisions, setProvisions] = useState<LegalProvision[]>([]);
  const [filteredProvisions, setFilteredProvisions] = useState<LegalProvision[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAct, setSelectedAct] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchProvisions();
  }, []);

  useEffect(() => {
    filterProvisions();
  }, [searchQuery, selectedAct, provisions]);

  const fetchProvisions = async () => {
    try {
      const response = await fetch('/api/legal-references');
      if (response.ok) {
        const data = await response.json();
        setProvisions(data.provisions || []);
        setFilteredProvisions(data.provisions || []);
      }
    } catch (error) {
      console.error('Error fetching legal references:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProvisions = () => {
    let filtered = provisions;

    if (selectedAct !== 'all') {
      filtered = filtered.filter(p => p.act.includes(selectedAct));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.section.toLowerCase().includes(query) ||
        p.act.toLowerCase().includes(query)
      );
    }

    setFilteredProvisions(filtered);
  };

  const acts = [
    { value: 'all', label: 'All Acts' },
    { value: 'Violence Against Persons', label: 'VAPPA 2015' },
    { value: 'Child Rights Act', label: 'Child Rights Act 2003' },
    { value: 'Trafficking', label: 'Trafficking in Persons Act' }
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Legal References</h1>
          <p className="text-gray-600 mt-1">
            Nigerian laws and provisions for SGBV cases
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Scale className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search legal provisions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedAct}
            onChange={(e) => setSelectedAct(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {acts.map(act => (
              <option key={act.value} value={act.value}>
                {act.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredProvisions.length} of {provisions.length} provisions
        </p>
      </div>

      {/* Legal Provisions List */}
      <div className="space-y-4">
        {filteredProvisions.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No provisions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </Card>
        ) : (
          filteredProvisions.map((provision) => (
            <Card key={provision.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="default" className="bg-green-600">
                        {provision.section}
                      </Badge>
                      <h3 className="text-xl font-bold text-gray-900">
                        {provision.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{provision.act}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(provision.id)}
                  >
                    {expandedId === provision.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                <p className="text-gray-700 mb-4">{provision.description}</p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Penalty:</p>
                    <p className="text-sm text-red-600 font-medium">{provision.penalty}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Applicability:</p>
                    <p className="text-sm text-gray-600">{provision.applicability}</p>
                  </div>
                </div>

                {expandedId === provision.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">Full Legal Text</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                        {provision.fullText}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Footer Note */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Important Note</h4>
            <p className="text-sm text-blue-800">
              These legal references are provided for informational purposes. Always consult with legal professionals 
              for case-specific advice. The applicability of certain laws may vary by state. VAPPA has been domesticated 
              in 19 states, while the Child Rights Act has been adopted in 26 states across Nigeria.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
