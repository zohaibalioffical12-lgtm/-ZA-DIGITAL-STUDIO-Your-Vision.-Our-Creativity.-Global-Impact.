export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'project_manager'
  | 'staff'
  | 'customer';

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  dimensions?: { width: number; height: number };
  altText: string;
  category: 'hero' | 'founder' | 'logo' | 'service' | 'portfolio' | 'team' | 'general';
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  jobTitle: string;
  department: 'Leadership' | 'Design' | 'Engineering' | 'AI & Automation' | 'Management' | 'Marketing';
  biography: string;
  skills: string[];
  photograph: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  twitterUrl?: string;
  published: boolean;
  displayOrder: number;
  isFounder?: boolean;
  createdAt?: string;
}

export interface ServiceItem {
  id: string;
  category: 'branding' | 'web' | 'ai-content' | 'career' | 'automation';
  categoryLabel: string;
  title: string;
  description: string;
  deliverables: string[];
  turnaround: string;
  startingPriceUsd: number;
  currency?: string;
  status: 'available' | 'coming-soon';
  icon: string;
  image?: string;
  revisionPolicy?: string;
  featured?: boolean;
  published?: boolean;
  displayOrder?: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Branding' | 'Graphic Design' | 'Websites' | 'AI Content' | 'UI/UX' | 'Automation';
  image: string;
  galleryImages?: string[];
  description: string;
  tools: string[];
  objective: string;
  deliverables: string[];
  demoUrl?: string;
  caseStudyText?: string;
  isSampleWork: boolean;
  published: boolean;
  featured?: boolean;
  displayOrder?: number;
}

export interface PricingPackage {
  id: string;
  name: string;
  subtitle: string;
  priceUsd: number;
  currency?: string;
  isCustomQuote?: boolean;
  includes: string[];
  excludes: string[];
  turnaroundDays: string;
  revisionPolicy?: string;
  popular?: boolean;
  published?: boolean;
}

export interface AgencySettings {
  founderName: string;
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroSubtext: string;
  heroButtonPrimary: string;
  heroButtonSecondary: string;
  heroButtonTertiary: string;
  heroImage: string;
  websiteLogo?: string;
  founderImage: string;
  founderTitle: string;
  founderBio: string;
  founderPhilosophy: string;
  founderGoals: string;
  founderSkills: string[];
  ctaHeadline: string;
  ctaButtonText: string;
  existingPortfolioUrl: string;
  businessEmail: string;
  messagingLink: string;
  linkedinUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  behanceUrl: string;
}

export interface InquiryRecord {
  id: string;
  clientName: string;
  businessEmail: string;
  brandName: string;
  country: string;
  serviceId: string;
  serviceName: string;
  budgetRangeUsd: string;
  desiredDeadline: string;
  projectDescription: string;
  referenceLinks?: string;
  attachmentUrl?: string;
  privacyConsent: boolean;
  createdAt: string;
  status: 'new' | 'in_review' | 'accepted' | 'declined' | 'completed';
  adminNotes?: string;
}

export interface CustomerMessage {
  id: string;
  inquiryId: string;
  sender: 'client' | 'agency';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
}
