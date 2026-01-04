'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { NewsStatus } from '@prisma/client';

export default function EditNewsArticlePage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;
  
  // Check if user has permission (Nadmin only)
  if (session?.user?.accessLevel && !['APP_ADMIN', 'SUPER_ADMIN'].includes(session.user.accessLevel)) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h2>
            <p className="text-red-600">Only Nigerian Admin can access the Content Management module.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'General',
    status: NewsStatus.DRAFT,
    featured: false,
    imageUrl: '',
    imageAlt: '',
    tags: '',
  });

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/cms/news/${articleId}`);
      if (response.ok) {
        const data = await response.json();
        const article = data.article;
        setFormData({
          title: article.title || '',
          excerpt: article.excerpt || '',
          content: article.content || '',
          category: article.category || 'General',
          status: article.status || NewsStatus.DRAFT,
          featured: article.featured || false,
          imageUrl: article.imageUrl || '',
          imageAlt: article.imageAlt || '',
          tags: article.tags ? article.tags.join(', ') : '',
        });
      } else {
        toast.error('Failed to fetch article');
        router.push('/dashboard/cms/news');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const response = await fetch(`/api/cms/news/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
        }),
      });

      if (response.ok) {
        toast.success('Article updated successfully!');
        router.push('/dashboard/cms/news');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update article');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Card className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit News Article</h1>
            <p className="text-gray-600 mt-1">
              Update article content and settings
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter article title"
                  required
                  disabled={saving}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Services">Services</SelectItem>
                    <SelectItem value="Statistics">Statistics</SelectItem>
                    <SelectItem value="Partnerships">Partnerships</SelectItem>
                    <SelectItem value="Announcements">Announcements</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NewsStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={NewsStatus.PUBLISHED}>Published</SelectItem>
                    <SelectItem value={NewsStatus.ARCHIVED}>Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Brief summary of the article (optional)"
                  rows={3}
                  disabled={saving}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Article content..."
                  rows={12}
                  required
                  disabled={saving}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  disabled={saving}
                />
              </div>

              <div>
                <Label htmlFor="imageAlt">Image Alt Text</Label>
                <Input
                  id="imageAlt"
                  name="imageAlt"
                  value={formData.imageAlt}
                  onChange={handleChange}
                  placeholder="Description of image"
                  disabled={saving}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., SGBV, Nigeria, Support"
                  disabled={saving}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  disabled={saving}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded"
                />
                <Label htmlFor="featured">Feature this article</Label>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

