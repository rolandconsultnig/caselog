const { PrismaClient, TenantType, AccessLevel } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createFederalAdmin() {
  try {
    console.log('🔐 Creating Federal Ministry Admin User...\n');

    // Find or create Federal Ministry of Justice tenant
    let federalTenant = await prisma.tenant.findUnique({
      where: { code: 'FED' },
    });

    if (!federalTenant) {
      console.log('Creating Federal Ministry of Justice tenant...');
      federalTenant = await prisma.tenant.create({
        data: {
          name: 'Federal Ministry of Justice',
          code: 'FED',
          type: TenantType.FEDERAL,
          isActive: true,
        },
      });
      console.log('✅ Federal tenant created\n');
    } else {
      console.log('✅ Federal tenant already exists\n');
    }

    // Create password hash
    const password = 'Admin123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Federal Super Admin
    const adminEmail = 'admin@moj.gov.ng';
    
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      console.log(`⚠️  User with email ${adminEmail} already exists`);
      console.log('Updating to ensure correct access level...');
      
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          password: hashedPassword,
          accessLevel: AccessLevel.SUPER_ADMIN,
          tenantId: federalTenant.id,
          isActive: true,
        },
      });
      console.log('✅ User updated successfully\n');
    } else {
      const user = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          firstName: 'Federal',
          lastName: 'Administrator',
          phoneNumber: '+234-800-000-0000',
          accessLevel: AccessLevel.SUPER_ADMIN,
          tenantId: federalTenant.id,
          isActive: true,
        },
      });
      console.log('✅ Federal admin user created successfully\n');
    }

    console.log('📋 Login Credentials:');
    console.log('====================');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${password}`);
    console.log(`Access Level: SUPER_ADMIN`);
    console.log(`Tenant: ${federalTenant.name}`);
    console.log('====================\n');

    console.log('✅ Federal admin user ready!');
  } catch (error) {
    console.error('❌ Error creating federal admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createFederalAdmin();

