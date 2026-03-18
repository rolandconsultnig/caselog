import { PrismaClient, TenantType, AccessLevel } from '@prisma/client';
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
  console.log('🌱 Starting database seed...');

  // Create Federal Ministry of Justice tenant
  console.log('Creating Federal Ministry of Justice tenant...');
  const federalTenant = await prisma.tenant.upsert({
    where: { code: 'FED' },
    update: {},
    create: {
      name: 'Federal Ministry of Justice',
      code: 'FED',
      type: TenantType.FEDERAL,
      isActive: true,
    },
  });

  // Create all Nigerian state tenants
  console.log('Creating state tenants...');
  const stateTenants = [];
  for (const state of NIGERIAN_STATES) {
    const tenant = await prisma.tenant.upsert({
      where: { code: state.code },
      update: {},
      create: {
        name: state.name,
        code: state.code,
        type: TenantType.STATE,
        isActive: true,
      },
    });
    stateTenants.push(tenant);
  }

  console.log(`✅ Created ${stateTenants.length} state tenants and 1 federal tenant`);

  // Create default password hash
  const defaultPassword = await bcrypt.hash('Password123!', 10);

  // Create Federal Super Admin
  console.log('Creating Federal Super Admin...');
  await prisma.user.upsert({
    where: {
      username: "federal.superadmin",
    },
    update: {},
    create: {
      username: 'federal.superadmin',
      email: 'federal.superadmin@moj.gov.ng',
      password: defaultPassword,
      firstName: 'Federal',
      lastName: 'SuperAdmin',
      phoneNumber: '+234-800-000-0001',
      accessLevel: AccessLevel.SUPER_ADMIN,
      tenantId: federalTenant.id,
      isActive: true,
    },
  });

  // Create Federal App Admin
  console.log('Creating Federal App Admin...');
  await prisma.user.upsert({
    where: { username: 'federal.appadmin' },
    update: {},
    create: {
      username: 'federal.appadmin',
      email: 'federal.appadmin@moj.gov.ng',
      password: defaultPassword,
      firstName: 'Federal',
      lastName: 'AppAdmin',
      phoneNumber: '+234-800-000-0002',
      accessLevel: AccessLevel.APP_ADMIN,
      tenantId: federalTenant.id,
      isActive: true,
    },
  });

  // Create Federal users for each level (1-5)
  console.log('Creating Federal level users...');
  const federalLevels = [
    AccessLevel.LEVEL_1,
    AccessLevel.LEVEL_2,
    AccessLevel.LEVEL_3,
    AccessLevel.LEVEL_4,
    AccessLevel.LEVEL_5,
  ];

  for (let i = 0; i < federalLevels.length; i++) {
    const level = federalLevels[i];
    await prisma.user.upsert({
      where: { username: `federal.level${i + 1}` },
      update: {},
      create: {
        username: `federal.level${i + 1}`,
        email: `federal.level${i + 1}@moj.gov.ng`,
        password: defaultPassword,
        firstName: 'Federal',
        lastName: `Level${i + 1}`,
        phoneNumber: `+234-800-000-00${i + 3}`,
        accessLevel: level,
        tenantId: federalTenant.id,
        isActive: true,
      },
    });
  }

  // Create sample users for Lagos State (as an example)
  console.log('Creating sample Lagos State users...');
  const lagosState = stateTenants.find((t) => t.code === 'LA');
  
  if (lagosState) {
    // Lagos Super Admin
    await prisma.user.upsert({
      where: { username: 'lagos.superadmin' },
      update: {},
      create: {
        username: 'lagos.superadmin',
        email: 'lagos.superadmin@justice.lg.gov.ng',
        password: defaultPassword,
        firstName: 'Lagos',
        lastName: 'SuperAdmin',
        phoneNumber: '+234-801-000-0001',
        accessLevel: AccessLevel.SUPER_ADMIN,
        tenantId: lagosState.id,
        isActive: true,
      },
    });

    // Lagos level users
    for (let i = 0; i < federalLevels.length; i++) {
      const level = federalLevels[i];
      await prisma.user.upsert({
        where: { username: `lagos.level${i + 1}` },
        update: {},
        create: {
          username: `lagos.level${i + 1}`,
          email: `lagos.level${i + 1}@justice.lg.gov.ng`,
          password: defaultPassword,
          firstName: 'Lagos',
          lastName: `Level${i + 1}`,
          phoneNumber: `+234-801-000-00${i + 2}`,
          accessLevel: level,
          tenantId: lagosState.id,
          isActive: true,
        },
      });
    }
  }

  // Create sample users for Abuja (FCT)
  console.log('Creating sample FCT users...');
  const fctState = stateTenants.find((t) => t.code === 'FC');
  
  if (fctState) {
    // FCT Super Admin
    await prisma.user.upsert({
      where: { username: 'fct.superadmin' },
      update: {},
      create: {
        username: 'fct.superadmin',
        email: 'fct.superadmin@justice.gov.ng',
        password: defaultPassword,
        firstName: 'FCT',
        lastName: 'SuperAdmin',
        phoneNumber: '+234-802-000-0001',
        accessLevel: AccessLevel.SUPER_ADMIN,
        tenantId: fctState.id,
        isActive: true,
      },
    });

    // FCT level users
    for (let i = 0; i < federalLevels.length; i++) {
      const level = federalLevels[i];
      await prisma.user.upsert({
        where: { username: `fct.level${i + 1}` },
        update: {},
        create: {
          username: `fct.level${i + 1}`,
          email: `fct.level${i + 1}@justice.gov.ng`,
          password: defaultPassword,
          firstName: 'FCT',
          lastName: `Level${i + 1}`,
          phoneNumber: `+234-802-000-00${i + 2}`,
          accessLevel: level,
          tenantId: fctState.id,
          isActive: true,
        },
      });
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Default Login Credentials:');
  console.log('================================');
  console.log('Password for all users: Password123!');
  console.log('\nFederal Ministry of Justice (use username to login):');
  console.log('  Super Admin: federal.superadmin');
  console.log('  App Admin: federal.appadmin');
  console.log('  Level 1-5: federal.level1 to federal.level5');
  console.log('\nLagos State (use username to login):');
  console.log('  Super Admin: lagos.superadmin');
  console.log('  Level 1-5: lagos.level1 to lagos.level5');
  console.log('\nFCT (use username to login):');
  console.log('  Super Admin: fct.superadmin');
  console.log('  Level 1-5: fct.level1 to fct.level5');
  console.log('================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

