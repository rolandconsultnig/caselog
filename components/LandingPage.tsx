'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Shield, 
  Users, 
  Hospital,
  FileText,
  AlertCircle,
  Clock,
  Building2,
  Scale,
  Stethoscope,
  Home,
  UserCheck,
  ArrowRight,
  ExternalLink,
  Search,
  Calendar,
  TrendingUp,
  Award,
  Eye
} from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  status: string;
  featured: boolean;
  imageUrl: string | null;
  imageAlt: string | null;
  authorName: string;
  publishedAt: string | null;
  views: number;
  tags: string[];
  createdAt: string;
}

export default function LandingPage() {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsArticles();
  }, []);

  const fetchNewsArticles = async () => {
    try {
      // Fetch published articles
      const response = await fetch('/api/cms/news?status=PUBLISHED&limit=4');
      if (response.ok) {
        const data = await response.json();
        const articles = data.articles || [];
        
        // Find featured article
        const featured = articles.find((a: NewsArticle) => a.featured);
        setFeaturedArticle(featured || articles[0] || null);
        
        // Get other articles (excluding featured)
        const otherArticles = articles.filter((a: NewsArticle) => !a.featured).slice(0, 3);
        setNewsArticles(otherArticles);
      }
    } catch (error) {
      console.error('Error fetching news articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
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
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SGBV Information System</h1>
                <p className="text-xs text-gray-600">Ministry of Justice</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/offenders" className="text-gray-700 hover:text-green-600 transition-colors">
                Offenders Ledger
              </Link>
              <Link href="/report" className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors font-semibold">
                Report Incident
              </Link>
              <Link 
                href="/auth/select-state"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Staff Login
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4">
            <AlertCircle className="w-5 h-5 animate-pulse" />
            <p className="font-semibold">
              IN EMERGENCY? CALL: 
              <a href="tel:112" className="ml-2 underline hover:text-red-100">112 (Police)</a>
              <span className="mx-2">|</span>
              <a href="tel:08000333333" className="underline hover:text-red-100">0800-033-3333 (SGBV Helpline)</a>
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section - News Style */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Headline */}
            <div className="md:col-span-2">
              {loading ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 animate-pulse">
                  <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
                  <div className="h-12 bg-white/20 rounded mb-4"></div>
                  <div className="h-6 bg-white/20 rounded w-3/4"></div>
                </div>
              ) : featuredArticle ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                  {featuredArticle.featured && (
                    <span className="inline-block bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                      FEATURED
                    </span>
                  )}
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    {featuredArticle.title}
                  </h1>
                  {featuredArticle.excerpt && (
                    <p className="text-xl text-gray-200 mb-6">
                      {featuredArticle.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    {featuredArticle.publishedAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(featuredArticle.publishedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{featuredArticle.authorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{featuredArticle.views} views</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                  <span className="inline-block bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    BREAKING NEWS
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    New Digital Platform Launched to Combat SGBV Across Nigeria
                  </h1>
                  <p className="text-xl text-gray-200 mb-6">
                    The Ministry of justice introduces a comprehensive system for reporting, tracking, and managing SGBV cases nationwide.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>December 15, 2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>Ministry of Justice</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <Link
                href="/report"
                className="block bg-red-600 hover:bg-red-700 text-white p-6 rounded-lg shadow-lg transition-colors text-center"
              >
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold text-lg mb-1">Report an Incident</h3>
                <p className="text-sm text-red-100">File a confidential report</p>
              </Link>
              <Link
                href="/offenders"
                className="block bg-gray-700 hover:bg-gray-600 text-white p-6 rounded-lg shadow-lg transition-colors text-center"
              >
                <Search className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold text-lg mb-1">Offenders Ledger</h3>
                <p className="text-sm text-gray-300">Search convicted offenders</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* News Articles Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest News & Updates</h2>
              <p className="text-gray-600">Stay informed about SGBV initiatives and support services</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Trending</span>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : newsArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newsArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                >
                  {article.imageUrl ? (
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${article.imageUrl})` }}>
                      <div className="h-full bg-black/20"></div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <FileText className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                        {article.category}
                      </span>
                      {article.publishedAt && (
                        <span className="text-xs text-gray-500">
                          {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-green-600 text-sm font-semibold">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No news articles available at this time.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Stats - News Style */}
      <section className="py-12 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">37</div>
              <div className="text-gray-600 font-medium">States Covered</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">5K+</div>
              <div className="text-gray-600 font-medium">Cases Processed</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600 font-medium">Confidential</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - News Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Support Services</h2>
            <p className="text-xl text-gray-600">Comprehensive assistance for survivors</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Scale className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Legal Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Free legal counseling, court representation, and rights education.
              </p>
              <Link href="/report" className="text-blue-600 font-semibold text-sm flex items-center">
                Get Help <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Medical Assistance</h3>
              <p className="text-gray-600 text-sm mb-4">
                Emergency medical care, examinations, and treatment available 24/7.
              </p>
              <Link href="/report" className="text-red-600 font-semibold text-sm flex items-center">
                Get Help <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Counseling</h3>
              <p className="text-gray-600 text-sm mb-4">
                Trauma counseling and psychological support from trained professionals.
              </p>
              <Link href="/report" className="text-purple-600 font-semibold text-sm flex items-center">
                Get Help <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Minister's Message Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-l-4 border-green-600">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Message from the Honourable Minister
                  </h2>
                  <p className="text-lg text-gray-600">
                    Ministry of justice
                  </p>
                </div>
                <div className="hidden md:block">
                  <Scale className="w-16 h-16 text-green-600 opacity-20" />
                </div>
              </div>
            </div>
            
            {/* Minister's Photo */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex-shrink-0">
                <img 
                  src="/fagbemi.jpeg" 
                  alt="Honourable Minister of Justice" 
                  className="w-48 h-64 object-cover rounded-lg shadow-md"
                />
              </div>
              
              <div className="flex-1 prose prose-lg max-w-none text-gray-700 space-y-4">
                <p className="text-lg leading-relaxed">
                  Dear Fellow Nigerians,
                </p>
                
                <p className="text-lg leading-relaxed">
                  As the Honorable Minister of Justice and Attorney General of the Federation, I am pleased to welcome you to the Sexual and Gender-Based Violence Information System. This platform represents our unwavering commitment to protecting the rights and dignity of all Nigerians, particularly survivors of sexual and gender-based violence.
                </p>
                
                <p className="text-lg leading-relaxed">
                  The Ministry of justice recognizes that SGBV is a grave violation of human rights that affects individuals across all demographics in our nation. We are committed to ensuring that every survivor receives the support, justice, and protection they deserve. This system serves as a comprehensive platform for case management, evidence tracking, and coordination among all stakeholders in the fight against SGBV.
                </p>
                
                <p className="text-lg leading-relaxed">
                  Through this system, we aim to:
                </p>
                
                <ul className="list-disc list-inside space-y-2 text-lg ml-4">
                  <li>Ensure timely and effective response to SGBV cases</li>
                  <li>Facilitate seamless coordination between law enforcement, medical professionals, legal services, and support organizations</li>
                  <li>Maintain accurate records and evidence for prosecution</li>
                  <li>Provide survivors with access to comprehensive support services</li>
                  <li>Strengthen our national response to SGBV through data-driven insights</li>
                </ul>
                
                <p className="text-lg leading-relaxed">
                  I urge all stakeholders—law enforcement agencies, medical professionals, legal practitioners, social workers, and civil society organizations—to utilize this system effectively. Together, we can build a Nigeria where every citizen is safe, protected, and empowered.
                </p>
                
                <p className="text-lg leading-relaxed">
                  To survivors: know that you are not alone. The Federal Government stands with you, and this system is designed to ensure your voice is heard, your case is handled with the utmost care, and justice is served.
                </p>
                
                <p className="text-lg leading-relaxed font-semibold mt-8">
                  God bless the Federal Republic of Nigeria.
                </p>
                
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    Hon. Minister of Justice
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Attorney General of the Federation
                  </p>
                  <p className="text-gray-600">
                    Federal Republic of Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Immediate Help?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Report an incident or search the offenders ledger
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/report"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition-colors inline-flex items-center justify-center"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              Report Incident
            </Link>
            <Link
              href="/offenders"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-green-600 transition-colors inline-flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Offenders
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6" />
                <h3 className="font-bold text-lg">SGBV Information System</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Supporting SGBV survivors across Nigeria with free, confidential services.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/report" className="hover:text-white">Report Incident</Link></li>
                <li><Link href="/offenders" className="hover:text-white">Offenders Ledger</Link></li>
                <li><Link href="/auth/select-state" className="hover:text-white">Staff Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Emergency</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>112 (Police)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>0800-033-3333</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@sgbv.gov.ng</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Abuja, Nigeria</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 Ministry of justice. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
