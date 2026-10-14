import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client strictly on server side
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export type AiToolType =
  | 'business-description'
  | 'social-caption'
  | 'brand-names'
  | 'website-planner'
  | 'video-script'
  | 'project-brief'
  | 'content-calendar';

interface ToolInput {
  toolType: AiToolType;
  prompt: string;
  industry?: string;
  targetAudience?: string;
  tone?: string;
  platform?: string;
}

// Fallback high-quality structured templates when offline or API key pending
export function getTemplateFallback(input: ToolInput): string {
  const { toolType, prompt, industry = 'Creative & Digital', tone = 'Modern & Authoritative' } = input;
  switch (toolType) {
    case 'business-description':
      return `### Executive Overview: ${prompt}\n\n**Mission Statement**\nDelivering high-caliber solutions at the intersection of creative craftsmanship and digital precision for ${industry}.\n\n**Core Value Proposition**\nWe empower forward-thinking clients to establish authoritative brand presence, convert qualified leads, and scale their vision with zero friction.\n\n**Strategic Pillars**\n1. Purpose-Driven Identity & Brand Positioning\n2. High-Performance Digital Platforms\n3. Scalable Systems Engineered for Global Impact\n\n*(Template Mode: Configure GEMINI_API_KEY in server environment for custom generative outputs)*`;

    case 'social-caption':
      return `### High-Engagement Social Content Batch\n\n**Option 1 (Hook & Story)**\n"Most brands fail because they blend in. Distinctive visual systems don't just look better—they build immediate trust."\n\nWhat is your brand saying before you even speak?\n\n**Option 2 (Direct Value)**\n3 things separating standard digital projects from global authority:\n1. Seamless responsiveness\n2. Intentional typography\n3. Clear, zero-fluff conversion funnels\n\n**Actionable Hook**\nReady to transform your vision? Explore our services at ZA DIGITAL STUDIO.\n\n#DigitalStrategy #CreativeAgency #BrandIdentity #WebDevelopment #GlobalImpact`;

    case 'brand-names':
      return `### Brand Name Architecture & Concepts for: "${prompt}"\n\n1. **Vanguard Craft** — *Positioning:* Authoritative, high-end, bespoke engineering.\n2. **Aura Digital** — *Positioning:* Modern, luminescent, future-ready.\n3. **Kinetics Studio** — *Positioning:* Momentum, energy, rapid execution.\n4. **Nexus Point** — *Positioning:* Central intelligence, high connectivity.\n5. **Veritas Creative** — *Positioning:* Trust, authenticity, measurable impact.\n\n**Tagline Suggestions:**\n- "Precision Meets Vision."\n- "Engineered for Global Impact."\n\n*(Template Mode: Configure GEMINI_API_KEY in server environment for custom generative outputs)*`;

    case 'website-planner':
      return `### Strategic Website Architecture & Content Plan: ${prompt}\n\n**1. Primary Viewport (Hero)**\n- **Headline:** Clear, outcome-focused statement of value.\n- **Subtext:** 2-sentence explanation of who you serve and what makes your approach irreplaceable.\n- **Primary CTA:** Single-line high-intent button ("Start a Project" / "Schedule Consultation").\n\n**2. Core Capabilities & Bento Grid**\n- 3 Marquee service cards with quantified deliverables and turnaround timelines.\n- Asymmetric visual anchor featuring sample case study proof.\n\n**3. Social Proof & Case Studies**\n- 2 In-depth projects highlighting challenges, deliverables, and measurable outcomes.\n\n**4. Transparent Engagement & FAQ**\n- Scoped pricing packages with explicit inclusion and exclusion boundaries.\n\n**5. Frictionless Inbound Capture**\n- Multi-step inquiry form collecting budget, timeline, and requirements.`;

    case 'video-script':
      return `### 30-Second Commercial Video Script: ${prompt}\n\n**[0:00 - 0:05] HOOK**\n*Visual:* Rapid dynamic cut between high-contrast typography and digital design mockups.\n*Voiceover:* "Your ideas deserve more than standard templates. They deserve an identity that commands attention."\n\n**[0:05 - 0:18] VALUE DELIVERY**\n*Visual:* Sleek showcase of responsive layouts, branding stationery, and automated digital flows.\n*Voiceover:* "At ZA DIGITAL STUDIO, we bridge world-class design, clean web engineering, and intelligent tools to give your brand a global voice."\n\n**[0:18 - 0:30] CALL TO ACTION**\n*Visual:* Clean logo lockup with bright yellow glow on black basalt backdrop.\n*Voiceover:* "Your vision. Our creativity. Global impact. Visit zadigital.studio today."\n*On-Screen Text:* [Start Your Project Today · Link in Bio]`;

    case 'project-brief':
      return `### Structured Agency Project Brief\n\n**Project Title:** ${prompt}\n**Industry Context:** ${industry}\n**Tone & Aesthetic:** ${tone}\n\n**1. Business Objective**\nEstablish a distinguished digital presence and streamline customer inquiries with modern web design.\n\n**2. Target Audience**\nEntrepreneurs, growing businesses, and international partners seeking high quality and clear deliverables.\n\n**3. Required Deliverables**\n- Visual brand guidelines & assets\n- High-performance responsive website\n- Inquiry qualification workflow\n\n**4. Timeline & Milestones**\n- Discovery & Wireframing: Week 1\n- Design & Identity: Week 2\n- Development & Verification: Week 3\n- Launch & Optimization: Week 4`;

    case 'content-calendar':
      return `### 4-Week Strategic Content Calendar: ${prompt}\n\n**Week 1: Brand Authority & Origin**\n- *Mon:* Founder perspective on design precision & agency standards.\n- *Wed:* Behind the scenes: Deconstructing a modern vector brand system.\n- *Fri:* Case study preview & client outcome breakdown.\n\n**Week 2: Educational Value & Industry Insights**\n- *Tue:* 3 critical conversion bottlenecks on standard B2B websites.\n- *Thu:* How AI workflows accelerate creative production without losing human craft.\n- *Sat:* Quick typography checklist for modern startups.\n\n**Week 3: Showcase & Social Proof**\n- *Mon:* Interactive portfolio highlight & deliverable teardown.\n- *Wed:* Client brief walkthrough: from concept to production.\n- *Fri:* Q&A: Answering frequent project turnaround questions.\n\n**Week 4: Direct Conversion & Community**\n- *Tue:* Open slots for next month's brand architecture sprints.\n- *Thu:* Final call to action: Structured project intake breakdown.\n- *Sun:* Monthly retrospective & creative inspiration recap.`;

    default:
      return `Custom Output for: ${prompt}`;
  }
}

// In-memory rate limiter per IP: max 25 generations per 10 minutes
const ipCallCounts: Map<string, { count: number; resetAt: number }> = new Map();

export function checkRateLimit(clientIp: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxLimit = 25;

  const entry = ipCallCounts.get(clientIp);
  if (!entry || now > entry.resetAt) {
    ipCallCounts.set(clientIp, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxLimit - 1 };
  }

  if (entry.count >= maxLimit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxLimit - entry.count };
}

export async function runAiTool(input: ToolInput): Promise<{
  text: string;
  isAiGenerated: boolean;
  modelUsed?: string;
  notice?: string;
}> {
  const ai = getAiClient();
  if (!ai) {
    return {
      text: getTemplateFallback(input),
      isAiGenerated: false,
      notice: 'Server GEMINI_API_KEY is in sandbox template mode. A professionally crafted structured agency template was provided.'
    };
  }

  const { toolType, prompt, industry = 'Digital Business', targetAudience = 'Global Clients', tone = 'Professional, Modern & Creative', platform = 'Cross-platform' } = input;

  let systemInstruction = 'You are the senior digital strategist and creative copywriter for ZA DIGITAL STUDIO (an international creative agency founded by Zohaib Ali). Output structured, compelling, professional text formatted with clean markdown headings and bullet points. Never use emojis excessively. Maintain an authoritative, modern tone. No generic filler.';
  let promptText = '';

  switch (toolType) {
    case 'business-description':
      promptText = `Generate a compelling, professional business description and executive summary for: "${prompt}".\nIndustry: ${industry}.\nTarget Audience: ${targetAudience}.\nTone: ${tone}.\nInclude: One-line hook, mission statement, core value pillars, and what sets them apart internationally.`;
      break;
    case 'social-caption':
      promptText = `Generate 3 high-converting social media caption variations for: "${prompt}".\nPlatform: ${platform}.\nTone: ${tone}.\nTarget Audience: ${targetAudience}.\nInclude: Attention-grabbing first line hook, core value body, actionable question/CTA, and 4-6 clean relevant hashtags.`;
      break;
    case 'brand-names':
      promptText = `Generate 6 distinctive, memorable brand name ideas with conceptual rationale for: "${prompt}".\nIndustry: ${industry}.\nTone: ${tone}.\nFor each name, provide: The Name, Linguistic/Visual Rationale, Brand Persona, and an accompanying Tagline.`;
      break;
    case 'website-planner':
      promptText = `Develop a detailed page structure and content roadmap for a website about: "${prompt}".\nIndustry: ${industry}.\nInclude: Suggested primary page architecture, Hero section headline & subtext proposal, 3 core benefit sections, key conversion hooks, and recommended user journey.`;
      break;
    case 'video-script':
      promptText = `Write a cinematic, structured 30-to-45-second commercial video script for: "${prompt}".\nTone: ${tone}.\nTarget Audience: ${targetAudience}.\nInclude exact timestamp cues ([0:00-0:05], etc.), visual scene directions, voiceover script, and on-screen text overlays.`;
      break;
    case 'project-brief':
      promptText = `Generate an agency-grade, structured project brief for: "${prompt}".\nIndustry: ${industry}.\nInclude: Background & Objectives, Scope & Target Deliverables, Audience Persona, Visual Aesthetic Tone, and Expected Key Milestones.`;
      break;
    case 'content-calendar':
      promptText = `Develop a comprehensive 4-week multi-channel content calendar for: "${prompt}".\nIndustry: ${industry}.\nTarget Audience: ${targetAudience}.\nTone: ${tone}.\nProvide weekly themes, daily post concept directions, content pillars, and conversion hooks.`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const outputText = response.text || '';
    if (!outputText) {
      throw new Error('Empty response received from AI model');
    }

    return {
      text: outputText,
      isAiGenerated: true,
      modelUsed: 'gemini-3.8-flash'
    };
  } catch (err: any) {
    console.error('Gemini generation error, falling back to template:', err);
    return {
      text: getTemplateFallback(input),
      isAiGenerated: false,
      notice: `AI service temporarily unavailable (${err.message || 'API error'}). High-quality agency template fallback provided.`
    };
  }
}
