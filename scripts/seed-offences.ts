import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const offencesData = [
  {
    offenceName: 'Trafficking in women',
    law: 'Penal Code',
    section: 'Section 281',
    act: 'Penal Code',
    penalty: '7 years imprisonment and fine',
    minimumSentence: '7 years',
    maximumSentence: '7 years',
    offenceCategory: 'Trafficking',
  },
  {
    offenceName: 'Rape',
    law: 'Penal Code',
    section: 'Section 283',
    act: 'Penal Code',
    penalty: 'Life imprisonment and fine',
    minimumSentence: 'Life',
    maximumSentence: 'Life',
    offenceCategory: 'Sexual Violence',
  },
  {
    offenceName: 'Abandonment of child under 12 years',
    law: 'Penal Code',
    section: 'Section 237',
    act: 'Penal Code',
    penalty: '7 years imprisonment and fine',
    minimumSentence: '7 years',
    maximumSentence: '7 years',
    offenceCategory: 'Child Abuse',
  },
  {
    offenceName: 'Incest with consent',
    law: 'Penal Code',
    section: 'Section 390',
    act: 'Penal Code',
    penalty: '7 years imprisonment and fine',
    minimumSentence: '7 years',
    maximumSentence: '7 years',
    offenceCategory: 'Sexual Violence',
  },
  {
    offenceName: 'Rape',
    law: 'VAPPA',
    section: 'Section 1',
    act: 'Violence Against Persons Prohibition Act (VAPPA)',
    penalty: 'Life imprisonment',
    minimumSentence: 'Life',
    maximumSentence: 'Life',
    offenceCategory: 'Sexual Violence',
  },
  {
    offenceName: 'Performance of female circumcision or genital mutilation',
    law: 'VAPPA',
    section: 'Section 6',
    act: 'Violence Against Persons Prohibition Act (VAPPA)',
    penalty: '4 years imprisonment or fine or both; 2 years for attempt; 2 years for inciting/aiding',
    minimumSentence: '2 years',
    maximumSentence: '4 years',
    offenceCategory: 'Gender-Based Violence',
  },
  {
    offenceName: 'Forceful ejection of spouse from home',
    law: 'VAPPA',
    section: 'Section 9',
    act: 'Violence Against Persons Prohibition Act (VAPPA)',
    penalty: '2 years imprisonment or fine or both; 1 year for attempt',
    minimumSentence: '1 year',
    maximumSentence: '2 years',
    offenceCategory: 'Domestic Violence',
  },
  {
    offenceName: 'Forced isolation or separation from family and friends',
    law: 'VAPPA',
    section: 'Section 13',
    act: 'Violence Against Persons Prohibition Act (VAPPA)',
    penalty: '6 months imprisonment or fine or both; 3 months for attempt/inciting/aiding/receiving',
    minimumSentence: '3 months',
    maximumSentence: '6 months',
    offenceCategory: 'Domestic Violence',
  },
  {
    offenceName: 'Emotional, verbal and psychological abuse',
    law: 'VAPPA',
    section: 'Section 14',
    act: 'Violence Against Persons Prohibition Act (VAPPA)',
    penalty: '1 year imprisonment or fine or both; 6 months for attempt/inciting/aiding/receiving',
    minimumSentence: '6 months',
    maximumSentence: '1 year',
    offenceCategory: 'Domestic Violence',
  },
  {
    offenceName: 'Harmful widowhood practices',
    law: 'VAPPA',
    section: 'Section 15',
    act: 'Violence Against Persons Prohibition Act (VAPPA)',
    penalty: '2 years imprisonment or fine or both; 1 year for attempt/inciting/aiding/receiving',
    minimumSentence: '1 year',
    maximumSentence: '2 years',
    offenceCategory: 'Gender-Based Violence',
  },
  {
    offenceName: 'Abandonment of spouse, children and other dependents without sustenance',
    law: 'VAPPA',
    section: 'Section 16',
    act: 'Violence Against Persons Prohibition Act (VAPPA)',
    penalty: '3 years imprisonment or fine or both; 2 years for attempt/inciting/aiding; 1 year for assisting',
    minimumSentence: '1 year',
    maximumSentence: '3 years',
    offenceCategory: 'Domestic Violence',
  },
  {
    offenceName: 'Spousal battery',
    law: 'VAPPA',
    section: 'Section 19',
    act: 'Violence Against Persons Prohibition Act (VAPPA)',
    penalty: '3 years imprisonment or fine or both; 1 year for attempt/inciting/aiding/receiving',
    minimumSentence: '1 year',
    maximumSentence: '3 years',
    offenceCategory: 'Domestic Violence',
  },
  {
    offenceName: 'Incest without consent',
    law: 'VAPPA',
    section: 'Section 25(a)',
    act: 'Violence Against Persons Prohibition Act (VAPPA)',
    penalty: '10 years imprisonment without an option of fine',
    minimumSentence: '10 years',
    maximumSentence: '10 years',
    offenceCategory: 'Sexual Violence',
  },
  {
    offenceName: 'Incest with consent',
    law: 'VAPPA',
    section: 'Section 25(b)',
    act: 'Violence Against Persons Prohibition Act (VAPPA)',
    penalty: 'Minimum of 5 years imprisonment without option of fine',
    minimumSentence: '5 years',
    maximumSentence: '5 years',
    offenceCategory: 'Sexual Violence',
  },
  {
    offenceName: 'Child marriage and betrothal',
    law: 'Child\'s Right Act (CRA)',
    section: 'Section 23(d)',
    act: 'Child\'s Right Act',
    penalty: 'Five hundred thousand naira fine (₦500,000) or five years imprisonment or both',
    minimumSentence: '5 years',
    maximumSentence: '5 years',
    offenceCategory: 'Child Abuse',
  },
  {
    offenceName: 'Making tattoos or skin marks on a child',
    law: 'Child\'s Right Act (CRA)',
    section: 'Section 24(2)',
    act: 'Child\'s Right Act',
    penalty: 'Five thousand naira fine (₦5,000) or one month imprisonment or both',
    minimumSentence: '1 month',
    maximumSentence: '1 month',
    offenceCategory: 'Child Abuse',
  },
  {
    offenceName: 'Exposure of child to use, production and trafficking of narcotic drugs',
    law: 'Child\'s Right Act (CRA)',
    section: 'Section 25(2)',
    act: 'Child\'s Right Act',
    penalty: 'Life imprisonment',
    minimumSentence: 'Life',
    maximumSentence: 'Life',
    offenceCategory: 'Child Abuse',
  },
  {
    offenceName: 'Buying, selling, hiring or dealing in children for hawking, begging or prostitution',
    law: 'Child\'s Right Act (CRA)',
    section: 'Section 30(3)',
    act: 'Child\'s Right Act',
    penalty: '10 years imprisonment',
    minimumSentence: '10 years',
    maximumSentence: '10 years',
    offenceCategory: 'Child Trafficking',
  },
  {
    offenceName: 'Unlawful sexual intercourse with a child',
    law: 'Child\'s Right Act (CRA)',
    section: 'Section 31(2)',
    act: 'Child\'s Right Act',
    penalty: 'Life imprisonment',
    minimumSentence: 'Life',
    maximumSentence: 'Life',
    offenceCategory: 'Child Sexual Abuse',
  },
  {
    offenceName: 'Trafficking in persons',
    law: 'TPPA',
    section: 'Section 13',
    act: 'Trafficking in Persons (Prohibition) Law Enforcement and Administration Act',
    penalty: 'Minimum of 2 years imprisonment or fine',
    minimumSentence: '2 years',
    maximumSentence: '2 years',
    offenceCategory: 'Trafficking',
  },
  {
    offenceName: 'Importation and exportation of persons',
    law: 'TPPA',
    section: 'Section 14',
    act: 'Trafficking in Persons (Prohibition) Law Enforcement and Administration Act',
    penalty: 'Minimum of 5 years imprisonment and fine',
    minimumSentence: '5 years',
    maximumSentence: '5 years',
    offenceCategory: 'Trafficking',
  },
  {
    offenceName: 'Procurement of persons for sexual exploitation',
    law: 'TPPA',
    section: 'Section 15',
    act: 'Trafficking in Persons (Prohibition) Law Enforcement and Administration Act',
    penalty: '5 years imprisonment and fine',
    minimumSentence: '5 years',
    maximumSentence: '5 years',
    offenceCategory: 'Sexual Exploitation',
  },
  {
    offenceName: 'Producing child pornography',
    law: 'CCA',
    section: 'Section 23(a)',
    act: 'Cybercrimes Act',
    penalty: 'Twenty million naira (₦20,000,000) fine or 10 years imprisonment or both',
    minimumSentence: '10 years',
    maximumSentence: '10 years',
    offenceCategory: 'Child Sexual Exploitation',
  },
  {
    offenceName: 'Offering or making available child pornography',
    law: 'CCA',
    section: 'Section 23(b)',
    act: 'Cybercrimes Act',
    penalty: 'Twenty million naira (₦20,000,000) fine or 10 years imprisonment or both',
    minimumSentence: '10 years',
    maximumSentence: '10 years',
    offenceCategory: 'Child Sexual Exploitation',
  },
  {
    offenceName: 'Distributing or transmitting child pornography',
    law: 'CCA',
    section: 'Section 23(c)',
    act: 'Cybercrimes Act',
    penalty: 'Twenty million naira (₦20,000,000) fine or 10 years imprisonment or both',
    minimumSentence: '10 years',
    maximumSentence: '10 years',
    offenceCategory: 'Child Sexual Exploitation',
  },
  {
    offenceName: 'Procuring child pornography for oneself or another',
    law: 'CCA',
    section: 'Section 23(d)',
    act: 'Cybercrimes Act',
    penalty: 'Ten million naira (₦10,000,000) fine or 5 years imprisonment or both',
    minimumSentence: '5 years',
    maximumSentence: '5 years',
    offenceCategory: 'Child Sexual Exploitation',
  },
  {
    offenceName: 'Possessing child pornography in a computer system',
    law: 'CCA',
    section: 'Section 23(e)',
    act: 'Cybercrimes Act',
    penalty: 'Ten million naira (₦10,000,000) fine or 10 years imprisonment or both',
    minimumSentence: '10 years',
    maximumSentence: '10 years',
    offenceCategory: 'Child Sexual Exploitation',
  },
  {
    offenceName: 'Making or sending pornographic images by unsolicited distribution',
    law: 'CCA',
    section: 'Section 23(2)',
    act: 'Cybercrimes Act',
    penalty: 'Two Hundred and Fifty Thousand Naira (₦250,000) or one year imprisonment or both',
    minimumSentence: '1 year',
    maximumSentence: '1 year',
    offenceCategory: 'Cybercrime',
  },
  {
    offenceName: 'Engaging in sexual activities with a child',
    law: 'CCA',
    section: 'Section 23(3)(a)',
    act: 'Cybercrimes Act',
    penalty: 'Fifteen million naira (₦15,000,000) fine or 10 years imprisonment or both',
    minimumSentence: '10 years',
    maximumSentence: '10 years',
    offenceCategory: 'Child Sexual Abuse',
  },
  {
    offenceName: 'Engaging in sexual activities with child using coercion or abuse of authority',
    law: 'CCA',
    section: 'Section 23(3)(b)',
    act: 'Cybercrimes Act',
    penalty: 'Twenty-five million naira (₦25,000,000) fine or 15 years imprisonment or both',
    minimumSentence: '15 years',
    maximumSentence: '15 years',
    offenceCategory: 'Child Sexual Abuse',
  },
  {
    offenceName: 'Engaging in sexual activities with consent knowing HIV/life-threatening disease transmission',
    law: 'ADA',
    section: 'Section 26(1)',
    act: 'Anti-Discrimination Act',
    penalty: 'Imprisonment of 20 years or life imprisonment',
    minimumSentence: '20 years',
    maximumSentence: 'Life',
    offenceCategory: 'Sexual Violence',
  },
  {
    offenceName: 'Intentionally distributing or administering substances to stupefy or overpower',
    law: 'ADA',
    section: 'Section 28(1)',
    act: 'Anti-Discrimination Act',
    penalty: 'Five million naira (₦5,000,000) fine or 10 years imprisonment or both',
    minimumSentence: '10 years',
    maximumSentence: '10 years',
    offenceCategory: 'Drug-Facilitated Crime',
  },
];

async function main() {
  console.log('Starting offences seeding...');

  // Create a JSON file for reference
  const fs = require('fs');
  const path = require('path');
  
  const outputPath = path.join(__dirname, '..', 'lib', 'offences-reference.json');
  fs.writeFileSync(outputPath, JSON.stringify(offencesData, null, 2));
  
  console.log(`✅ Created offences reference file at: ${outputPath}`);
  console.log(`📊 Total offences: ${offencesData.length}`);
  
  // Group by category
  const categories = offencesData.reduce((acc, offence) => {
    const category = offence.offenceCategory;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(offence);
    return acc;
  }, {} as Record<string, typeof offencesData>);
  
  console.log('\n📋 Offences by category:');
  Object.entries(categories).forEach(([category, offences]) => {
    console.log(`  - ${category}: ${offences.length} offences`);
  });
  
  console.log('\n✅ Offences data is now available for use in the application');
  console.log('   You can import this data in your forms and case creation workflows');
}

main()
  .catch((e) => {
    console.error('Error seeding offences:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
