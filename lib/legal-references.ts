/**
 * Nigerian SGBV Legal References
 * Comprehensive legal framework for Sexual and Gender-Based Violence cases in Nigeria
 */

export interface LegalProvision {
  id: string;
  act: string;
  section: string;
  title: string;
  description: string;
  penalty: string;
  applicability: string;
  fullText: string;
}

export const LEGAL_REFERENCES: LegalProvision[] = [
  // VAPPA 2015 Provisions
  {
    id: 'vappa-section-1',
    act: 'Violence Against Persons (Prohibition) Act 2015',
    section: 'Section 1',
    title: 'Rape',
    description: 'A person commits the offence of rape if he or she intentionally penetrates the vagina, anus or mouth of another person with any other part of his or her body or anything else, without consent, or where consent is obtained by force, threat, intimidation, deceit, or misrepresentation.',
    penalty: 'Life imprisonment',
    applicability: 'Federal Capital Territory (Abuja) and States that have domesticated VAPPA (Anambra, Bauchi, Benue, Ebonyi, Edo, Ekiti, Enugu, Imo, Kaduna, Kwara, Lagos, Nasarawa, Ogun, Ondo, Osun, Oyo, Plateau, Rivers, Taraba)',
    fullText: `Section 1 - Rape
(1) A person commits the offence of rape if—
    (a) he or she intentionally penetrates the vagina, anus or mouth of another person with any other part of his or her body or anything else;
    (b) the other person does not consent to the penetration; or
    (c) the consent is obtained by force or means of threat or intimidation of any kind or by fear of harm or by means of false and fraudulent representation as to the nature of the act or the use of any substance or additive capable of taking away the will of such person or in the case of a married person by impersonating his or her spouse.

(2) A person convicted of an offence under subsection (1) is liable to imprisonment for life except—
    (a) in the case of a person below the age of 14 years—imprisonment for a term of not less than 14 years;
    (b) where the offender is less than 14 years, imprisonment for a term not less than 14 years.

(3) It shall not be a defence that—
    (a) the victim is the spouse of the offender; or
    (b) the offender believed that the victim consented to the act.`
  },
  {
    id: 'vappa-section-6',
    act: 'Violence Against Persons (Prohibition) Act 2015',
    section: 'Section 6',
    title: 'Female Genital Mutilation (FGM)',
    description: 'Prohibition of female circumcision or genital mutilation. Any person who performs, engages another to perform, or supports female genital mutilation commits an offence.',
    penalty: '4 years imprisonment or a fine of N200,000 or both',
    applicability: 'Federal Capital Territory (Abuja) and States that have domesticated VAPPA',
    fullText: `Section 6 - Female Genital Mutilation
(1) A person who—
    (a) performs female circumcision or genital mutilation;
    (b) engages another to carry out female circumcision or genital mutilation; or
    (c) aids, abets or counsels another person to excise, infibulate or otherwise mutilate the whole or any part of the labia minora, labia majora and the clitoris of another person, commits an offence and is liable on conviction to a term of imprisonment not exceeding 4 years or to a fine not exceeding N200,000.00 or both.

(2) It is not a defence to a charge under subsection (1) of this section that the victim or any other person consented to the act.

(3) Anybody who attempts, aids, abets, or incites another to carry out female genital mutilation is liable to a term not exceeding 2 years imprisonment or to a fine not exceeding N100,000.00 or both.`
  },
  {
    id: 'vappa-section-2',
    act: 'Violence Against Persons (Prohibition) Act 2015',
    section: 'Section 2',
    title: 'Indecent Sexual Assault',
    description: 'A person who unlawfully and indecently assaults another person commits an offence.',
    penalty: '3 years imprisonment',
    applicability: 'Federal Capital Territory (Abuja) and States that have domesticated VAPPA',
    fullText: `Section 2 - Indecent Sexual Assault
A person who unlawfully and indecently assaults another person commits an offence and is liable on conviction to imprisonment for a term of 3 years.`
  },
  {
    id: 'vappa-section-11',
    act: 'Violence Against Persons (Prohibition) Act 2015',
    section: 'Section 11',
    title: 'Incest',
    description: 'A person who has sexual intercourse with another person who is to his knowledge his biological child, parent, grandchild, grandparent, sibling, half sibling, or child of his sibling commits an offence.',
    penalty: '10 years imprisonment',
    applicability: 'Federal Capital Territory (Abuja) and States that have domesticated VAPPA',
    fullText: `Section 11 - Incest
A person who has sexual intercourse with another person who is to his knowledge his biological child, parent, grandchild, grandparent, sibling, half sibling, or child of his sibling commits an offence and is liable on conviction to imprisonment for a term of 10 years.`
  },

  // Child Rights Act Provisions
  {
    id: 'cra-section-31',
    act: 'Child Rights Act 2003',
    section: 'Section 31',
    title: 'Unlawful Sexual Intercourse with a Child',
    description: 'Any person who has sexual intercourse with a child commits an offence of rape and is liable on conviction to imprisonment for life.',
    penalty: 'Life imprisonment',
    applicability: 'States that have domesticated the Child Rights Act (26 out of 36 states)',
    fullText: `Section 31 - Unlawful Sexual Intercourse with a Child
(1) A person who has sexual intercourse with a child is liable on conviction to imprisonment for life.

(2) Where a person is charged with an offence under this section, it is immaterial that—
    (a) the offender believed the person to be of or above the age of 18 years; or
    (b) the sexual intercourse was with the consent of the child.

Note: A child is defined under the Child Rights Act as a person under the age of 18 years.`
  },
  {
    id: 'cra-section-32',
    act: 'Child Rights Act 2003',
    section: 'Section 32',
    title: 'Sexual Abuse and Exploitation',
    description: 'Prohibition of sexual abuse, prostitution, and use of children for pornographic purposes.',
    penalty: '14 years imprisonment',
    applicability: 'States that have domesticated the Child Rights Act',
    fullText: `Section 32 - Sexual Abuse and Exploitation
No person shall—
(a) use, procure or offer a child for prostitution;
(b) use, procure or offer a child for the production of pornography or pornographic performance; or
(c) use, procure or present a child for sexual exploitation.

Penalty: A person who contravenes the provisions of this section commits an offence and is liable on conviction to imprisonment for a term of 14 years.`
  },

  // Additional VAPPA Provisions
  {
    id: 'vappa-section-3',
    act: 'Violence Against Persons (Prohibition) Act 2015',
    section: 'Section 3',
    title: 'Grievous Harm',
    description: 'A person who unlawfully does grievous harm to another person commits an offence.',
    penalty: '10 years imprisonment',
    applicability: 'Federal Capital Territory (Abuja) and States that have domesticated VAPPA',
    fullText: `Section 3 - Grievous Harm
A person who unlawfully does grievous harm to another person commits an offence and is liable on conviction to imprisonment for a term of 10 years.`
  },
  {
    id: 'vappa-section-14',
    act: 'Violence Against Persons (Prohibition) Act 2015',
    section: 'Section 14',
    title: 'Spousal Battery',
    description: 'A person who batters his or her spouse commits an offence.',
    penalty: '3 years imprisonment or a fine of N200,000 or both',
    applicability: 'Federal Capital Territory (Abuja) and States that have domesticated VAPPA',
    fullText: `Section 14 - Spousal Battery
A person who batters his or her spouse commits an offence and is liable on conviction to imprisonment for a term of 3 years or to a fine of N200,000.00 or both.`
  },
  {
    id: 'vappa-section-18',
    act: 'Violence Against Persons (Prohibition) Act 2015',
    section: 'Section 18',
    title: 'Economic Abuse',
    description: 'A person who deprives another person of economic or financial resources commits an offence of economic abuse.',
    penalty: '2 years imprisonment or a fine of N500,000 or both',
    applicability: 'Federal Capital Territory (Abuja) and States that have domesticated VAPPA',
    fullText: `Section 18 - Economic Abuse
(1) A person who deprives another person of economic or financial resources which the other person is entitled to under any law or custom or which the person requires out of necessity including household necessities for that person and children in that person's household, commits an offence and is liable on conviction to imprisonment for a term of 2 years or to a fine of N500,000.00 or both.`
  },
  {
    id: 'vappa-section-24',
    act: 'Violence Against Persons (Prohibition) Act 2015',
    section: 'Section 24',
    title: 'Harmful Widowhood Practices',
    description: 'Prohibition of harmful traditional practices against widows.',
    penalty: '2 years imprisonment or a fine of N500,000 or both',
    applicability: 'Federal Capital Territory (Abuja) and States that have domesticated VAPPA',
    fullText: `Section 24 - Harmful Widowhood Practices
A person who subjects a widow or widower to any inhuman, humiliating or degrading treatment commits an offence and is liable on conviction to imprisonment for a term of 2 years or to a fine of N500,000.00 or both.`
  },

  // Trafficking in Persons Prohibition Act
  {
    id: 'tippa-section-13',
    act: 'Trafficking in Persons (Prohibition) Enforcement and Administration Act 2015',
    section: 'Section 13',
    title: 'Trafficking in Persons',
    description: 'Prohibition of trafficking in persons for any purpose including sexual exploitation, forced labor, slavery, or removal of organs.',
    penalty: 'Minimum of 7 years imprisonment and a fine of not less than N5,000,000',
    applicability: 'Nationwide',
    fullText: `Section 13 - Trafficking in Persons
A person who recruits, transports, transfers, harbours or receives another person by means of threat, use of force, coercion, abduction, fraud, deception, abuse of power or of a position of vulnerability or the giving or receiving of payments or benefits to achieve the consent of a person having control over another person for the purpose of exploitation commits an offence and is liable on conviction to imprisonment for a term of not less than 7 years and a fine of not less than N5,000,000.00.`
  }
];

// Helper functions
export function getLegalProvisionById(id: string): LegalProvision | undefined {
  return LEGAL_REFERENCES.find(ref => ref.id === id);
}

export function getLegalProvisionsByAct(act: string): LegalProvision[] {
  return LEGAL_REFERENCES.filter(ref => ref.act.includes(act));
}

export function searchLegalProvisions(query: string): LegalProvision[] {
  const lowerQuery = query.toLowerCase();
  return LEGAL_REFERENCES.filter(ref => 
    ref.title.toLowerCase().includes(lowerQuery) ||
    ref.description.toLowerCase().includes(lowerQuery) ||
    ref.act.toLowerCase().includes(lowerQuery) ||
    ref.section.toLowerCase().includes(lowerQuery)
  );
}

export function getVAPPAProvisions(): LegalProvision[] {
  return getLegalProvisionsByAct('Violence Against Persons');
}

export function getCRAProvisions(): LegalProvision[] {
  return getLegalProvisionsByAct('Child Rights Act');
}

// Offense type to legal provision mapping
export const OFFENSE_TO_LEGAL_PROVISION: Record<string, string[]> = {
  'RAPE': ['vappa-section-1', 'cra-section-31'],
  'SEXUAL_ASSAULT': ['vappa-section-2'],
  'DEFILEMENT': ['cra-section-31'],
  'FGM': ['vappa-section-6'],
  'INCEST': ['vappa-section-11'],
  'DOMESTIC_VIOLENCE': ['vappa-section-14', 'vappa-section-3'],
  'CHILD_ABUSE': ['cra-section-31', 'cra-section-32'],
  'TRAFFICKING': ['tippa-section-13'],
  'ECONOMIC_ABUSE': ['vappa-section-18'],
  'HARMFUL_WIDOWHOOD_PRACTICES': ['vappa-section-24']
};

export function getLegalProvisionsForOffense(offenseType: string): LegalProvision[] {
  const provisionIds = OFFENSE_TO_LEGAL_PROVISION[offenseType] || [];
  return provisionIds
    .map(id => getLegalProvisionById(id))
    .filter((provision): provision is LegalProvision => provision !== undefined);
}
