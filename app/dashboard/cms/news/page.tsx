'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Calendar, User, Tag, TrendingUp, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { NewsStatus } from '@prisma/client';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  status: NewsStatus;
  featured: boolean;
  imageUrl: string | null;
  authorName: string;
  publishedAt: string | null;
  views: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function NewsManagementPage() {
  const { data: session } = useSession();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<NewsStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchArticles();
  }, [filter]);

  const fetchArticles = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'ALL') {
        params.append('status', filter);
      }
      params.append('limit', '50');

      const response = await fetch(`/api/cms/news?${params}`);
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
      } else {
        toast.error('Failed to fetch news articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const response = await fetch(`/api/cms/news/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Article deleted successfully');
        fetchArticles();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('An error occurred');
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/cms/news/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      if (response.ok) {
        toast.success(`Article ${!currentFeatured ? 'featured' : 'unfeatured'}`);
        fetchArticles();
      } else {
        toast.error('Failed to update article');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('An error occurred');
    }
  };

  const getStatusColor = (status: NewsStatus) => {
    switch (status) {
      case NewsStatus.PUBLISHED: return 'success';
      case NewsStatus.DRAFT: return 'warning';
      case NewsStatus.ARCHIVED: return 'default';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">News Management</h1>
            <p className="text-gray-600 mt-1">
              Manage news articles and updates for the public website
            </p>
          </div>
          <Link href="/dashboard/cms/news/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Article
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'ALL'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter(NewsStatus.PUBLISHED)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === NewsStatus.PUBLISHED
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setFilter(NewsStatus.DRAFT)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === NewsStatus.DRAFT
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Drafts
              </button>
              <button
                onClick={() => setFilter(NewsStatus.ARCHIVED)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === NewsStatus.ARCHIVED
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Archived
              </button>
            </div>
          </div>
        </Card>

        {/* Articles List */}
        {loading ? (
          <Card className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </Card>
        ) : articles.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'ALL' ? 'Create your first news article' : `No ${filter.toLowerCase()} articles found`}
            </p>
            <Link href="/dashboard/cms/news/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Article
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{article.title}</h3>
                        <Badge variant={getStatusColor(article.status)}>
                          {article.status}
                        </Badge>
                        {article.featured && (
                          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>

                      {article.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{article.authorName}</span>
                        </div>
                        {article.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{article.views} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          <span>{article.category}</span>
                        </div>
                        {article.tags.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span>Tags:</span>
                            <div className="flex gap-1">
                              {article.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                              {article.tags.length > 3 && (
                                <span className="text-xs">+{article.tags.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      <Link href={`/dashboard/cms/news/${article.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFeatured(article.id, article.featured)}
                      >
                        {article.featured ? 'Unfeature' : 'Feature'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(article.id, article.title)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-green-600">{articles.length}</p>
              <p className="text-sm text-gray-600 mt-1">Total Articles</p>
            </div>
          </Card>
          <Card>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-blue-600">
                {articles.filter(a => a.status === NewsStatus.PUBLISHED).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Published</p>
            </div>
          </Card>
          <Card>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-yellow-600">
                {articles.filter(a => a.status === NewsStatus.DRAFT).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Drafts</p>
            </div>
          </Card>
          <Card>
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-purple-600">
                {articles.filter(a => a.featured).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Featured</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

