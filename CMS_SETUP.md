# Content Management System (CMS) Setup

## Overview

The CMS allows authorized users (Level 3+ and Admins) to manage news articles and updates displayed on the public landing page.

---

## Features

### 1. News Article Management
- **Create** new news articles
- **Edit** existing articles
- **Delete** articles
- **Publish/Draft/Archive** status management
- **Feature** articles for homepage display
- **Categorize** articles (Government, Services, Statistics, etc.)
- **Tag** articles for better organization
- **Track views** for published articles

### 2. Content Features
- Rich text content support
- Image URL support
- Excerpt/Summary field
- Author tracking
- Publication date tracking
- View counter

---

## Database Schema

### NewsArticle Model
```prisma
model NewsArticle {
  id          String      @id @default(cuid())
  title       String      @db.Text
  excerpt     String?     @db.Text
  content     String      @db.Text
  category    String      @default("General")
  status      NewsStatus  @default(DRAFT)
  featured    Boolean     @default(false)
  imageUrl    String?
  imageAlt    String?
  authorId    String
  authorName  String
  publishedAt DateTime?
  views       Int         @default(0)
  tags        String[]
  metadata    Json?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

### NewsStatus Enum
- `DRAFT` - Not published yet
- `PUBLISHED` - Live on website
- `ARCHIVED` - Archived/hidden

---

## API Endpoints

### GET `/api/cms/news`
Fetch news articles with filters:
- `status` - Filter by status (DRAFT, PUBLISHED, ARCHIVED)
- `category` - Filter by category
- `featured` - Get only featured articles
- `limit` - Number of articles to return
- `page` - Page number for pagination

**Example:**
```
GET /api/cms/news?status=PUBLISHED&limit=4
```

### POST `/api/cms/news`
Create a new news article (requires Level 3+ access)

**Body:**
```json
{
  "title": "Article Title",
  "excerpt": "Brief summary",
  "content": "Full article content",
  "category": "Government",
  "status": "PUBLISHED",
  "featured": true,
  "imageUrl": "https://example.com/image.jpg",
  "imageAlt": "Image description",
  "tags": ["SGBV", "Nigeria"]
}
```

### GET `/api/cms/news/[id]`
Get a specific article by ID (increments view count)

### PATCH `/api/cms/news/[id]`
Update an article (requires Level 3+ access)

### DELETE `/api/cms/news/[id]`
Delete an article (requires Level 4+ access)

---

## User Interface

### 1. News Management Page
**Path:** `/dashboard/cms/news`

**Features:**
- List all articles with filters
- Filter by status (All, Published, Drafts, Archived)
- View article statistics
- Quick actions: Edit, Delete, Feature/Unfeature
- Create new article button

### 2. Create Article Page
**Path:** `/dashboard/cms/news/new`

**Form Fields:**
- Title (required)
- Category (dropdown)
- Status (Draft/Published/Archived)
- Excerpt (optional)
- Content (required)
- Image URL (optional)
- Image Alt Text (optional)
- Tags (comma-separated)
- Featured checkbox

### 3. Edit Article Page
**Path:** `/dashboard/cms/news/[id]`

Same form as create, pre-filled with existing data.

---

## Permissions

### Create/Edit Articles
- **Level 3** (Approve/Reject cases)
- **Level 4** (Delete with approval)
- **Level 5** (Full approval authority)
- **APP_ADMIN**
- **SUPER_ADMIN**

### Delete Articles
- **Level 4+**
- **APP_ADMIN**
- **SUPER_ADMIN**

---

## Landing Page Integration

The public landing page (`/`) automatically fetches:
- **Featured article** - Displayed in hero section
- **Latest 3 published articles** - Displayed in news section

Articles are fetched from `/api/cms/news?status=PUBLISHED&limit=4` and sorted by:
1. Featured articles first
2. Publication date (newest first)

---

## Usage Guide

### Creating a News Article

1. Navigate to **Dashboard → CMS - News**
2. Click **"Create New Article"**
3. Fill in the form:
   - Enter a compelling title
   - Select appropriate category
   - Write excerpt (brief summary)
   - Write full content
   - Add image URL if available
   - Add tags for categorization
   - Check "Feature" if it should appear in hero section
   - Set status to "Published" to make it live
4. Click **"Create Article"**

### Editing an Article

1. Go to **CMS - News** page
2. Find the article you want to edit
3. Click **"Edit"** button
4. Make your changes
5. Click **"Save Changes"**

### Publishing an Article

1. Create or edit an article
2. Set status to **"Published"**
3. Save the article
4. The article will appear on the landing page immediately

### Featuring an Article

1. Edit an article
2. Check the **"Feature this article"** checkbox
3. Save changes
4. The article will appear in the hero section of the landing page

### Archiving an Article

1. Edit an article
2. Set status to **"Archived"**
3. Save changes
4. The article will be hidden from the public website but preserved in the database

---

## Best Practices

1. **Titles**: Keep titles concise and compelling (50-70 characters)
2. **Excerpts**: Write 1-2 sentence summaries (100-150 characters)
3. **Content**: Use clear, accessible language
4. **Images**: Use high-quality images with descriptive alt text
5. **Tags**: Use consistent tags for better organization
6. **Categories**: Use appropriate categories for better filtering
7. **Featured**: Only feature important, timely articles
8. **Status**: Use Draft status for articles in progress

---

## Future Enhancements

- Rich text editor (WYSIWYG)
- Image upload functionality
- Scheduled publishing
- Article preview
- SEO metadata
- Social media sharing
- Comments system
- Article templates
- Bulk operations
- Content versioning

---

## Troubleshooting

### Articles not appearing on landing page
- Check article status is "PUBLISHED"
- Verify article was created successfully
- Check browser console for API errors
- Ensure database connection is working

### Cannot create/edit articles
- Verify user has Level 3+ access level
- Check user session is active
- Review API error messages in console

### Images not displaying
- Verify image URL is accessible
- Check URL format is correct (http:// or https://)
- Ensure image host allows hotlinking

---

## Database Migration

The CMS schema has been added to the database. Run:

```bash
npx prisma db push
```

Or if you need to accept data loss:

```bash
npx prisma db push --accept-data-loss
```

Then regenerate Prisma Client:

```bash
npx prisma generate
```

