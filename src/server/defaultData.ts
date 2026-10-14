import {
  ServiceItem,
  PortfolioItem,
  PricingPackage,
  AgencySettings,
  InquiryRecord,
  MediaItem,
  TeamMember
} from '../types';

export const initialMedia: MediaItem[] = [
  {
    id: 'med_founder_zohaib',
    filename: 'founder_zohaib_ali_1791996673369.jpg',
    originalName: 'Zohaib Ali - Founder & Creative Director Portrait',
    url: '/src/assets/images/founder_zohaib_ali_1791996673369.jpg',
    mimeType: 'image/jpeg',
    size: 290000,
    dimensions: { width: 1024, height: 1024 },
    altText: 'Zohaib Ali, Founder & Creative Director of ZA DIGITAL STUDIO',
    category: 'founder',
    createdAt: '2026-10-14T09:00:00Z'
  },
  {
    id: 'med_agency_logo',
    filename: 'agency_logo_brandmark_1791996688384.jpg',
    originalName: 'ZA Digital Studio Geometric Emblem Logo',
    url: '/src/assets/images/agency_logo_brandmark_1791996688384.jpg',
    mimeType: 'image/jpeg',
    size: 280000,
    dimensions: { width: 1024, height: 1024 },
    altText: 'ZA DIGITAL STUDIO Luxury Monogram Brandmark',
    category: 'logo',
    createdAt: '2026-10-14T09:00:00Z'
  },
  {
    id: 'med_hero_studio',
    filename: 'hero_digital_studio_1791906979659.jpg',
    originalName: 'ZA Digital Studio Workspace',
    url: '/src/assets/images/hero_digital_studio_1791906979659.jpg',
    mimeType: 'image/jpeg',
    size: 245000,
    dimensions: { width: 1920, height: 1080 },
    altText: 'ZA DIGITAL STUDIO Creative & Technology Workspace',
    category: 'hero',
    createdAt: '2026-10-14T09:00:00Z'
  },
  {
    id: 'med_studio_interior',
    filename: 'about_studio_interior_1791996705527.jpg',
    originalName: 'ZA Digital Studio Architectural Interior',
    url: '/src/assets/images/about_studio_interior_1791996705527.jpg',
    mimeType: 'image/jpeg',
    size: 340000,
    dimensions: { width: 1920, height: 1080 },
    altText: 'ZA DIGITAL STUDIO Collaborative Agency Studio Space',
    category: 'general',
    createdAt: '2026-10-14T09:00:00Z'
  },
  {
    id: 'med_career_showcase',
    filename: 'career_services_showcase_1791996729619.jpg',
    originalName: 'Executive Career Branding & CV Suite',
    url: '/src/assets/images/career_services_showcase_1791996729619.jpg',
    mimeType: 'image/jpeg',
    size: 310000,
    dimensions: { width: 1400, height: 1050 },
    altText: 'Executive CV and Personal Branding Identity Suite',
    category: 'service',
    createdAt: '2026-10-14T09:00:00Z'
  },
  {
    id: 'med_branding_craft',
    filename: 'service_branding_craft_1791995785465.jpg',
    originalName: 'Branding Stationery Craft',
    url: '/src/assets/images/service_branding_craft_1791995785465.jpg',
    mimeType: 'image/jpeg',
    size: 310000,
    dimensions: { width: 1400, height: 1050 },
    altText: 'Bespoke Brand Identity & Stationery Craft',
    category: 'service',
    createdAt: '2026-10-14T09:00:00Z'
  },
  {
    id: 'med_web_interface',
    filename: 'service_web_interface_1791995786512.jpg',
    originalName: 'Modern Web Interface',
    url: '/src/assets/images/service_web_interface_1791995786512.jpg',
    mimeType: 'image/jpeg',
    size: 320000,
    dimensions: { width: 1400, height: 1050 },
    altText: 'High-Performance Web Platforms & Dashboards',
    category: 'web' as any,
    createdAt: '2026-10-14T09:00:00Z'
  },
  {
    id: 'med_ai_automation',
    filename: 'service_ai_automation_1791995786577.jpg',
    originalName: 'AI Workflows & Neural Routing',
    url: '/src/assets/images/service_ai_automation_1791995786577.jpg',
    mimeType: 'image/jpeg',
    size: 340000,
    dimensions: { width: 1400, height: 1050 },
    altText: 'Intelligent AI Automation & Lead Routing Systems',
    category: 'service',
    createdAt: '2026-10-14T09:00:00Z'
  },
  {
    id: 'med_aether_brand',
    filename: 'portfolio_branding_showcase_1791906979435.jpg',
    originalName: 'Aether Studio Identity System',
    url: '/src/assets/images/portfolio_branding_showcase_1791906979435.jpg',
    mimeType: 'image/jpeg',
    size: 280000,
    dimensions: { width: 1400, height: 1050 },
    altText: 'Aether Studio Minimalist Stationery & Brand Manual',
    category: 'portfolio',
    createdAt: '2026-10-14T09:00:00Z'
  },
  {
    id: 'med_lumina_ai',
    filename: 'ai_creative_visual_1791906979412.jpg',
    originalName: 'Lumina Kinetic Brand Visuals',
    url: '/src/assets/images/ai_creative_visual_1791906979412.jpg',
    mimeType: 'image/jpeg',
    size: 295000,
    dimensions: { width: 1400, height: 1050 },
    altText: 'Dynamic 3D Golden Light and Carbon Fiber Ribbons',
    category: 'portfolio',
    createdAt: '2026-10-14T09:00:00Z'
  }
];

export const initialTeam: TeamMember[] = [
  {
    id: 'team_founder_zohaib',
    name: 'Zohaib Ali',
    role: 'Founder / CEO',
    jobTitle: 'Founder & Creative Director',
    department: 'Leadership',
    biography: 'Zohaib Ali is the founder and creative director of ZA DIGITAL STUDIO. With an international background spanning high-end brand architecture, full-stack digital development, and generative AI workflows, Zohaib leads client projects with uncompromising standards of aesthetic precision and technical performance.',
    skills: [
      'Brand Architecture & Visual Systems',
      'Modern Full-Stack Web Development',
      'AI Integration & Generative Workflows',
      'UI/UX & Interactive Design',
      'Strategic Creative Direction'
    ],
    photograph: '/src/assets/images/founder_zohaib_ali_1791996673369.jpg',
    linkedinUrl: 'https://linkedin.com/in/zohaib-ali',
    portfolioUrl: 'https://zohaib-ali-portfolio-digital-studio.ai.studio/',
    published: true,
    displayOrder: 1,
    isFounder: true,
    createdAt: '2026-10-14T09:00:00Z'
  }
];

export const initialServices: ServiceItem[] = [
  // A. Branding and Graphic Design
  {
    id: 'logo-brand-identity',
    category: 'branding',
    categoryLabel: 'Branding & Design',
    title: 'Logo & Brand Identity Architecture',
    description: 'Distinctive, memorable visual identities crafted for international reach and long-term recognition.',
    deliverables: ['Primary & secondary vector logos', 'Color palette & contrast ratios', 'Typography guidelines', 'Brand book PDF', 'All vector & export formats (SVG, PNG, EPS)'],
    turnaround: '4–7 business days',
    startingPriceUsd: 149,
    currency: 'USD',
    revisionPolicy: '2 structured revision allowance rounds included',
    status: 'available',
    icon: 'Palette',
    image: '/src/assets/images/service_branding_craft_1791995785465.jpg',
    featured: true,
    published: true,
    displayOrder: 1
  },
  {
    id: 'stationery-business-cards',
    category: 'branding',
    categoryLabel: 'Branding & Design',
    title: 'Business Stationery & Print Media',
    description: 'High-end tactile cards, letterheads, invoice templates, and marketing posters ready for print.',
    deliverables: ['Print-ready CMYK files with bleed', 'Luxury spot-UV / embossing guides', 'Digital stationery templates', 'Source design files'],
    turnaround: '3–5 business days',
    startingPriceUsd: 79,
    currency: 'USD',
    revisionPolicy: '1 revision round included',
    status: 'available',
    icon: 'CreditCard',
    image: '/src/assets/images/portfolio_branding_showcase_1791906979435.jpg',
    published: true,
    displayOrder: 2
  },
  {
    id: 'social-marketing-posters',
    category: 'branding',
    categoryLabel: 'Branding & Design',
    title: 'Social Media Graphics & Advertising Posters',
    description: 'High-impact promotional graphics engineered for digital ads, Instagram grids, and event posters.',
    deliverables: ['10–20 high-resolution feed assets', 'Story & vertical reel covers', 'Ad creative variations', 'Figma / editable templates'],
    turnaround: '3–4 business days',
    startingPriceUsd: 99,
    currency: 'USD',
    revisionPolicy: '1 revision round included',
    status: 'available',
    icon: 'Layers',
    image: '/src/assets/images/ai_creative_visual_1791906979412.jpg',
    published: true,
    displayOrder: 3
  },
  {
    id: 'presentation-design',
    category: 'branding',
    categoryLabel: 'Branding & Design',
    title: 'Pitch Deck & Presentation Design',
    description: 'Persuasive, clean pitch decks and corporate presentations that impress investors and partners.',
    deliverables: ['Custom slide master deck', 'Infographics and chart layouts', 'Keynote / PPTX / PDF exports', 'Interactive transitions'],
    turnaround: '4–6 business days',
    startingPriceUsd: 129,
    currency: 'USD',
    revisionPolicy: '2 revision rounds included',
    status: 'available',
    icon: 'Presentation',
    image: '/src/assets/images/portfolio_web_showcase_1791906980434.jpg',
    published: true,
    displayOrder: 4
  },

  // B. Website Design and Development
  {
    id: 'business-websites',
    category: 'web',
    categoryLabel: 'Web Development',
    title: 'Modern Business & Corporate Websites',
    description: 'Fast, secure, responsive web platforms built with modern tech stacks to establish global authority.',
    deliverables: ['Multi-page responsive architecture', 'Semantic accessibility & SEO metadata', 'CMS / inquiry integration', 'Performance score 95+'],
    turnaround: '10–14 business days',
    startingPriceUsd: 399,
    currency: 'USD',
    revisionPolicy: 'Milestone reviews & 2 feedback cycles',
    status: 'available',
    icon: 'Globe',
    image: '/src/assets/images/service_web_interface_1791995786512.jpg',
    featured: true,
    published: true,
    displayOrder: 5
  },
  {
    id: 'high-converting-landing-pages',
    category: 'web',
    categoryLabel: 'Web Development',
    title: 'Conversion-Focused Landing Pages',
    description: 'Single-page conversion funnels engineered to transform cold visitors into qualified inquiries.',
    deliverables: ['1440px desktop + mobile responsive', 'Interactive contact & lead capture', 'Analytics & speed optimization', 'Zero-friction UX layout'],
    turnaround: '5–7 business days',
    startingPriceUsd: 249,
    currency: 'USD',
    revisionPolicy: '2 revision rounds included',
    status: 'available',
    icon: 'Zap',
    image: '/src/assets/images/portfolio_web_showcase_1791906980434.jpg',
    published: true,
    displayOrder: 6
  },
  {
    id: 'portfolio-websites',
    category: 'web',
    categoryLabel: 'Web Development',
    title: 'Creative & Personal Portfolio Websites',
    description: 'Showcase your creative work, achievements, and case studies with smooth interactive design.',
    deliverables: ['Curated project gallery & filters', 'Rich modal / case study views', 'Contact system & resume viewer', 'Domain & deployment setup'],
    turnaround: '6–8 business days',
    startingPriceUsd: 219,
    currency: 'USD',
    revisionPolicy: '2 revision rounds included',
    status: 'available',
    icon: 'Layout',
    image: '/src/assets/images/hero_digital_studio_1791906979659.jpg',
    published: true,
    displayOrder: 7
  },
  {
    id: 'ecommerce-stores',
    category: 'web',
    categoryLabel: 'Web Development',
    title: 'Boutique Online Stores & E-Commerce',
    description: 'Modern storefronts for artisanal brands, digital product sellers, and niche retailers.',
    deliverables: ['Product catalog & shopping cart', 'Secure checkout flow setup', 'Inventory & order management', 'Mobile-first optimization'],
    turnaround: '14–21 business days',
    startingPriceUsd: 499,
    currency: 'USD',
    revisionPolicy: 'Milestone reviews & 2 revision cycles',
    status: 'available',
    icon: 'ShoppingBag',
    image: '/src/assets/images/service_web_interface_1791995786512.jpg',
    published: true,
    displayOrder: 8
  },
  {
    id: 'website-redesign-maintenance',
    category: 'web',
    categoryLabel: 'Web Development',
    title: 'Website Redesign & Maintenance',
    description: 'Modernize outdated layouts, fix responsiveness issues, and upgrade site security and speed.',
    deliverables: ['Complete UI/UX refresh', 'Code refactoring & Core Web Vitals audit', 'Mobile usability overhaul', 'Security & backup review'],
    turnaround: '5–9 business days',
    startingPriceUsd: 199,
    currency: 'USD',
    revisionPolicy: '1 comprehensive overhaul cycle',
    status: 'available',
    icon: 'RefreshCw',
    image: '/src/assets/images/hero_digital_studio_1791906979659.jpg',
    published: true,
    displayOrder: 9
  },

  // C. AI-Assisted Creative Content
  {
    id: 'promotional-video-concepts',
    category: 'ai-content',
    categoryLabel: 'AI Content Creation',
    title: 'AI-Assisted Promotional Video Concepts & Scripts',
    description: 'AI-assisted concept ideation, scene-by-scene screenplays, and voiceover scripting for digital campaigns.',
    deliverables: ['Full commercial storyboard script', 'Hook, body & CTA framework', 'Audio/visual cue directions', '3 variations for A/B testing'],
    turnaround: '2–3 business days',
    startingPriceUsd: 79,
    currency: 'USD',
    revisionPolicy: '2 script refinement rounds',
    status: 'available',
    icon: 'Video',
    image: '/src/assets/images/ai_creative_visual_1791906979412.jpg',
    featured: true,
    published: true,
    displayOrder: 10
  },
  {
    id: 'social-video-production',
    category: 'ai-content',
    categoryLabel: 'AI Content Creation',
    title: 'Short-Form Video Production & Reels',
    description: 'Dynamic vertical videos tailored for TikTok, Instagram Reels, and YouTube Shorts.',
    deliverables: ['Custom captions & motion text', 'Curated pacing & sound design', '1080x1920 high-bitrate MP4s', 'Engaging thumbnail covers'],
    turnaround: '3–5 business days',
    startingPriceUsd: 119,
    currency: 'USD',
    revisionPolicy: '1 round of timing / text adjustments',
    status: 'available',
    icon: 'Film',
    image: '/src/assets/images/ai_creative_visual_1791906979412.jpg',
    published: true,
    displayOrder: 11
  },
  {
    id: 'ai-content-planning',
    category: 'ai-content',
    categoryLabel: 'AI Content Creation',
    title: 'Content Planning & Editorial Calendars',
    description: 'Data-driven monthly content schedules, caption batches, and hashtag clusters for cross-platform presence.',
    deliverables: ['30-day cross-platform content roadmap', 'Post copy & caption variations', 'Call-to-action hooks', 'Performance tracking sheet'],
    turnaround: '3–4 business days',
    startingPriceUsd: 89,
    currency: 'USD',
    revisionPolicy: '1 calendar realignment round',
    status: 'available',
    icon: 'FileText',
    image: '/src/assets/images/service_ai_automation_1791995786577.jpg',
    published: true,
    displayOrder: 12
  },

  // D. Digital Career Services
  {
    id: 'cv-resume-design',
    category: 'career',
    categoryLabel: 'Digital Career Services',
    title: 'CV Design & ATS Architecture',
    description: 'Sleek, ATS-friendly professional resumes designed to position candidates for international roles.',
    deliverables: ['ATS-optimized structured PDF', 'Editable source document', 'Matching cover letter template', 'Targeted role keyword alignment'],
    turnaround: '2–3 business days',
    startingPriceUsd: 49,
    currency: 'USD',
    revisionPolicy: '1 revision round',
    status: 'available',
    icon: 'Award',
    image: '/src/assets/images/portfolio_branding_showcase_1791906979435.jpg',
    published: true,
    displayOrder: 13
  },
  {
    id: 'creator-channel-graphics',
    category: 'career',
    categoryLabel: 'Digital Career Services',
    title: 'Personal Branding & Creator Channel Graphics',
    description: 'Cohesive branding kit for YouTube creators, podcasters, and online instructors.',
    deliverables: ['YouTube/Twitch banner set', 'High-CTR thumbnail templates', 'Stream overlays & end screens', 'Profile iconography kit'],
    turnaround: '3–5 business days',
    startingPriceUsd: 69,
    currency: 'USD',
    revisionPolicy: '1 revision round',
    status: 'available',
    icon: 'Sparkles',
    image: '/src/assets/images/service_branding_craft_1791995785465.jpg',
    published: true,
    displayOrder: 14
  },

  // E. AI Automation (Marked available vs Coming Soon transparently)
  {
    id: 'inquiry-lead-automation',
    category: 'automation',
    categoryLabel: 'AI & Automation',
    title: 'Customer Inquiry Workflows & Lead Routers',
    description: 'Interactive qualification forms that route validated client inquiries directly into email and management spreadsheets.',
    deliverables: ['Multi-step qualification logic', 'Instant email confirmation trigger', 'Spam protection & webhook setup', 'Client response notification'],
    turnaround: '4–6 business days',
    startingPriceUsd: 189,
    currency: 'USD',
    revisionPolicy: 'Complete testing & handoff support',
    status: 'available',
    icon: 'Cpu',
    image: '/src/assets/images/service_ai_automation_1791995786577.jpg',
    featured: true,
    published: true,
    displayOrder: 15
  },
  {
    id: 'workflow-appointment-automation',
    category: 'automation',
    categoryLabel: 'AI & Automation',
    title: 'Appointment Request & Productivity Workflows',
    description: 'Multi-app pipeline connecting your CRM, calendars, and customer communications.',
    deliverables: ['Automated pipeline handoffs', 'Meeting booking synchronization', 'Custom reminder sequences', 'Error monitoring & logs'],
    turnaround: '7–10 business days',
    startingPriceUsd: 299,
    currency: 'USD',
    revisionPolicy: 'Testing & configuration period',
    status: 'coming-soon',
    icon: 'GitFork',
    image: '/src/assets/images/service_ai_automation_1791995786577.jpg',
    published: true,
    displayOrder: 16
  },
  {
    id: 'ai-customer-support-workflows',
    category: 'automation',
    categoryLabel: 'AI & Automation',
    title: 'Autonomous Business Process Automation',
    description: 'AI-grounded ticket triaging, automated FAQ responders, and intelligent escalation matrices.',
    deliverables: ['Custom knowledge-base setup', 'Response accuracy guardrails', 'Escalation to human workflow', 'Performance telemetry review'],
    turnaround: 'Coming soon',
    startingPriceUsd: 499,
    currency: 'USD',
    revisionPolicy: 'Under active development',
    status: 'coming-soon',
    icon: 'Bot',
    image: '/src/assets/images/service_ai_automation_1791995786577.jpg',
    published: true,
    displayOrder: 17
  }
];

export const initialPortfolio: PortfolioItem[] = [
  {
    id: 'aether-brand-system',
    title: 'Aether Studio Identity & Visual System',
    category: 'Branding',
    image: '/src/assets/images/portfolio_branding_showcase_1791906979435.jpg',
    galleryImages: [
      '/src/assets/images/portfolio_branding_showcase_1791906979435.jpg',
      '/src/assets/images/service_branding_craft_1791995785465.jpg'
    ],
    description: 'Comprehensive brand identity and tactile stationery system engineered for an international architectural studio.',
    tools: ['Figma', 'Adobe Illustrator', 'Photoshop', 'Brand Architecture'],
    objective: 'Create an authoritative, timeless identity system using high-contrast black basalt and energetic yellow typography.',
    deliverables: ['Vector Logo Suite', 'Stationery & Business Cards', 'Typography Guidelines', 'Comprehensive Brand Guidelines Manual'],
    demoUrl: 'https://zohaib-ali-portfolio-digital-studio.ai.studio/',
    caseStudyText: 'The Aether project addressed the challenge of building an architectural brand that feels rooted in stone craftsmanship while maintaining modern digital versatility.',
    isSampleWork: true,
    published: true,
    featured: true,
    displayOrder: 1
  },
  {
    id: 'pixel-flow-saas-platform',
    title: 'PixelFlow Agency Platform & Dashboard',
    category: 'Websites',
    image: '/src/assets/images/portfolio_web_showcase_1791906980434.jpg',
    galleryImages: [
      '/src/assets/images/portfolio_web_showcase_1791906980434.jpg',
      '/src/assets/images/service_web_interface_1791995786512.jpg'
    ],
    description: 'High-performance web portal and client dashboard featuring project tracking, team workspaces, and dark mode interface.',
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Express'],
    objective: 'Engineer a responsive, high-speed portal with seamless dark/light styling and intuitive client management.',
    deliverables: ['Responsive Web App', 'Interactive Client Portal', 'Status Tracking System', 'SEO Architecture'],
    demoUrl: 'https://zohaib-ali-portfolio-digital-studio.ai.studio/',
    caseStudyText: 'Engineered with sub-100ms response targets and persistent data storage, PixelFlow eliminates operational bottlenecks between client requests and development status.',
    isSampleWork: true,
    published: true,
    featured: true,
    displayOrder: 2
  },
  {
    id: 'lumina-kinetic-creatives',
    title: 'Lumina Kinetic Brand & AI Visuals',
    category: 'AI Content',
    image: '/src/assets/images/ai_creative_visual_1791906979412.jpg',
    galleryImages: [
      '/src/assets/images/ai_creative_visual_1791906979412.jpg',
      '/src/assets/images/service_ai_automation_1791995786577.jpg'
    ],
    description: 'AI-assisted dynamic creative suite and 3D visual storytelling assets for a global tech launch campaign.',
    tools: ['Gemini AI', 'Adobe After Effects', 'Cinema 4D', 'Motion Graphics'],
    objective: 'Demonstrate cutting-edge golden geometric ribbon aesthetics to visualize AI transformation and creative flow.',
    deliverables: ['Promo Video Visual Concepts', 'High-Bitrate Social Creatives', 'Campaign Key Visuals', 'Story & Reel Motion Templates'],
    demoUrl: 'https://zohaib-ali-portfolio-digital-studio.ai.studio/',
    caseStudyText: 'Produced using hybrid human art direction and generative AI exploration, delivering cinematic visuals with 70% faster turnaround.',
    isSampleWork: true,
    published: true,
    featured: true,
    displayOrder: 3
  },
  {
    id: 'za-digital-workspace',
    title: 'ZA Digital Studio Collaborative Hub',
    category: 'UI/UX',
    image: '/src/assets/images/hero_digital_studio_1791906979659.jpg',
    galleryImages: [
      '/src/assets/images/hero_digital_studio_1791906979659.jpg',
      '/src/assets/images/service_web_interface_1791995786512.jpg'
    ],
    description: 'Spatial and digital design conceptualization for modern hybrid creative studios with multi-screen project workstations.',
    tools: ['Figma', '3D Architectural Staging', 'Design Systems'],
    objective: 'Establish a futuristic yet practical creative studio environment uniting human design craft and AI-assisted workflows.',
    deliverables: ['Studio Design Guidelines', 'Multi-Display Dashboard Layouts', 'Ergonomic Workspace Layout'],
    demoUrl: 'https://zohaib-ali-portfolio-digital-studio.ai.studio/',
    caseStudyText: 'An interactive design study examining how physical creative suites and high-density multi-display setups foster rapid software and design iteration.',
    isSampleWork: true,
    published: true,
    featured: false,
    displayOrder: 4
  }
];

export const initialPricing: PricingPackage[] = [
  {
    id: 'starter-design',
    name: 'Starter Design',
    subtitle: 'Essential visual presence for social media and marketing campaigns',
    priceUsd: 149,
    currency: 'USD',
    turnaroundDays: '3–5 business days',
    revisionPolicy: '1 clearly specified revision allowance round',
    popular: false,
    published: true,
    includes: [
      'Defined set of 8 custom social media graphics',
      'One clearly specified revision allowance round',
      'Final agreed formats: High-res PNG, JPG & editable source files',
      'Color palette alignment with brand guidelines',
      'Direct communication channel with designer'
    ],
    excludes: [
      'Full brand identity system or logo redesign',
      'Video production or motion graphics',
      'Website coding or hosting'
    ]
  },
  {
    id: 'brand-starter',
    name: 'Brand Starter',
    subtitle: 'Complete foundational identity for new businesses and startups',
    priceUsd: 299,
    currency: 'USD',
    turnaroundDays: '5–8 business days',
    revisionPolicy: '2 distinct concept directions & 2 revision rounds',
    popular: true,
    published: true,
    includes: [
      '2 distinct logo concept directions to choose from',
      'Finalized primary logo with vertical & horizontal lockups',
      'Curated brand color palette (HEX, RGB, CMYK)',
      'Typography pairing & hierarchy guidelines',
      'Basic brand asset pack (favicons, social avatars, letterhead)',
      'Vector master files (SVG, EPS, PDF, high-res PNG)'
    ],
    excludes: [
      'Full stationery print production runs',
      'Custom web design & development',
      'Complex 3D rendering'
    ]
  },
  {
    id: 'website-starter',
    name: 'Website Starter',
    subtitle: 'High-impact, conversion-focused landing page or portfolio',
    priceUsd: 499,
    currency: 'USD',
    turnaroundDays: '7–12 business days',
    revisionPolicy: '2 comprehensive feedback rounds',
    popular: false,
    published: true,
    includes: [
      'Clearly scoped landing page or portfolio layout',
      'Responsive design tested across desktop, tablet, and mobile',
      'Interactive project inquiry or contact form',
      'Basic search-engine metadata (SEO) & OpenGraph cards',
      'Performance-optimized speed & clean semantic code',
      '14 days of post-launch technical support'
    ],
    excludes: [
      'Custom multi-vendor e-commerce or marketplace backend',
      'Paid third-party API subscription costs',
      'Ongoing monthly retainer maintenance'
    ]
  },
  {
    id: 'ai-content-package',
    name: 'AI Content Package',
    subtitle: 'Promotional scripts, social media batches, and campaign assets',
    priceUsd: 349,
    currency: 'USD',
    turnaroundDays: '4–6 business days',
    revisionPolicy: '2 rounds of copy & script adjustments',
    popular: false,
    published: true,
    includes: [
      '3 Commercial video scripts with scene-by-scene visual cues',
      '20 High-converting social media caption sets & hashtags',
      '5 Dynamic short-form video concept storyboards',
      'Brand voice guidelines and reusable prompt templates',
      'Content calendar roadmap for 30 days'
    ],
    excludes: [
      'Full live video shooting on location',
      'High-end 3D VFX rendering'
    ]
  },
  {
    id: 'custom-project',
    name: 'Custom Project',
    subtitle: 'Tailored enterprise platforms, AI workflows, and multi-service packages',
    priceUsd: 899,
    currency: 'USD',
    isCustomQuote: true,
    turnaroundDays: 'Scoped per project',
    revisionPolicy: 'Custom milestone reviews per contract SLA',
    popular: false,
    published: true,
    includes: [
      'Multi-page web applications or custom digital portals',
      'AI creative content pipelines & short-form video suites',
      'Custom workflow automation & CRM lead routing',
      'Dedicated milestone reviews & project management',
      'Priority turnaround schedule and custom SLAs'
    ],
    excludes: [
      'Undefined scope creep beyond agreed project brief'
    ]
  }
];

export const initialSettings: AgencySettings = {
  founderName: 'Zohaib Ali',
  brandName: 'ZA DIGITAL STUDIO',
  tagline: 'Your Vision. Our Creativity. Global Impact.',
  heroHeadline: 'Transform Your Ideas Into Digital Experiences.',
  heroSubtext: 'ZA DIGITAL STUDIO combines creative design, modern web development, and AI-assisted digital solutions to help businesses build their online presence.',
  heroButtonPrimary: 'Start Your Project',
  heroButtonSecondary: 'Explore Services',
  heroButtonTertiary: 'View Our Work',
  heroImage: '/src/assets/images/hero_digital_studio_1791906979659.jpg',
  websiteLogo: '/src/assets/images/agency_logo_brandmark_1791996688384.jpg',
  founderImage: '/src/assets/images/founder_zohaib_ali_1791996673369.jpg',
  founderTitle: 'Founder & Creative Director',
  founderBio: 'Zohaib Ali is the visionary founder and creative director of ZA DIGITAL STUDIO. With an international background spanning high-end brand architecture, full-stack digital development, and generative AI workflows, Zohaib leads client projects with uncompromising standards of aesthetic precision and technical performance.',
  founderPhilosophy: 'We believe exceptional digital products are born at the intersection of artisanal design taste and intelligent engineering. Technology must elevate human creativity, not replace it.',
  founderGoals: 'To empower visionary entrepreneurs, growing brands, and creators across global markets with digital platforms that command authority and drive measurable impact.',
  founderSkills: [
    'Brand Architecture & Visual Systems',
    'Modern Full-Stack Web Development',
    'AI Integration & Generative Workflows',
    'UI/UX & Interactive Design',
    'Strategic Creative Direction'
  ],
  ctaHeadline: "Have an Idea? Let's Build It.",
  ctaButtonText: 'Start Your Project',
  existingPortfolioUrl: 'https://zohaib-ali-portfolio-digital-studio.ai.studio/',
  businessEmail: 'zohaibalioffical12@gmail.com',
  messagingLink: 'https://wa.me/923000000000',
  linkedinUrl: 'https://linkedin.com/in/zohaib-ali',
  instagramUrl: 'https://instagram.com/zadigitalstudio',
  facebookUrl: 'https://facebook.com/zadigitalstudio',
  behanceUrl: 'https://behance.net/zohaib-ali'
};
