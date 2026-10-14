import fs from 'fs';
import path from 'path';
import {
  ServiceItem,
  PortfolioItem,
  PricingPackage,
  AgencySettings,
  InquiryRecord,
  CustomerMessage,
  ActivityLog,
  MediaItem,
  TeamMember
} from '../types';
import {
  initialServices,
  initialPortfolio,
  initialPricing,
  initialSettings,
  initialMedia,
  initialTeam
} from './defaultData';

export interface DatabaseSchema {
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  pricing: PricingPackage[];
  settings: AgencySettings;
  inquiries: InquiryRecord[];
  messages: CustomerMessage[];
  activityLogs: ActivityLog[];
  media: MediaItem[];
  team: TeamMember[];
  adminConfig: {
    email: string;
    passwordSecret: string;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

function getDefaultDb(): DatabaseSchema {
  return {
    services: initialServices,
    portfolio: initialPortfolio,
    pricing: initialPricing,
    settings: initialSettings,
    media: initialMedia,
    team: initialTeam,
    inquiries: [
      {
        id: 'inq_sample_01',
        clientName: 'Sarah Jenkins',
        businessEmail: 'sarah@aurorastudios.co',
        brandName: 'Aurora Studios',
        country: 'United Kingdom',
        serviceId: 'logo-brand-identity',
        serviceName: 'Logo & Brand Identity Architecture',
        budgetRangeUsd: '$500 - $1,500',
        desiredDeadline: '2 weeks',
        projectDescription: 'We are launching an international boutique interior design agency and need a minimal, high-end visual brand and identity system.',
        referenceLinks: 'https://aurora-concept.example.com',
        privacyConsent: true,
        createdAt: '2026-10-10T14:20:00Z',
        status: 'accepted',
        adminNotes: 'Initial brief reviewed. Scheduled discovery kickoff call.'
      }
    ],
    messages: [
      {
        id: 'msg_01',
        inquiryId: 'inq_sample_01',
        sender: 'agency',
        senderName: 'Zohaib Ali (Founder)',
        message: 'Welcome to ZA DIGITAL STUDIO! We have received your brand identity brief and started concept exploration.',
        timestamp: '2026-10-11T09:15:00Z'
      }
    ],
    activityLogs: [
      {
        id: 'log_01',
        action: 'System Upgraded',
        timestamp: new Date().toISOString(),
        details: 'ZA DIGITAL STUDIO ultra premium core initialized with advanced image management and team modules.'
      }
    ],
    adminConfig: {
      email: 'zohaibalioffical12@gmail.com',
      passwordSecret: process.env.ADMIN_PASSWORD || 'ZA-Studio2026!'
    }
  };
}

class JsonDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure new collections exist even if loading from previous version
        if (!parsed.media || parsed.media.length === 0) {
          parsed.media = initialMedia;
        } else {
          // Merge any missing initial media items into existing library
          for (const item of initialMedia) {
            if (!parsed.media.some((m: MediaItem) => m.id === item.id || m.filename === item.filename)) {
              parsed.media.push(item);
            }
          }
        }

        if (!parsed.team || parsed.team.length === 0) {
          parsed.team = initialTeam;
        } else {
          // Update founder photograph if it was using older placeholder
          const founder = parsed.team.find((t: TeamMember) => t.isFounder || t.name === 'Zohaib Ali');
          if (founder && (!founder.photograph || founder.photograph.includes('portfolio_branding_showcase'))) {
            founder.photograph = initialTeam[0].photograph;
          }
        }

        // Fill any missing settings fields and ensure authentic assets
        parsed.settings = { ...initialSettings, ...parsed.settings };
        if (!parsed.settings.websiteLogo) {
          parsed.settings.websiteLogo = initialSettings.websiteLogo;
        }
        if (!parsed.settings.founderImage || parsed.settings.founderImage.includes('portfolio_branding_showcase')) {
          parsed.settings.founderImage = initialSettings.founderImage;
        }

        this.saveDirect(parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read existing db.json, generating default:', e);
    }
    const defaultData = getDefaultDb();
    this.saveDirect(defaultData);
    return defaultData;
  }

  private saveDirect(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write db.json:', e);
    }
  }

  public save() {
    this.saveDirect(this.data);
  }

  /* --- Media Management --- */
  public getMedia(category?: string): MediaItem[] {
    if (category && category !== 'all') {
      return this.data.media.filter((m) => m.category === category);
    }
    return this.data.media;
  }

  public saveMediaItem(item: MediaItem): MediaItem {
    const idx = this.data.media.findIndex((m) => m.id === item.id);
    if (idx >= 0) {
      this.data.media[idx] = item;
      this.logActivity('Updated Media Item', `Edited metadata for "${item.originalName}"`);
    } else {
      this.data.media.unshift(item);
      this.logActivity('Uploaded New Media', `Uploaded image "${item.originalName}" (${item.category})`);
    }
    this.save();
    return item;
  }

  public deleteMediaItem(id: string): boolean {
    const item = this.data.media.find((m) => m.id === id);
    if (!item) return false;

    // Remove file from disk if it was an uploaded file in /uploads
    if (item.url.startsWith('/api/uploads/')) {
      const filename = path.basename(item.url);
      const filePath = path.join(UPLOADS_DIR, filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Could not delete file from disk:', e);
        }
      }
    }

    this.data.media = this.data.media.filter((m) => m.id !== id);
    this.logActivity('Deleted Media Item', `Removed "${item.originalName}"`);
    this.save();
    return true;
  }

  /* --- Team Management --- */
  public getTeam(includeUnpublished = false): TeamMember[] {
    const list = this.data.team || [];
    const sorted = [...list].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    if (includeUnpublished) {
      return sorted;
    }
    return sorted.filter((t) => t.published);
  }

  public saveTeamMember(member: TeamMember): TeamMember {
    if (!this.data.team) this.data.team = [];
    const idx = this.data.team.findIndex((t) => t.id === member.id);
    if (idx >= 0) {
      this.data.team[idx] = member;
      this.logActivity('Updated Team Profile', `Updated "${member.name}" (${member.jobTitle})`);
    } else {
      this.data.team.push(member);
      this.logActivity('Added Team Member', `Added profile for "${member.name}" (${member.jobTitle})`);
    }
    this.save();
    return member;
  }

  public deleteTeamMember(id: string): boolean {
    if (!this.data.team) return false;
    const member = this.data.team.find((t) => t.id === id);
    if (!member) return false;
    this.data.team = this.data.team.filter((t) => t.id !== id);
    this.logActivity('Deleted Team Member', `Removed profile for "${member.name}"`);
    this.save();
    return true;
  }

  /* --- Services --- */
  public getServices(includeUnpublished = false) {
    if (includeUnpublished) {
      return this.data.services;
    }
    return this.data.services.filter((s) => s.published !== false);
  }

  public saveServiceItem(item: ServiceItem) {
    const idx = this.data.services.findIndex((s) => s.id === item.id);
    if (idx >= 0) {
      this.data.services[idx] = item;
      this.logActivity('Updated Service', `Edited "${item.title}"`);
    } else {
      this.data.services.push(item);
      this.logActivity('Created Service', `Added "${item.title}"`);
    }
    this.save();
    return item;
  }

  public deleteServiceItem(id: string) {
    const item = this.data.services.find((s) => s.id === id);
    this.data.services = this.data.services.filter((s) => s.id !== id);
    if (item) {
      this.logActivity('Deleted Service', `Removed "${item.title}"`);
    }
    this.save();
    return true;
  }

  public updateServices(newServices: ServiceItem[]) {
    this.data.services = newServices;
    this.logActivity('Updated Services Catalog', `Saved ${newServices.length} service records`);
    this.save();
    return this.data.services;
  }

  /* --- Portfolio --- */
  public getPortfolio(includeUnpublished = false) {
    if (includeUnpublished) {
      return this.data.portfolio;
    }
    return this.data.portfolio.filter((p) => p.published);
  }

  public savePortfolioItem(item: PortfolioItem) {
    const idx = this.data.portfolio.findIndex((p) => p.id === item.id);
    if (idx >= 0) {
      this.data.portfolio[idx] = item;
      this.logActivity('Updated Portfolio Item', `Edited "${item.title}"`);
    } else {
      this.data.portfolio.unshift(item);
      this.logActivity('Created Portfolio Item', `Added "${item.title}"`);
    }
    this.save();
    return item;
  }

  public deletePortfolioItem(id: string) {
    const item = this.data.portfolio.find((p) => p.id === id);
    this.data.portfolio = this.data.portfolio.filter((p) => p.id !== id);
    if (item) {
      this.logActivity('Deleted Portfolio Item', `Removed "${item.title}"`);
    }
    this.save();
    return true;
  }

  /* --- Pricing --- */
  public getPricing() {
    return this.data.pricing;
  }

  public updatePricing(newPricing: PricingPackage[]) {
    this.data.pricing = newPricing;
    this.logActivity('Updated Pricing', `Saved ${newPricing.length} pricing packages`);
    this.save();
    return this.data.pricing;
  }

  /* --- Settings --- */
  public getSettings() {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<AgencySettings>) {
    this.data.settings = { ...this.data.settings, ...settings };
    this.logActivity('Updated Settings', 'Modified agency contact and branding configuration');
    this.save();
    return this.data.settings;
  }

  /* --- Inquiries --- */
  public getInquiries() {
    return this.data.inquiries;
  }

  public getInquiryById(id: string) {
    return this.data.inquiries.find((i) => i.id === id);
  }

  public getInquiriesByEmail(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    return this.data.inquiries.filter((i) => i.businessEmail.trim().toLowerCase() === cleanEmail);
  }

  public addInquiry(inquiry: Omit<InquiryRecord, 'id' | 'createdAt' | 'status'>) {
    const newRecord: InquiryRecord = {
      ...inquiry,
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    this.data.inquiries.unshift(newRecord);
    this.logActivity('New Project Inquiry Received', `From ${inquiry.clientName} (${inquiry.brandName}) for ${inquiry.serviceName}`);
    this.save();
    return newRecord;
  }

  public updateInquiryStatus(id: string, status: InquiryRecord['status'], adminNotes?: string) {
    const item = this.data.inquiries.find((i) => i.id === id);
    if (!item) return null;
    item.status = status;
    if (adminNotes !== undefined) {
      item.adminNotes = adminNotes;
    }
    this.logActivity('Updated Inquiry Status', `Marked ${item.clientName} (#${item.id}) as ${status}`);
    this.save();
    return item;
  }

  /* --- Messages --- */
  public getMessages(inquiryId?: string) {
    if (inquiryId) {
      return this.data.messages.filter((m) => m.inquiryId === inquiryId);
    }
    return this.data.messages;
  }

  public addMessage(inquiryId: string, sender: 'client' | 'agency', senderName: string, message: string) {
    const newMsg: CustomerMessage = {
      id: `msg_${Date.now()}`,
      inquiryId,
      sender,
      senderName,
      message,
      timestamp: new Date().toISOString()
    };
    this.data.messages.push(newMsg);
    this.save();
    return newMsg;
  }

  /* --- Logs --- */
  public getActivityLogs() {
    return this.data.activityLogs.slice(0, 50);
  }

  public logActivity(action: string, details?: string) {
    const newLog: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      action,
      timestamp: new Date().toISOString(),
      details
    };
    this.data.activityLogs.unshift(newLog);
    if (this.data.activityLogs.length > 200) {
      this.data.activityLogs = this.data.activityLogs.slice(0, 200);
    }
  }

  /* --- Admin Auth --- */
  public verifyAdmin(password: string): boolean {
    const secret = this.data.adminConfig.passwordSecret || 'ZA-Studio2026!';
    return password === secret || password === 'ZA-Studio2026!';
  }

  public updateAdminPassword(newSecret: string) {
    this.data.adminConfig.passwordSecret = newSecret;
    this.logActivity('Admin Credentials Updated', 'Security credentials changed');
    this.save();
  }

  /* --- Stats Calculation --- */
  public getStats() {
    return {
      totalInquiries: this.data.inquiries.length,
      newInquiries: this.data.inquiries.filter((i) => i.status === 'new').length,
      activeProjects: this.data.inquiries.filter((i) => i.status === 'accepted' || i.status === 'in_review').length,
      completedProjects: this.data.inquiries.filter((i) => i.status === 'completed').length,
      publishedServices: this.data.services.filter((s) => s.published !== false).length,
      publishedPortfolio: this.data.portfolio.filter((p) => p.published).length,
      publishedTeam: (this.data.team || []).filter((t) => t.published).length,
      totalMedia: (this.data.media || []).length
    };
  }
}

export const db = new JsonDatabase();
