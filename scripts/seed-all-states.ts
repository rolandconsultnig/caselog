import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const NIGERIAN_STATES = [
  { name: 'Abia State', code: 'AB' },
  { name: 'Adamawa State', code: 'AD' },
  { name: 'Akwa Ibom State', code: 'AK' },
  { name: 'Anambra State', code: 'AN' },
  { name: 'Bauchi State', code: 'BA' },
  { name: 'Bayelsa State', code: 'BY' },
  { name: 'Benue State', code: 'BE' },
  { name: 'Borno State', code: 'BO' },
  { name: 'Cross River State', code: 'CR' },
  { name: 'Delta State', code: 'DE' },
  { name: 'Ebonyi State', code: 'EB' },
  { name: 'Edo State', code: 'ED' },
  { name: 'Ekiti State', code: 'EK' },
  { name: 'Enugu State', code: 'EN' },
  { name: 'Gombe State', code: 'GO' },
  { name: 'Imo State', code: 'IM' },
  { name: 'Jigawa State', code: 'JI' },
  { name: 'Kaduna State', code: 'KD' },
  { name: 'Kano State', code: 'KN' },
  { name: 'Katsina State', code: 'KT' },
  { name: 'Kebbi State', code: 'KE' },
  { name: 'Kogi State', code: 'KO' },
  { name: 'Kwara State', code: 'KW' },
  { name: 'Lagos State', code: 'LA' },
  { name: 'Nasarawa State', code: 'NA' },
  { name: 'Niger State', code: 'NI' },
  { name: 'Ogun State', code: 'OG' },
  { name: 'Ondo State', code: 'ON' },
  { name: 'Osun State', code: 'OS' },
  { name: 'Oyo State', code: 'OY' },
  { name: 'Plateau State', code: 'PL' },
  { name: 'Rivers State', code: 'RI' },
  { name: 'Sokoto State', code: 'SO' },
  { name: 'Taraba State', code: 'TA' },
  { name: 'Yobe State', code: 'YO' },
  { name: 'Zamfara State', code: 'ZA' },
  { name: 'Federal Capital Territory', code: 'FC' },
];

async function main() {
  console.log('🚀 Starting to seed all Nigerian states...\n');

  // 1. Update existing users to have usernames
  console.log('📝 Step 1: Updating existing users with usernames...');
  
  const existingUsers = await prisma.user.findMany({
    include: { tenant: true }
  });

  for (const user of existingUsers) {
    // Generate username from email or create one
    let username = user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`;
    
    // Special case for nadmin
    if (user.email === 'nadmin@moj.gov.ng') {
      username = 'nadmin';
    } else if (user.email?.includes('admin')) {
      username = user.email.split('@')[0].replace(/\./g, '_');
    }

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { username }
      });
      console.log(`  ✅ Updated user: ${user.email} → username: ${username}`);
    } catch (error) {
      console.log(`  ⚠️  Could not update user ${user.email}: ${error}`);
    }
  }

  // 2. Create Federal Ministry tenant if it doesn't exist
  console.log('\n📝 Step 2: Creating Federal Ministry tenant...');
  
  let federalTenant = await prisma.tenant.findUnique({
    where: { code: 'FED' }
  });

  if (!federalTenant) {
    federalTenant = await prisma.tenant.create({
      data: {
        name: 'Federal Ministry of Justice',
        code: 'FED',
        type: 'FEDERAL',
        isActive: true,
      }
    });
    console.log('  ✅ Created Federal Ministry of Justice tenant');
  } else {
    console.log('  ℹ️  Federal Ministry tenant already exists');
  }

  // 3. Create all state tenants
  console.log('\n📝 Step 3: Creating all 37 state tenants...');
  
  let createdCount = 0;
  let existingCount = 0;

  for (const state of NIGERIAN_STATES) {
    try {
      const existing = await prisma.tenant.findUnique({
        where: { code: state.code }
      });

      if (!existing) {
        await prisma.tenant.create({
          data: {
            name: state.name,
            code: state.code,
            type: 'STATE',
            isActive: true,
          }
        });
        createdCount++;
        console.log(`  ✅ Created: ${state.name} (${state.code})`);
      } else {
        existingCount++;
        console.log(`  ℹ️  Already exists: ${state.name}`);
      }
    } catch (error) {
      console.error(`  ❌ Error creating ${state.name}:`, error);
    }
  }

  // 4. Create sample admin users for some states
  console.log('\n📝 Step 4: Creating sample admin users for key states...');
  
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  
  const sampleStates = [
    { code: 'LA', username: 'lagos_admin', firstName: 'Lagos', lastName: 'Administrator' },
    { code: 'FC', username: 'fct_admin', firstName: 'FCT', lastName: 'Administrator' },
    { code: 'KN', username: 'kano_admin', firstName: 'Kano', lastName: 'Administrator' },
    { code: 'RI', username: 'rivers_admin', firstName: 'Rivers', lastName: 'Administrator' },
  ];

  for (const stateInfo of sampleStates) {
    const tenant = await prisma.tenant.findUnique({
      where: { code: stateInfo.code }
    });

    if (tenant) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { username: stateInfo.username }
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              username: stateInfo.username,
              email: `${stateInfo.username}@justice.gov.ng`,
              password: hashedPassword,
              firstName: stateInfo.firstName,
              lastName: stateInfo.lastName,
              accessLevel: 'LEVEL_3',
              tenantId: tenant.id,
              isActive: true,
            }
          });
          console.log(`  ✅ Created admin user: ${stateInfo.username} for ${tenant.name}`);
        } else {
          console.log(`  ℹ️  User ${stateInfo.username} already exists`);
        }
      } catch (error) {
        console.error(`  ❌ Error creating user for ${tenant.name}:`, error);
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Federal Ministry: ${federalTenant ? 'Ready' : 'Created'}`);
  console.log(`✅ States created: ${createdCount}`);
  console.log(`ℹ️  States already existed: ${existingCount}`);
  console.log(`📍 Total states in system: ${createdCount + existingCount}`);
  console.log(`👥 Sample admin users created for key states`);
  console.log('='.repeat(60));
  console.log('\n🎉 All Nigerian states are now enabled in the system!');
  console.log('\n📝 Login System Updated:');
  console.log('   - Users now login with USERNAME instead of email');
  console.log('   - Federal admin: nadmin / admin123');
  console.log('   - State admins: [state]_admin / Password123!');
  console.log('\n✅ Setup complete! Users can now select any state to login.\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding states:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
