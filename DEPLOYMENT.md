# Deployment Guide - CaseLogPro2

This guide covers deploying CaseLogPro2 to production environments.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ database
- Domain name with SSL certificate
- Server with at least 2GB RAM

## Environment Setup

### 1. Production Environment Variables

Create a `.env.production` file:

```env
# Database
DATABASE_URL="postgresql://username:password@host:5432/caselogpro2?schema=public"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret-key"

# Application
NODE_ENV="production"
APP_NAME="CaseLogPro2 - SGBV Case Management"

# Optional: Biometric Integration
BIOMETRIC_API_URL="https://biometric-api.example.com"
BIOMETRIC_API_KEY="your-api-key"

# Optional: Email Service
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="noreply@example.com"
SMTP_PASSWORD="your-smtp-password"
```

### 2. Generate Secure Keys

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate database password
openssl rand -base64 24
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Configure Environment Variables**
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add all variables from `.env.production`

5. **Set up PostgreSQL**
- Use Vercel Postgres or external provider (Railway, Supabase, AWS RDS)
- Update `DATABASE_URL` in Vercel environment variables

### Option 2: Railway

1. **Create Railway Account**
- Visit https://railway.app

2. **Create New Project**
```bash
railway login
railway init
```

3. **Add PostgreSQL**
```bash
railway add postgresql
```

4. **Deploy**
```bash
railway up
```

5. **Set Environment Variables**
```bash
railway variables set NEXTAUTH_SECRET="your-secret"
railway variables set NEXTAUTH_URL="https://your-app.railway.app"
```

### Option 3: DigitalOcean App Platform

1. **Create Account**
- Visit https://cloud.digitalocean.com

2. **Create App**
- Connect GitHub repository
- Select branch for deployment

3. **Configure Build Settings**
```yaml
name: caselogpro2
services:
  - name: web
    build_command: npm run build
    run_command: npm start
    environment_slug: node-js
    envs:
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}
      - key: NEXTAUTH_SECRET
        value: your-secret-here
      - key: NEXTAUTH_URL
        value: ${APP_URL}
```

4. **Add Database**
- Create managed PostgreSQL database
- Link to app

### Option 4: AWS (EC2 + RDS)

1. **Launch EC2 Instance**
```bash
# Ubuntu 22.04 LTS
sudo apt update
sudo apt install -y nodejs npm postgresql-client nginx
```

2. **Clone Repository**
```bash
git clone <your-repo>
cd CaselogPro2
npm install
```

3. **Set up RDS PostgreSQL**
- Create RDS PostgreSQL instance
- Configure security groups
- Note connection string

4. **Configure Environment**
```bash
cp .env.example .env.production
nano .env.production
# Add production values
```

5. **Build Application**
```bash
npm run build
```

6. **Set up PM2**
```bash
npm install -g pm2
pm2 start npm --name "caselogpro2" -- start
pm2 startup
pm2 save
```

7. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. **Set up SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Database Setup

### 1. Run Migrations

```bash
npm run db:migrate
```

### 2. Seed Database

```bash
npm run db:seed
```

### 3. Backup Strategy

Set up automated backups:

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/caselogpro2"
pg_dump $DATABASE_URL > $BACKUP_DIR/backup_$DATE.sql
# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete
```

Add to crontab:
```bash
0 2 * * * /path/to/backup-script.sh
```

## Security Checklist

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Strong `NEXTAUTH_SECRET` generated
- [ ] Database credentials secured
- [ ] Environment variables not committed to Git
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection enabled
- [ ] CSRF protection enabled (NextAuth handles this)
- [ ] Security headers configured
- [ ] Regular security updates scheduled

## Performance Optimization

### 1. Enable Caching

Add to `next.config.js`:
```javascript
module.exports = {
  // ... existing config
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
}
```

### 2. Database Indexing

Ensure all foreign keys and frequently queried fields are indexed (already done in Prisma schema).

### 3. CDN Configuration

Use CDN for static assets:
- Vercel: Automatic
- AWS: CloudFront
- Other: Cloudflare

### 4. Monitoring

Set up monitoring:
- Application: Sentry, LogRocket
- Infrastructure: DataDog, New Relic
- Uptime: UptimeRobot, Pingdom

## Post-Deployment

### 1. Verify Deployment

```bash
# Check health endpoint
curl https://your-domain.com/api/health

# Test login
# Visit https://your-domain.com/auth/signin
```

### 2. Create Admin Users

```bash
# Connect to production database
psql $DATABASE_URL

# Create federal admin
INSERT INTO "User" (id, email, password, "firstName", "lastName", "accessLevel", "tenantId", "isActive")
VALUES (
  gen_random_uuid(),
  'admin@moj.gov.ng',
  '$2a$10$...',  -- bcrypt hash of password
  'Admin',
  'User',
  'APP_ADMIN',
  (SELECT id FROM "Tenant" WHERE code = 'FED'),
  true
);
```

### 3. Configure Monitoring

Set up alerts for:
- Server downtime
- High error rates
- Slow response times
- Database connection issues
- Disk space warnings

### 4. Documentation

Update internal documentation with:
- Production URLs
- Admin credentials (in secure vault)
- Backup procedures
- Incident response plan
- Contact information

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check system health
- Verify backups

**Weekly:**
- Review audit logs
- Check disk space
- Update dependencies (security patches)

**Monthly:**
- Full system backup
- Performance review
- Security audit
- User access review

### Updates

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run migrations
npm run db:migrate

# Rebuild
npm run build

# Restart (PM2)
pm2 restart caselogpro2

# Or restart (systemd)
sudo systemctl restart caselogpro2
```

## Rollback Procedure

If deployment fails:

```bash
# Revert to previous version
git checkout <previous-commit>
npm install
npm run build
pm2 restart caselogpro2

# Restore database if needed
psql $DATABASE_URL < backup_file.sql
```

## Support

For deployment issues:
- Check logs: `pm2 logs` or Vercel logs
- Review error messages
- Check database connectivity
- Verify environment variables
- Contact technical support

## Scaling

### Horizontal Scaling

For high traffic:

1. **Load Balancer**
   - Use AWS ALB, Nginx, or HAProxy
   - Distribute traffic across multiple instances

2. **Database Read Replicas**
   - Set up PostgreSQL read replicas
   - Route read queries to replicas

3. **Caching Layer**
   - Add Redis for session storage
   - Cache frequently accessed data

### Vertical Scaling

Increase server resources:
- CPU: 2+ cores
- RAM: 4GB+ for production
- Storage: SSD with 50GB+

## Disaster Recovery

### Backup Strategy

1. **Database**: Daily automated backups
2. **Files**: Weekly full backup
3. **Code**: Git repository (GitHub/GitLab)

### Recovery Steps

1. Provision new server
2. Restore database from backup
3. Deploy latest code
4. Verify functionality
5. Update DNS if needed

## Compliance

Ensure compliance with:
- Nigerian Data Protection Regulation (NDPR)
- GDPR (if applicable)
- Local state regulations
- Federal Ministry of Justice policies

---

**Last Updated**: November 2024

