import { PrismaClient, CaseType, CasePriority, CaseStatus, Gender, TrialStatus } from '@prisma/client';

const prisma = new PrismaClient();

const NIGERIAN_STATES = [
  'Lagos State', 'Kano State', 'Rivers State', 'Kaduna State', 'Oyo State',
  'Delta State', 'Edo State', 'Akwa Ibom State', 'Anambra State', 'Borno State',
  'Plateau State', 'Imo State', 'Katsina State', 'Ogun State', 'Enugu State',
  'Bauchi State', 'Sokoto State', 'Adamawa State', 'Cross River State', 'Kwara State'
];

const LGAS = [
  'Ikeja', 'Surulere', 'Yaba', 'Apapa', 'Eti-Osa', 'Alimosho', 'Ikorodu',
  'Gwagwalada', 'Kuje', 'Abaji', 'Municipal', 'Fagge', 'Nassarawa', 'Tarauni',
  'Obio-Akpor', 'Port Harcourt', 'Eleme', 'Ikwerre', 'Kaduna North', 'Kaduna South'
];

const CASE_TYPES = [
  { type: CaseType.SGBV, title: 'Rape', description: 'Sexual assault case' },
  { type: CaseType.SGBV, title: 'Sexual Assault', description: 'Unwanted sexual contact' },
  { type: CaseType.DOMESTIC_VIOLENCE, title: 'Domestic Violence', description: 'Violence within household' },
  { type: CaseType.TRAFFICKING, title: 'Human Trafficking', description: 'Trafficking for exploitation' },
  { type: CaseType.SGBV, title: 'Child Sexual Abuse', description: 'Sexual abuse of minor' },
  { type: CaseType.SGBV, title: 'Incest', description: 'Sexual relations with family member' },
  { type: CaseType.HARASSMENT, title: 'Sexual Harassment', description: 'Workplace sexual harassment' },
  { type: CaseType.SGBV, title: 'Forced Marriage', description: 'Marriage without consent' },
];

const VICTIM_NAMES = [
  'Amina Ibrahim', 'Blessing Okafor', 'Chioma Nwosu', 'Deborah Adeyemi', 'Esther Musa',
  'Fatima Bello', 'Grace Eze', 'Hauwa Yusuf', 'Ifunanya Obi', 'Joy Okoro',
  'Khadija Mohammed', 'Lara Williams', 'Mary Adebayo', 'Ngozi Okonkwo', 'Omotola Ajayi',
  'Peace Udoh', 'Queen Bassey', 'Rahma Suleiman', 'Sarah Oladipo', 'Titi Adeleke',
  'Uche Nnamdi', 'Victoria Ojo', 'Wuraola Balogun', 'Yetunde Afolabi', 'Zainab Hassan',
  'Adaeze Chukwu', 'Bunmi Ogunleye', 'Chinyere Okeke', 'Damilola Adewale', 'Ebere Ike'
];

const PERPETRATOR_NAMES = [
  'Ahmed Bala', 'Bayo Adeniyi', 'Chidi Okafor', 'Daniel Eze', 'Emeka Nwosu',
  'Femi Oladele', 'Gabriel Okoro', 'Hassan Musa', 'Ibrahim Yusuf', 'James Udoh',
  'Kunle Ajayi', 'Lekan Balogun', 'Musa Abdullahi', 'Nnamdi Obi', 'Ojo Williams',
  'Paul Bassey', 'Rasheed Mohammed', 'Samuel Adeyemi', 'Tunde Adeleke', 'Usman Bello',
  'Victor Okonkwo', 'Wale Afolabi', 'Xavier Ike', 'Yakubu Hassan', 'Zack Chukwu',
  'Akin Ogunleye', 'Biodun Okeke', 'Chukwuma Adewale', 'Danjuma Ibrahim', 'Ejike Nnamdi'
];

const OFFENCES = [
  { name: 'Rape', code: 'S357', law: 'Criminal Code Act Cap C38 LFN 2004', penalty: '14 years to Life imprisonment' },
  { name: 'Sexual Assault', code: 'S360', law: 'Criminal Code Act Cap C38 LFN 2004', penalty: '3-5 years imprisonment' },
  { name: 'Domestic Violence', code: 'S4', law: 'Violence Against Persons Prohibition Act 2015', penalty: '2-3 years imprisonment' },
  { name: 'Human Trafficking', code: 'S13', law: 'Trafficking in Persons Law Enforcement Act 2015', penalty: '5-10 years imprisonment' },
  { name: 'Defilement', code: 'S218', law: 'Criminal Code Act Cap C38 LFN 2004', penalty: 'Life imprisonment' },
  { name: 'Incest', code: 'S215', law: 'Criminal Code Act Cap C38 LFN 2004', penalty: '7 years imprisonment' },
  { name: 'Sexual Harassment', code: 'S1', law: 'Sexual Harassment in Tertiary Institutions Act 2021', penalty: '5 years imprisonment' },
  { name: 'Forced Marriage', code: 'S23', law: 'Child Rights Act 2003', penalty: '5 years imprisonment' },
];

async function createCases() {
  try {
    console.log('🔍 Finding Federal Ministry tenant and nadmin user...\n');

    const federalTenant = await prisma.tenant.findUnique({
      where: { code: 'FED' },
    });

    if (!federalTenant) {
      throw new Error('Federal Ministry tenant not found. Please run seed script first.');
    }

    const nadminUser = await prisma.user.findUnique({
      where: { email: 'nadmin@moj.gov.ng' },
    });

    if (!nadminUser) {
      throw new Error('nadmin user not found. Please create the user first.');
    }

    console.log('✅ Found Federal tenant and nadmin user\n');
    console.log('📝 Creating 30 cases...\n');

    const priorities = [CasePriority.LOW, CasePriority.MEDIUM, CasePriority.HIGH, CasePriority.URGENT, CasePriority.CRITICAL];
    const statuses = [CaseStatus.NEW, CaseStatus.ACTIVE, CaseStatus.INVESTIGATION, CaseStatus.PENDING_COURT];

    for (let i = 0; i < 30; i++) {
      const caseTypeInfo = CASE_TYPES[i % CASE_TYPES.length];
      const offenceInfo = OFFENCES[i % OFFENCES.length];
      const state = NIGERIAN_STATES[i % NIGERIAN_STATES.length];
      const lga = LGAS[i % LGAS.length];
      const victimName = VICTIM_NAMES[i];
      const perpetratorName = PERPETRATOR_NAMES[i];
      const priority = priorities[i % priorities.length];
      const status = statuses[i % statuses.length];

      const incidentDate = new Date(2024, Math.floor(i / 3), (i % 28) + 1);
      const caseNumber = `FED/${new Date().getFullYear()}/${String(i + 1).padStart(4, '0')}`;

      const victimNameParts = victimName.split(' ');
      const perpetratorNameParts = perpetratorName.split(' ');

      const newCase = await prisma.case.create({
        data: {
          caseNumber,
          tenantId: federalTenant.id,
          title: `${caseTypeInfo.title} - ${state}`,
          description: `${caseTypeInfo.description} reported in ${lga} LGA, ${state}. Investigation ongoing with witness statements collected.`,
          incidentDate,
          incidentState: state,
          incidentLga: lga,
          incidentAddress: `${Math.floor(Math.random() * 100) + 1} ${['Main', 'High', 'Market', 'Station', 'Church'][i % 5]} Street, ${lga}, ${state}`,
          caseType: caseTypeInfo.type,
          priority,
          status,
          createdById: nadminUser.id,
          victims: {
            create: [{
              victimNumber: `V${String(Date.now() + i).slice(-6)}`,
              firstName: victimNameParts[0],
              lastName: victimNameParts[1] || 'Unknown',
              age: 15 + (i % 30),
              gender: i % 4 === 0 ? Gender.MALE : Gender.FEMALE,
              nationality: 'Nigerian',
              phoneNumber: `+234-${800 + i}-000-${String(i).padStart(4, '0')}`,
              currentAddress: `${Math.floor(Math.random() * 50) + 1} Victim Street, ${lga}, ${state}`,
              aliases: [],
            }],
          },
          perpetrators: {
            create: [{
              perpetratorNumber: `P${String(Date.now() + i).slice(-6)}`,
              firstName: perpetratorNameParts[0],
              lastName: perpetratorNameParts[1] || 'Unknown',
              age: 20 + (i % 40),
              gender: i % 5 === 0 ? Gender.FEMALE : Gender.MALE,
              nationality: 'Nigerian',
              phoneNumber: `+234-${900 + i}-000-${String(i).padStart(4, '0')}`,
              currentAddress: `${Math.floor(Math.random() * 50) + 1} Perpetrator Street, ${lga}, ${state}`,
              relationshipToVictim: ['Stranger', 'Acquaintance', 'Family Member', 'Partner', 'Neighbor'][i % 5],
              aliases: [],
            }],
          },
          caseOffences: {
            create: [{
              offenceName: offenceInfo.name,
              offenceCode: offenceInfo.code,
              applicableLaw: offenceInfo.law,
              penalty: offenceInfo.penalty,
              dateOfOffence: incidentDate,
              placeOfOffence: `${lga} LGA, ${state}`,
              trialStatus: TrialStatus.FILED,
            }],
          },
        },
        include: {
          victims: true,
          perpetrators: true,
          caseOffences: true,
        },
      });

      console.log(`✅ Created case ${i + 1}/30: ${newCase.caseNumber} - ${newCase.title}`);
    }

    console.log('\n🎉 Successfully created 30 cases for Federal Ministry!\n');
    console.log('📊 Case Statistics:');
    console.log('==================');
    console.log('Total Cases: 30');
    console.log('Tenant: Federal Ministry of Justice');
    console.log('Created By: nadmin@moj.gov.ng');
    console.log('==================\n');

  } catch (error) {
    console.error('❌ Error creating cases:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createCases();
