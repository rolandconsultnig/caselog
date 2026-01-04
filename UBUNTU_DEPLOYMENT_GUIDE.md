# 🐧 Ubuntu Server 20+ Deployment Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Database Installation](#database-installation)
4. [Application Setup](#application-setup)
5. [SSL Certificate Setup](#ssl-certificate-setup)
6. [Process Management](#process-management)
7. [Monitoring and Logging](#monitoring-and-logging)
8. [Backup Strategy](#backup-strategy)
9. [Security Hardening](#security-hardening)
10. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

### **Server Requirements**
- **OS**: Ubuntu 20.04 LTS or higher
- **RAM**: Minimum 4GB, Recommended 8GB
- **Storage**: Minimum 50GB SSD, Recommended 100GB
- **CPU**: Minimum 2 cores, Recommended 4 cores
- **Network**: Stable internet connection
- **Domain**: Optional but recommended for SSL

### **Software Requirements**
- **SSH Access**: Root or sudo privileges
- **Domain Name**: (Optional) For SSL certificate
- **Email**: For SSL certificate notifications

---

## 🚀 Server Setup

### **Step 1: Update System**
```bash
# Connect to your server via SSH
ssh username@your-server-ip

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git unzip htop vim nano
```

### **Step 2: Create Application User**
```bash
# Create dedicated user for the application
sudo adduser caselogpro

# Add user to sudo group
sudo usermod -aG sudo caselogpro

# Switch to application user
sudo su - caselogpro
```

### **Step 3: Install Node.js**
```bash
# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x

# Install PM2 for process management
sudo npm install -g pm2
```

### **Step 4: Install Nginx**
```bash
# Install Nginx web server
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify Nginx is running
sudo systemctl status nginx
```

---

## 🗄️ Database Installation

### **Step 1: Install PostgreSQL**
```bash
# Install PostgreSQL and contrib
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify PostgreSQL is running
sudo systemctl status postgresql
```

### **Step 2: Configure PostgreSQL**
```bash
# Switch to postgres user
sudo -i -u postgres

# Create database user
createuser --interactive --pwprompt caselogpro_user
# Enter password when prompted (save it securely)

# Create database
createdb -O caselogpro_user caselogpro_db

# Exit postgres user
exit
```

### **Step 3: Secure PostgreSQL**
```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/postgresql.conf

# Find and modify these lines:
listen_addresses = 'localhost'
port = 5432

# Edit access control
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add this line at the end (local connections with password):
local   all             all                                     md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### **Step 4: Test Database Connection**
```bash
# Test connection
psql -h localhost -U caselogpro_user -d caselogpro_db -W

# If successful, exit with \q
\q
```

---

## 📱 Application Setup

### **Step 1: Upload Application Files**
```bash
# Create application directory
mkdir -p /home/caselogpro/caselogpro2
cd /home/caselogpro/caselogpro2

# Upload your working-app.zip file (using SCP or SFTP)
# From your local machine:
scp working-app.zip caselogpro@your-server-ip:/home/caselogpro/caselogpro2/

# On the server, extract the application
unzip working-app.zip

# Set proper permissions
chmod -R 755 /home/caselogpro/caselogpro2
```

### **Step 2: Install Dependencies**
```bash
# Navigate to application directory
cd /home/caselogpro/caselogpro2

# Install Node.js dependencies
npm install

# Install Prisma CLI globally
sudo npm install -g prisma
```

### **Step 3: Configure Environment**
```bash
# Copy environment template
cp .env.example .env

# Edit environment file
nano .env
```

**Environment Configuration (.env):**
```env
# Database Configuration
DATABASE_URL="postgresql://caselogpro_user:YOUR_PASSWORD@localhost:5432/caselogpro_db"

# NextAuth Configuration
NEXTAUTH_URL="http://your-domain-or-ip:3550"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Email Configuration (Optional)
EMAIL_FROM="noreply@yourdomain.com"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Application Configuration
NODE_ENV="production"
PORT=3550
```

### **Step 4: Setup Database**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Import database data (if you have working-data.sql)
psql -h localhost -U caselogpro_user -d caselogpro_db < working-data.sql
```

### **Step 5: Build Application**
```bash
# Build the Next.js application
npm run build

# Test the build locally
npm start
# Press Ctrl+C to stop after verification
```

---

## 🔒 SSL Certificate Setup

### **Option 1: Using Domain Name (Recommended)**
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com

# Follow the prompts to configure SSL
# Choose option 2 (Redirect) to force HTTPS
```

### **Option 2: Self-Signed Certificate**
```bash
# Create SSL directory
sudo mkdir -p /etc/nginx/ssl

# Generate self-signed certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/nginx-selfsigned.key \
  -out /etc/nginx/ssl/nginx-selfsigned.crt \
  -subj "/C=NG/ST=Lagos/L=Lagos/O=CaselogPro/OU=IT/CN=your-server-ip"
```

---

## 🌐 Nginx Configuration

### **Step 1: Create Nginx Configuration**
```bash
# Create Nginx site configuration
sudo nano /etc/nginx/sites-available/caselogpro2
```

**Nginx Configuration File:**
```nginx
# For domain-based setup (with SSL)
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Application Proxy
    location / {
        proxy_pass http://localhost:3550;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # File Upload Size Limit
    client_max_body_size 50M;

    # Static Files (Optional, for better performance)
    location /_next/static {
        proxy_pass http://localhost:3550;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}

# For IP-based setup (without SSL)
server {
    listen 80;
    server_name your-server-ip;

    location / {
        proxy_pass http://localhost:3550;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 50M;
}
```

### **Step 2: Enable Site Configuration**
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/caselogpro2 /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## ⚙️ Process Management with PM2

### **Step 1: Create PM2 Configuration**
```bash
# Create PM2 ecosystem file
nano /home/caselogpro/caselogpro2/ecosystem.config.js
```

**PM2 Configuration File:**
```javascript
module.exports = {
  apps: [{
    name: 'caselogpro2',
    script: 'npm',
    args: 'start',
    cwd: '/home/caselogpro/caselogpro2',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3550
    },
    error_file: '/home/caselogpro/caselogpro2/logs/err.log',
    out_file: '/home/caselogpro/caselogpro2/logs/out.log',
    log_file: '/home/caselogpro/caselogpro2/logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

### **Step 2: Create Logs Directory**
```bash
# Create logs directory
mkdir -p /home/caselogpro/caselogpro2/logs

# Set permissions
chmod 755 /home/caselogpro/caselogpro2/logs
```

### **Step 3: Start Application with PM2**
```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions (copy and paste the command)

# Check application status
pm2 status

# View logs
pm2 logs caselogpro2

# Monitor application
pm2 monit
```

---

## 📊 Monitoring and Logging

### **Step 1: Setup Log Rotation**
```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/caselogpro2
```

**Logrotate Configuration:**
```
/home/caselogpro/caselogpro2/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 caselogpro caselogpro
    postrotate
        pm2 reloadLogs
    endscript
}
```

### **Step 2: Setup Basic Monitoring**
```bash
# Create monitoring script
nano /home/caselogpro/monitor.sh
```

**Monitoring Script:**
```bash
#!/bin/bash

# Check if the application is running
if ! pm2 list | grep -q "caselogpro2.*online"; then
    echo "$(date): CaselogPro2 is down, restarting..." >> /home/caselogpro/monitor.log
    pm2 restart caselogpro2
    echo "$(date): CaselogPro2 restarted" >> /home/caselogpro/monitor.log
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "$(date): Disk usage is ${DISK_USAGE}%" >> /home/caselogpro/monitor.log
fi

# Check memory usage
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.2f", $3*100/$2}')
echo "$(date): Memory usage is ${MEMORY_USAGE}%" >> /home/caselogpro/monitor.log
```

### **Step 3: Setup Cron Job for Monitoring**
```bash
# Make script executable
chmod +x /home/caselogpro/monitor.sh

# Edit crontab
crontab -e

# Add these lines for monitoring
*/5 * * * * /home/caselogpro/monitor.sh
0 2 * * * /home/caselogpro/backup.sh
```

---

## 💾 Backup Strategy

### **Step 1: Create Backup Script**
```bash
# Create backup script
nano /home/caselogpro/backup.sh
```

**Backup Script:**
```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/home/caselogpro/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="caselogpro_db"
DB_USER="caselogpro_user"
APP_DIR="/home/caselogpro/caselogpro2"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
echo "Backing up database..."
pg_dump -h localhost -U $DB_USER $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Backup application files
echo "Backing up application files..."
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C $APP_DIR .

# Backup configuration files
echo "Backing up configuration..."
cp $APP_DIR/.env $BACKUP_DIR/env_backup_$DATE
cp /etc/nginx/sites-available/caselogpro2 $BACKUP_DIR/nginx_backup_$DATE

# Remove old backups (keep last 7 days)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*_backup_*" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### **Step 2: Test Backup Script**
```bash
# Make script executable
chmod +x /home/caselogpro/backup.sh

# Run backup manually
./backup.sh

# Check backup files
ls -la /home/caselogpro/backups/
```

---

## 🔒 Security Hardening

### **Step 1: Firewall Setup**
```bash
# Install UFW (Uncomplicated Firewall)
sudo apt install -y ufw

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check firewall status
sudo ufw status
```

### **Step 2: SSH Security**
```bash
# Edit SSH configuration
sudo nano /etc/ssh/sshd_config

# Modify these settings:
Port 2222                    # Change from default 22
PermitRootLogin no
PasswordAuthentication no   # Use key-based auth
PubkeyAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2

# Restart SSH
sudo systemctl restart ssh

# Update firewall for new SSH port
sudo ufw allow 2222/tcp
```

### **Step 3: Fail2Ban Setup**
```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Create Fail2Ban configuration
sudo nano /etc/fail2ban/jail.local
```

**Fail2Ban Configuration:**
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = 2222
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
```

```bash
# Start and enable Fail2Ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Check Fail2Ban status
sudo fail2ban-client status
```

---

## 🔍 Troubleshooting

### **Common Issues and Solutions**

#### **Application Not Starting**
```bash
# Check PM2 status
pm2 status

# View application logs
pm2 logs caselogpro2

# Check environment variables
pm2 env caselogpro2

# Restart application
pm2 restart caselogpro2
```

#### **Database Connection Issues**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
psql -h localhost -U caselogpro_user -d caselogpro_db -W

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

#### **Nginx Issues**
```bash
# Check Nginx status
sudo systemctl status nginx

# Test Nginx configuration
sudo nginx -t

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Reload Nginx
sudo systemctl reload nginx
```

#### **SSL Certificate Issues**
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew --dry-run

# View Let's Encrypt logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

#### **Performance Issues**
```bash
# Check system resources
htop
df -h
free -h

# Check application memory usage
pm2 monit

# Check database performance
sudo -i -u postgres
psql -c "SELECT * FROM pg_stat_activity;"

# Optimize database
sudo -i -u postgres
psql -d caselogpro_db -c "VACUUM ANALYZE;"
```

### **Emergency Recovery**

#### **Restore from Backup**
```bash
# Stop application
pm2 stop caselogpro2

# Restore database
psql -h localhost -U caselogpro_user -d caselogpro_db < /home/caselogpro/backups/db_backup_YYYYMMDD_HHMMSS.sql

# Restore application files
tar -xzf /home/caselogpro/backups/app_backup_YYYYMMDD_HHMMSS.tar.gz -C /home/caselogpro/caselogpro2

# Restart application
pm2 start caselogpro2
```

#### **Reset Admin Password**
```bash
# Connect to database
psql -h localhost -U caselogpro_user -d caselogpro_db

# Update admin password
UPDATE "User" SET password = '$2b$12$hashedpasswordhere' WHERE username = 'nadmin.admin';

# Exit database
\q
```

---

## 📋 Post-Deployment Checklist

### **✅ Application Verification**
- [ ] Application loads correctly
- [ ] Login functionality works
- [ ] Database connectivity confirmed
- [ ] File uploads working
- [ ] Reports generating correctly

### **✅ Security Verification**
- [ ] SSL certificate installed and valid
- [ ] Firewall configured and active
- [ ] Fail2Ban running and blocking
- [ ] SSH secured with key authentication
- [ ] Database access restricted

### **✅ Performance Verification**
- [ ] Application responding quickly
- [ ] Memory usage within limits
- [ ] Disk space adequate
- [ ] Database queries optimized
- [ ] Caching working

### **✅ Monitoring Setup**
- [ ] PM2 monitoring active
- [ ] Log rotation configured
- [ ] Backup script working
- [ ] Monitoring script running
- [ ] Email notifications configured

### **✅ Documentation**
- [ ] Admin credentials documented
- [ ] Backup procedures documented
- [ ] Emergency contacts documented
- [ ] Maintenance schedule documented
- [ ] Recovery procedures documented

---

## 🎯 Final Steps

### **1. Test Complete System**
```bash
# Test application
curl -I https://yourdomain.com

# Test database
psql -h localhost -U caselogpro_user -d caselogpro_db -c "SELECT COUNT(*) FROM \"User\";"

# Test monitoring
pm2 status
sudo ufw status
sudo fail2ban-client status
```

### **2. Document Everything**
- Save all passwords securely
- Document all configurations
- Create maintenance procedures
- Setup alerting for critical issues

### **3. Schedule Regular Maintenance**
- Weekly: Check logs and performance
- Monthly: Update packages and certificates
- Quarterly: Review security settings
- Annually: Full system audit

---

## 📞 Support and Maintenance

### **Regular Commands**
```bash
# Check application status
pm2 status

# View logs
pm2 logs caselogpro2

# Restart application
pm2 restart caselogpro2

# Check system resources
htop
df -h

# Check firewall
sudo ufw status

# Check Fail2Ban
sudo fail2ban-client status
```

### **Emergency Commands**
```bash
# Stop application
pm2 stop caselogpro2

# Start application
pm2 start caselogpro2

# Restart all services
pm2 restart all

# View system logs
sudo journalctl -f
```

---

**Deployment Status**: ✅ **Ubuntu Server deployment guide completed!**

**Last Updated**: January 4, 2026  
**Tested On**: Ubuntu 20.04 LTS, 22.04 LTS  
**Compatible**: Ubuntu 20.04+ and Debian-based systems

---

*This guide provides a complete, production-ready deployment of CaselogPro2 on Ubuntu Server with security, monitoring, and maintenance procedures included.*
