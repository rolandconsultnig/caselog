import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { NewsStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as NewsStatus | null;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (featured) where.featured = true;

    const [articles, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
        select: {
          id: true,
          title: true,
          excerpt: true,
          category: true,
          status: true,
          featured: true,
          imageUrl: true,
          imageAlt: true,
          authorName: true,
          publishedAt: true,
          views: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.newsArticle.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to create news (Level 3+ or Admin)
    const allowedLevels = ['LEVEL_3', 'LEVEL_4', 'LEVEL_5', 'APP_ADMIN', 'SUPER_ADMIN'];
    if (!allowedLevels.includes(session.user.accessLevel)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      category,
      status,
      featured,
      imageUrl,
      imageAlt,
      tags,
      metadata,
      publishedAt,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const article = await prisma.newsArticle.create({
      data: {
        title,
        excerpt,
        content,
        category: category || 'General',
        status: status || NewsStatus.DRAFT,
        featured: featured || false,
        imageUrl,
        imageAlt,
        authorId: session.user.id,
        authorName: session.user.name || 'Unknown',
        tags: tags || [],
        metadata: metadata || {},
        publishedAt: status === NewsStatus.PUBLISHED ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.accessLevel,
        action: 'CREATE',
        entityType: 'NEWS_ARTICLE',
        entityId: article.id,
        entityName: `News article '${article.title}' created`,
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error('Error creating news article:', error);
    return NextResponse.json(
      { error: 'Failed to create news article' },
      { status: 500 }
    );
  }
}

