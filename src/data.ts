import { PracticeArea, Attorney } from './types';

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    id: 'corp-ma',
    name: 'Corporate M&A & General Counsel',
    shortDescription: 'Strategic counsel for mergers, acquisitions, venture financing, and complex corporate governance.',
    fullDescription: 'We advise leading enterprises, technology innovators, and private equity funds through high-stakes mergers, joint ventures, spin-offs, and strategic asset purchases. Our advice covers structural tax planning, corporate finance, and boardroom compliance.',
    baseRetainer: 7500,
    hourlyRate: 600,
    typicalHours: 25,
    iconName: 'Briefcase',
    keyIssues: ['Venture Capital Rounds', 'Board Advisory & Disputes', 'Asset Purchase Agreements', 'Antitrust Compliance']
  },
  {
    id: 'litigation',
    name: 'High-Stakes Commercial Litigation',
    shortDescription: 'Aggressive, trial-ready representation for breach of contract, shareholder disputes, and class actions.',
    fullDescription: 'Our litigation team is feared in federal and state courts nationwide. We thrive on complex commercial trials, defending corporate entities and executives against existential civil claims, regulatory enforcement, and fiduciary breaches.',
    baseRetainer: 10000,
    hourlyRate: 650,
    typicalHours: 40,
    iconName: 'Scale',
    keyIssues: ['Shareholder Derivative Suits', 'Breach of Fiduciary Duty', 'Trade Secret Misappropriation', 'Contract Enforcement']
  },
  {
    id: 'intellectual-property',
    name: 'Intellectual Property & Patents',
    shortDescription: 'Comprehensive protection and commercialization of software, deep tech, and proprietary patents.',
    fullDescription: 'We help global innovators capture, license, and litigate critical assets. From technical software patents to biotech portfolio strategy, we bridge the gap between complex engineering, hardware development, and robust legal monopolies.',
    baseRetainer: 6000,
    hourlyRate: 550,
    typicalHours: 20,
    iconName: 'Shield',
    keyIssues: ['Utility Patent Prosecution', 'DMCA & Software Audits', 'Trademark Infringement Disputes', 'IP Licensing Agreements']
  },
  {
    id: 'estate-wealth',
    name: 'Private Wealth & Asset Protection',
    shortDescription: 'Sophisticated estate plans, generational wealth transfers, asset trusts, and family governance.',
    fullDescription: 'We craft ironclad generational structures for high-net-worth families, entrepreneurs, and executives. Our focus is shielding assets from liability, optimizing multigenerational tax exposure, and designing seamless corporate succession plans.',
    baseRetainer: 5000,
    hourlyRate: 480,
    typicalHours: 15,
    iconName: 'TrendingUp',
    keyIssues: ['Irrevocable Asset Trusts', 'Generational Wealth Transfer', 'Business Succession Plans', 'Tax Exposure Mitigation']
  },
  {
    id: 'white-collar',
    name: 'White-Collar & Regulatory Defense',
    shortDescription: 'Discreet defense and risk mitigation for SEC audits, DOJ investigations, and corporate compliance.',
    fullDescription: 'We provide crisis counsel and elite defense for corporations and high-profile individuals facing state, federal, and international regulatory enforcement. We excel at internal investigations, grand jury defense, and compliance audits.',
    baseRetainer: 12000,
    hourlyRate: 700,
    typicalHours: 35,
    iconName: 'ShieldAlert',
    keyIssues: ['DOJ/SEC Subpoena Response', 'Foreign Corrupt Practices Act (FCPA)', 'Internal Compliance Audits', 'Healthcare Billing Audits']
  }
];

export const ATTORNEYS: Attorney[] = [
  {
    id: 'eleanor-sterling',
    name: 'Eleanor Sterling, Esq.',
    title: 'Senior Managing Partner',
    education: 'Harvard Law School (J.D., magna cum laude)',
    experienceYears: 22,
    hourlyRate: 650,
    successRate: 95,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400',
    specialties: ['corp-ma', 'estate-wealth'],
    bio: 'Eleanor is a prominent figure in corporate restructuring and wealth management, advising fortune 500 companies and ultra-high-net-worth founders for over two decades. She sits on multiple corporate advisory boards.',
    notableCase: 'Negotiated a $1.2B pharmaceutical asset acquisition with zero structural liability.'
  },
  {
    id: 'douglas-thorne',
    name: 'Douglas Thorne, Esq.',
    title: 'Co-Founder & Chief Trial Advocate',
    education: 'Yale Law School (J.D.)',
    experienceYears: 25,
    hourlyRate: 700,
    successRate: 97,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400',
    specialties: ['litigation', 'white-collar'],
    bio: 'Douglas is a renowned trial attorney known for defending high-profile entities and executives in federal courts. He specializes in white-collar regulatory disputes and bet-the-company commercial litigation.',
    notableCase: 'Acquitted a tech CEO on all counts in high-profile federal SEC insider trading dispute.'
  },
  {
    id: 'dr-marcus-vance',
    name: 'Dr. Marcus Vance, Esq.',
    title: 'Partner, Intellectual Property Lead',
    education: 'Stanford Law School (J.D.), MIT (Ph.D. in Computer Science)',
    experienceYears: 14,
    hourlyRate: 550,
    successRate: 91,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400',
    specialties: ['intellectual-property', 'corp-ma'],
    bio: 'Dr. Vance combines deep technical expertise with advanced IP strategy. He assists AI startups, biotech enterprises, and advanced aerospace firms in safeguarding proprietary source code and advanced hardware patents.',
    notableCase: 'Successfully defended a machine-learning patent portfolio from competitor infringement.'
  },
  {
    id: 'sophia-mercer',
    name: 'Sophia Mercer, Esq.',
    title: 'Senior Counsel',
    education: 'Columbia Law School (J.D.)',
    experienceYears: 10,
    hourlyRate: 480,
    successRate: 93,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
    specialties: ['estate-wealth', 'corp-ma'],
    bio: 'Sophia crafts personalized trusts, asset shelters, and multi-tier company structures to ensure seamless succession and tax mitigation. She is highly praised for her detailed and patient client collaboration.',
    notableCase: 'Established a multigenerational asset trust preserving $340M in founder capital.'
  }
];

export const OFFICE_REVIEWS = [
  {
    id: 1,
    author: 'Robert J. Chen',
    role: 'CEO, Horizon Ventures',
    text: 'Thorne & Sterling represents the absolute pinnacle of legal representation. Their attention to corporate detail and structural safety saved our merger.',
    stars: 5
  },
  {
    id: 2,
    author: 'Helena Rostov',
    role: 'Founder, Rostov Aero',
    text: 'Marcus Vance secured our key patent block under aggressive timelines. His MIT credentials meant he understood our source code immediately.',
    stars: 5
  },
  {
    id: 3,
    author: 'Marcus Vance, Jr. (Non-Relative)',
    role: 'Real Estate Developer',
    text: 'Eleanor and Sophia structured our family trust flawlessly. They shielded us from massive liability and set up an incredible estate plan.',
    stars: 5
  }
];
