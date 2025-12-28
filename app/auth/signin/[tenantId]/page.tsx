'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Shield, ArrowLeft, Building2 } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

const logoMap: { [key: string]: string } = {
  'Federal Ministry of Justice': '/coat-of-arms.png',
  'Lagos State': '/coat-of-arms.png',
  'FCT': '/coat-of-arms.png',
  'Default': '/coat-of-arms.png',
};

interface Tenant {
  id: string;
  name: string;
  type: string;
}

export default function StateLoginPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params.tenantId as string;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loadingTenant, setLoadingTenant] = useState(true);

  // Fetch tenant details
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await axios.get('/api/tenants');
        const tenants = response.data;
        const selectedTenant = tenants.find((t: Tenant) => t.id === tenantId);
        
        if (selectedTenant) {
          setTenant(selectedTenant);
          // Store in session storage
          sessionStorage.setItem('selectedTenantId', selectedTenant.id);
          sessionStorage.setItem('selectedTenantName', selectedTenant.name);
        } else {
          toast.error('Invalid state selected');
          router.push('/auth/select-state');
        }
      } catch (error) {
        console.error('Error fetching tenant:', error);
        toast.error('Failed to load state information');
      } finally {
        setLoadingTenant(false);
      }
    };

    if (tenantId) {
      fetchTenant();
    }
  }, [tenantId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success(`Login successful - ${tenant?.name}`);
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingTenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return null;
  }

  // Get state code for coat of arms (simplified - you'll need actual images)
  const getStateCode = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-').replace('state', '').trim();
  };

  const isFederal = tenant.type === 'FEDERAL';

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
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* State Header with Coat of Arms */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
            <div className="flex items-center justify-center mb-4">
              {/* Coat of Arms Placeholder */}
              <div className="bg-white rounded-full p-2 shadow-lg w-24 h-24 flex items-center justify-center">
                <Image
                  src={logoMap[tenant.name] || logoMap.Default}
                  alt={`${tenant.name} Logo`}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-xl font-bold text-center mb-2">{tenant.name}</h1>
            <p className="text-sm text-center text-green-100 mb-3">
              Ministry of justice
            </p>
            <h2 className="text-lg font-semibold text-center text-white">
              Sexual and Gender-Based<br />
              Violence Information System
            </h2>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                Staff Login
              </h2>
              <p className="text-sm text-gray-600 text-center mt-1">
                Enter your credentials to access the system
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                href="/auth/select-state"
                className="text-sm text-green-600 hover:text-green-700 inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Change State
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-600 font-semibold mb-2">
                Demo Credentials:
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                {isFederal ? (
                  <>
                    <p><strong>Email:</strong> federal.level3@moj.gov.ng</p>
                    <p><strong>Password:</strong> Password123!</p>
                  </>
                ) : tenant.name === 'Lagos State' ? (
                  <>
                    <p><strong>Email:</strong> lagos.level3@justice.lg.gov.ng</p>
                    <p><strong>Password:</strong> Password123!</p>
                  </>
                ) : tenant.name === 'FCT' ? (
                  <>
                    <p><strong>Email:</strong> fct.level3@justice.gov.ng</p>
                    <p><strong>Password:</strong> Password123!</p>
                  </>
                ) : (
                  <>
                    <p className="text-amber-600">
                      <strong>Note:</strong> Demo users only available for Lagos, FCT, and Federal.
                    </p>
                    <p className="text-xs mt-2">
                      Contact your system administrator for credentials.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          © 2024 {tenant.name}. All rights reserved.
        </p>
      </div>
    </div>
  );
}

