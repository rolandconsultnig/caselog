import { PrismaClient, TenantType, AccessLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createLevel5User() {
  try {
    console.log('🔐 Creating Level 5 Federal User...\n');

    // Find Federal Ministry of Justice tenant
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
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Level 5 user with nadmin email
    const userEmail = 'nadmin@moj.gov.ng';
    
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (existingUser) {
      console.log(`⚠️  User with email ${userEmail} already exists`);
      console.log('Updating to ensure correct access level...');
      
      await prisma.user.update({
        where: { email: userEmail },
        data: {
          password: hashedPassword,
          accessLevel: AccessLevel.LEVEL_5,
          tenantId: federalTenant.id,
          isActive: true,
        },
      });
      console.log('✅ User updated successfully\n');
    } else {
      const user = await prisma.user.create({
        data: {
          email: userEmail,
          password: hashedPassword,
          firstName: 'National',
          lastName: 'Admin',
          phoneNumber: '+234-800-000-5000',
          accessLevel: AccessLevel.LEVEL_5,
          tenantId: federalTenant.id,
          isActive: true,
        },
      });
      console.log('✅ Level 5 user created successfully\n');
    }

    console.log('📋 Login Credentials:');
    console.log('====================');
    console.log(`Email: ${userEmail}`);
    console.log(`Username: nadmin`);
    console.log(`Password: ${password}`);
    console.log(`Access Level: LEVEL_5`);
    console.log(`Tenant: ${federalTenant.name}`);
    console.log('====================\n');

    console.log('✅ Level 5 user ready!');
  } catch (error) {
    console.error('❌ Error creating Level 5 user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createLevel5User();
