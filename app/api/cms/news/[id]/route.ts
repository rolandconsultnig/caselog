import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { NewsStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.newsArticle.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Increment views
    await prisma.newsArticle.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error fetching news article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news article' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions (Nadmin only)
    const allowedLevels = ['APP_ADMIN', 'SUPER_ADMIN'];
    if (!allowedLevels.includes(session.user.accessLevel)) {
      return NextResponse.json({ error: 'Only Nigerian Admin can manage content' }, { status: 403 });
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

    const existingArticle = await prisma.newsArticle.findUnique({
      where: { id: params.id },
    });

    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (status !== undefined) updateData.status = status;
    if (featured !== undefined) updateData.featured = featured;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (imageAlt !== undefined) updateData.imageAlt = imageAlt;
    if (tags !== undefined) updateData.tags = tags;
    if (metadata !== undefined) updateData.metadata = metadata;

    // Handle publishedAt based on status
    if (status === NewsStatus.PUBLISHED && !existingArticle.publishedAt) {
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : new Date();
    }

    const article = await prisma.newsArticle.update({
      where: { id: params.id },
      data: updateData,
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.accessLevel,
        action: 'UPDATE',
        entityType: 'NEWS_ARTICLE',
        entityId: article.id,
        entityName: `News article '${article.title}' updated`,
      },
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error updating news article:', error);
    return NextResponse.json(
      { error: 'Failed to update news article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions (Nadmin only)
    const allowedLevels = ['APP_ADMIN', 'SUPER_ADMIN'];
    if (!allowedLevels.includes(session.user.accessLevel)) {
      return NextResponse.json({ error: 'Only Nigerian Admin can manage content' }, { status: 403 });
    }

    const article = await prisma.newsArticle.findUnique({
      where: { id: params.id },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    await prisma.newsArticle.delete({
      where: { id: params.id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.accessLevel,
        action: 'DELETE',
        entityType: 'NEWS_ARTICLE',
        entityId: params.id,
        entityName: `News article '${article.title}' deleted`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news article:', error);
    return NextResponse.json(
      { error: 'Failed to delete news article' },
      { status: 500 }
    );
  }
}

