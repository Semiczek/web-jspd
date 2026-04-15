export type NavDictionary = {
  home: string;
  cleaning: string;
  construction: string;
  tech: string;
  bakery: string;
  cafe: string;
  demo: string;
  contact: string;
};

export type HeaderDictionary = {
  groupLabel: string;
  contactCta: string;
  languageLabel: string;
};

export type HomeKpi = {
  value: string;
  label: string;
};

export type HomeVenture = {
  slug: 'cleaning' | 'tech' | 'bakery' | 'cafe';
  tag: string;
  title: string;
  text: string;
  cta: string;
};

export type SectionCard = {
  index: string;
  title: string;
  text: string;
};

export type ProjectItem = {
  tag: string;
  title: string;
  text: string;
  href?: string;
  ctaLabel?: string;
};

export type FeaturePanel = {
  title: string;
  text: string;
  href: string;
  label: string;
};

export type SectionContent = {
  badge: string;
  heroTitle: string;
  heroText: string;
  heroPoints: string[];
  cardsTitle: string;
  cardsLead: string;
  cards: SectionCard[];
  infoTitle: string;
  infoText: string;
  infoItems: string[];
  projectsTitle?: string;
  projectsLead?: string;
  projects?: ProjectItem[];
  featurePanel?: FeaturePanel;
  hideContactBox?: boolean;
  ctaItems?: string[];
  ctaTitle: string;
  ctaText: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export type HomeDictionary = {
  badge: string;
  heroTitle: string;
  heroText: string;
  primaryCta: string;
  secondaryCta: string;
  sideTitle: string;
  sideText: string;
  sideItems: string[];
  sideNote: string;
  pillarsTitle: string;
  pillarsLead: string;
  pillars: SectionCard[];
  whyTitle: string;
  whyText: string;
  whyItems: string[];
  projectsTitle: string;
  projectsLead: string;
  projects: ProjectItem[];
  ctaTitle: string;
  ctaText: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export type ContactDictionary = {
  badge: string;
  heroTitle: string;
  heroText: string;
  boxTitle: string;
  boxText: string;
  emailButton: string;
  rightTitle: string;
  rightText: string;
  rightItems: string[];
};

export type Dictionary = {
  common: {
    brand: string;
    contactEmail: string;
    footerLeft: string;
    footerRight: string;
    footerNote: string;
  };
  header: HeaderDictionary;
  nav: NavDictionary;
  home: HomeDictionary;
  cleaning: SectionContent;
  construction: SectionContent;
  tech: SectionContent;
  bakery: SectionContent;
  cafe: SectionContent;
  demo: SectionContent;
  contact: ContactDictionary;
};
