'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Shield, MapPin, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

interface Tenant {
  id: string;
  name: string;
  type: string;
}

const logoMap: { [key: string]: string } = {
  'Federal Ministry of Justice': '/coat-of-arms.png',
  'Lagos State': '/coat-of-arms.png',
  'FCT': '/coat-of-arms.png',
  'Default': '/coat-of-arms.png',
};

export default function SelectStatePage() {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState('');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch tenants on component mount
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('/api/tenants');
        setTenants(response.data);
      } catch (error) {
        console.error('Error fetching tenants:', error);
        toast.error('Failed to load states');
      } finally {
        setLoadingTenants(false);
      }
    };

    fetchTenants();
  }, []);

  const handleStateSelection = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedState) {
      toast.error('Please select a state');
      return;
    }

    const selectedTenant = tenants.find(t => t.id === selectedState);
    
    // Store selected state in session storage
    sessionStorage.setItem('selectedTenantId', selectedState);
    sessionStorage.setItem('selectedTenantName', selectedTenant?.name || '');
    
    // Route to state-specific login page
    router.push(`/auth/signin/${selectedState}`);
  };

  const selectedTenant = tenants.find(t => t.id === selectedState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      {/* Coat of Arms - Top Center */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 py-2 z-50">
        <div className="flex justify-center">
          <img 
            src="/coat-of-arms.png" 
            alt="Nigerian Coat of Arms" 
            className="h-10 w-auto object-contain"
          />
        </div>
      </div>
      <div className="max-w-md w-full mx-4 mt-20">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-green-600 p-3 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Sexual and Gender-Based Violence Information System</h1>
            <p className="text-xs text-gray-500 mt-2">
              Ministry of justice
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">
              Select Your State
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Choose your state to continue to the login page
            </p>
          </div>

          <form onSubmit={handleStateSelection} className="space-y-6">
            <div>
              <label
                id="state-label"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <MapPin className="w-4 h-4 inline mr-1" />
                State / Federal Ministry
              </label>
              <div className="relative">
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                  aria-labelledby="state-label"
                  onClick={() => setIsOpen(!isOpen)}
                  disabled={loadingTenants}
                  className="w-full bg-white text-left px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-base flex items-center justify-between"
                >
                  {selectedTenant ? (
                    <div className="flex items-center">
                      <Image
                        src={logoMap[selectedTenant.name] || logoMap.Default}
                        alt={`${selectedTenant.name} logo`}
                        width={24}
                        height={24}
                        className="mr-3"
                      />
                      <span>{selectedTenant.name} {selectedTenant.type === 'FEDERAL' ? '(Federal)' : ''}</span>
                    </div>
                  ) : (
                    <span>{loadingTenants ? 'Loading states...' : 'Select your state'}</span>
                  )}
                  <svg className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isOpen && (
                  <ul
                    role="listbox"
                    aria-labelledby="state-label"
                    className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                  >
                    {tenants.map((tenant) => (
                      <li
                        key={tenant.id}
                        onClick={() => {
                          setSelectedState(tenant.id);
                          setIsOpen(false);
                        }}
                        className="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-green-50"
                      >
                        <div className="flex items-center">
                          <Image
                            src={logoMap[tenant.name] || logoMap.Default}
                            alt={`${tenant.name} logo`}
                            width={24}
                            height={24}
                            className="mr-3"
                          />
                          <span className="font-normal block truncate">
                            {tenant.name} {tenant.type === 'FEDERAL' ? '(Federal)' : ''}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingTenants || !selectedState}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <span>Continue to Login</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-sm text-green-600 hover:text-green-700"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          © 2024 Ministry of justice. All rights reserved.
        </p>
      </div>
    </div>
  );
}

