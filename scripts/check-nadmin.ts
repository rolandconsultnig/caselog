import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkNadminUser() {
  console.log('🔍 Checking nadmin user credentials...\n');

  try {
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username: 'nadmin' },
      include: { tenant: true }
    });

    if (!user) {
      console.log('❌ User "nadmin" not found in database');
      console.log('\n📝 Creating nadmin user...\n');
      
      // Find Federal Ministry tenant
      const federalTenant = await prisma.tenant.findFirst({
        where: { 
          OR: [
            { code: 'FED' },
            { name: { contains: 'Federal Ministry' } }
          ]
        }
      });

      if (!federalTenant) {
        console.log('❌ Federal Ministry tenant not found');
        return;
      }

      // Create nadmin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newUser = await prisma.user.create({
        data: {
          username: 'nadmin',
          email: 'nadmin@moj.gov.ng',
          password: hashedPassword,
          firstName: 'National',
          lastName: 'Administrator',
          accessLevel: 'LEVEL_5',
          tenantId: federalTenant.id,
          isActive: true,
        },
        include: { tenant: true }
      });

      console.log('✅ Created nadmin user successfully!');
      console.log(`   Username: ${newUser.username}`);
      console.log(`   Email: ${newUser.email}`);
      console.log(`   Tenant: ${newUser.tenant.name}`);
      console.log(`   Access Level: ${newUser.accessLevel}`);
      console.log(`   Password: admin123`);
      
    } else {
      console.log('✅ User "nadmin" found in database');
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Tenant: ${user.tenant.name} (${user.tenant.code})`);
      console.log(`   Access Level: ${user.accessLevel}`);
      console.log(`   Active: ${user.isActive}`);
      
      // Test password
      console.log('\n🔐 Testing password "admin123"...');
      const isPasswordValid = await bcrypt.compare('admin123', user.password);
      
      if (isPasswordValid) {
        console.log('✅ Password is correct!');
      } else {
        console.log('❌ Password is incorrect. Updating password...');
        
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        });
        
        console.log('✅ Password updated to "admin123"');
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📋 LOGIN CREDENTIALS');
    console.log('='.repeat(60));
    console.log('Username: nadmin');
    console.log('Password: admin123');
    console.log('Tenant: Federal Ministry of Justice');
    console.log('='.repeat(60));
    console.log('\n✅ You can now login at: http://localhost:3001/auth/select-state');
    console.log('   1. Select "Federal Ministry of Justice"');
    console.log('   2. Enter username: nadmin');
    console.log('   3. Enter password: admin123\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkNadminUser();
