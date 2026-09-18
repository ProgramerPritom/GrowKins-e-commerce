export interface HeroSlideCMS {
  id: string;
  image: string;
  badgeAge: string;
  badgeTitle: string;
  badgeSubtitle: string;
  alt: string;
  headline?: string;
  subheadline?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  enabled: boolean;
  sortOrder: number;
}

export interface HomepageCMS {
  hero: {
    enabled: boolean;
    slides: HeroSlideCMS[];
    eyebrow: string;
    headline: string;
    subheadline: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    trustBullet1: string;
    trustBullet2: string;
  };
  stages: {
    enabled: boolean;
    heading: string;
    subheading: string;
  };
  trending: {
    enabled: boolean;
    heading: string;
    subheading: string;
  };
  playShelf: {
    enabled: boolean;
    heading: string;
    subheading: string;
  };
  personalities: {
    enabled: boolean;
    heading: string;
    subheading: string;
  };
  brandPhilosophy: {
    enabled: boolean;
    heading: string;
    subheading: string;
    quote: string;
  };
  ugcMosaic: {
    enabled: boolean;
    heading: string;
    subheading: string;
    handle: string;
  };
  recommendationQuiz: {
    enabled: boolean;
    heading: string;
    subheading: string;
  };
  editorialBanner: {
    enabled: boolean;
    heading: string;
    subheading: string;
    buttonText: string;
  };
  community: {
    enabled: boolean;
    heading: string;
    subheading: string;
  };
  newsletter: {
    enabled: boolean;
    heading: string;
    subheading: string;
  };
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  path: string;
  megaMenuTab?: 'shop' | 'age' | 'play' | 'gifts';
  enabled: boolean;
  sortOrder: number;
  badge?: string;
}

export interface NavigationCMS {
  announcementBar: {
    enabled: boolean;
    messageEn: string;
    messageBn: string;
    linkUrl?: string;
  };
  menuItems: NavigationMenuItem[];
}

export interface FooterCMS {
  brandTagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  facebookUrl: string;
  instagramUrl: string;
  whatsappNumber: string;
  codNoticeText: string;
  copyrightText: string;
}
