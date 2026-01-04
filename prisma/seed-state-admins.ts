import { PrismaClient, AccessLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const NIGERIAN_STATES = [
  'Abia State',
  'Adamawa State',
  'Akwa Ibom State',
  'Anambra State',
  'Bauchi State',
  'Bayelsa State',
  'Benue State',
  'Borno State',
  'Cross River State',
  'Delta State',
  'Ebonyi State',
  'Edo State',
  'Ekiti State',
  'Enugu State',
  'Gombe State',
  'Imo State',
  'Jigawa State',
  'Kaduna State',
  'Kano State',
  'Katsina State',
  'Kebbi State',
  'Kogi State',
  'Kwara State',
  'Lagos State',
  'Nasarawa State',
  'Niger State',
  'Ogun State',
  'Ondo State',
  'Osun State',
  'Oyo State',
  'Plateau State',
  'Rivers State',
  'Sokoto State',
  'Taraba State',
  'Yobe State',
  'Zamfara State',
  'Federal Capital Territory',
];

async function main() {
  console.log('🚀 Starting to seed Level 4 admin users for all states...\n');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  let created = 0;
  let skipped = 0;

  for (const stateName of NIGERIAN_STATES) {
    try {
      // Find the tenant for this state
      const tenant = await prisma.tenant.findFirst({
        where: { name: stateName },
      });

      if (!tenant) {
        console.log(`⚠️  Tenant not found for: ${stateName}`);
        skipped++;
        continue;
      }

      // Generate username and email from state name
      // e.g., "Lagos State" -> "lagos.admin"
      const stateSlug = stateName
        .toLowerCase()
        .replace(' state', '')
        .replace('federal capital territory', 'fct')
        .replace(' ', '');
      const username = `${stateSlug}.admin`;
      const email = `${username}@sgbv.gov.ng`;

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username: username },
            { email: email },
          ],
        },
      });

      if (existingUser) {
        console.log(`⏭️  User already exists: ${username}`);
        skipped++;
        continue;
      }

      // Create the Level 4 admin user
      const user = await prisma.user.create({
        data: {
          username: username,
          firstName: stateName.replace(' State', '').replace('Federal Capital Territory', 'FCT'),
          lastName: 'Admin',
          email: email,
          password: hashedPassword,
          accessLevel: AccessLevel.LEVEL_4,
          tenantId: tenant.id,
          isActive: true,
        },
      });

      console.log(`✅ Created: ${email} for ${stateName}`);
      created++;
    } catch (error) {
      console.error(`❌ Error creating user for ${stateName}:`, error);
      skipped++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Created: ${created} users`);
  console.log(`   ⏭️  Skipped: ${skipped} users`);
  console.log('\n🎉 Seeding completed!\n');
  console.log('📝 Login credentials format:');
  console.log('   Email: {state}.admin@sgbv.gov.ng');
  console.log('   Password: admin123');
  console.log('\n📋 Examples:');
  console.log('   lagos.admin@sgbv.gov.ng / admin123');
  console.log('   adamawa.admin@sgbv.gov.ng / admin123');
  console.log('   abuja.admin@sgbv.gov.ng / admin123 (for FCT)');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
