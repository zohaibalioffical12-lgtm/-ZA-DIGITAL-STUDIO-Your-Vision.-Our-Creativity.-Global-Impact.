import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { db } from './src/server/db';
import { runAiTool, checkRateLimit, AiToolType } from './src/server/gemini';
import { MediaItem } from './src/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Support JSON payload up to 15MB for image uploads
app.use(express.json({ limit: '15mb' }));

const DATA_UPLOADS_DIR = path.resolve(process.cwd(), 'data', 'uploads');
if (!fs.existsSync(DATA_UPLOADS_DIR)) {
  fs.mkdirSync(DATA_UPLOADS_DIR, { recursive: true });
}

// Serve uploaded media persistently
app.use('/api/uploads', express.static(DATA_UPLOADS_DIR));

// Bearer authentication verification helper
function verifyAdminAuth(req: Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const expectedSecret = process.env.ADMIN_PASSWORD || 'ZA-Studio2026!';
  return token === expectedSecret || token === 'admin-session-token-za2026';
}

/* ========================================================
   API ROUTES
   ======================================================== */

// 1. Health check & status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'ZA DIGITAL STUDIO',
    time: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY')
  });
});

// 2. Real calculated dashboard statistics
app.get('/api/stats', (req: Request, res: Response) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  try {
    const stats = db.getStats();
    res.json({ success: true, stats });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Media Library & Persistent Image Uploads
app.get('/api/media', (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const media = db.getMedia(category);
    res.json({ success: true, media });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/media/upload', (req: Request, res: Response) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized. Admin permissions required to upload media.' });
  }

  try {
    const { base64Data, filename, category = 'general', altText = '', dimensions } = req.body;

    if (!base64Data || typeof base64Data !== 'string') {
      return res.status(400).json({ error: 'Missing image data.' });
    }

    // Parse base64 header (e.g. data:image/png;base64,....)
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 image encoding format.' });
    }

    const mimeType = matches[1].toLowerCase();
    const allowedMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMime.includes(mimeType)) {
      return res.status(400).json({
        error: `Unsupported image format (${mimeType}). Only JPG, PNG, and WebP are allowed.`
      });
    }

    const buffer = Buffer.from(matches[2], 'base64');
    const maxSize = 10 * 1024 * 1024; // 10 MB limit
    if (buffer.length > maxSize) {
      return res.status(400).json({
        error: `File size exceeds 10MB limit. Current size: ${(buffer.length / (1024 * 1024)).toFixed(1)}MB.`
      });
    }

    // Determine extension
    let ext = '.jpg';
    if (mimeType.includes('png')) ext = '.png';
    else if (mimeType.includes('webp')) ext = '.webp';

    const safeBaseName = (filename || 'upload').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const uniqueFilename = `${safeBaseName}_${Date.now()}${ext}`;
    const destinationPath = path.join(DATA_UPLOADS_DIR, uniqueFilename);

    // Save persistently to disk
    fs.writeFileSync(destinationPath, buffer);

    const publicUrl = `/api/uploads/${uniqueFilename}`;

    const newMediaItem: MediaItem = {
      id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      filename: uniqueFilename,
      originalName: filename || uniqueFilename,
      url: publicUrl,
      mimeType,
      size: buffer.length,
      dimensions: dimensions || { width: 1200, height: 800 },
      altText: altText || filename || 'ZA DIGITAL STUDIO Media',
      category: category as any,
      createdAt: new Date().toISOString()
    };

    const saved = db.saveMediaItem(newMediaItem);

    res.status(201).json({
      success: true,
      item: saved,
      message: 'Image uploaded and saved persistently.'
    });
  } catch (err: any) {
    console.error('Upload failure:', err);
    res.status(500).json({ error: err.message || 'Image upload failed.' });
  }
});

app.delete('/api/media/:id', (req: Request, res: Response) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  try {
    const success = db.deleteMediaItem(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Media record not found.' });
    }
    res.json({ success: true, message: 'Media asset deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Team & Staff Management
app.get('/api/team', (req: Request, res: Response) => {
  try {
    const includeUnpublished = req.query.all === 'true' && verifyAdminAuth(req);
    const team = db.getTeam(includeUnpublished);
    res.json({ success: true, team });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/team', (req: Request, res: Response) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }
  try {
    const member = req.body;
    if (!member.name || !member.jobTitle) {
      return res.status(400).json({ error: 'Name and Job Title are required.' });
    }
    const saved = db.saveTeamMember(member);
    res.json({ success: true, member: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/team/:id', (req: Request, res: Response) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }
  try {
    const deleted = db.deleteTeamMember(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Team member not found.' });
    }
    res.json({ success: true, message: 'Team profile deleted.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Services
app.get('/api/services', (req: Request, res: Response) => {
  try {
    const includeUnpublished = req.query.all === 'true' && verifyAdminAuth(req);
    const services = db.getServices(includeUnpublished);
    res.json({ success: true, services });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/services', (req: Request, res: Response) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }
  try {
    const service = req.body;
    if (!service.title || !service.category) {
      return res.status(400).json({ error: 'Title and Category are required.' });
    }
    const saved = db.saveServiceItem(service);
    res.json({ success: true, service: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/services', (req: Request, res: Response) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }
  try {
    const updated = db.updateServices(req.body.services);
    res.json({ success: true, services: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/services/:id', (req: Request, res: Response) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  try {
    db.deleteServiceItem(req.params.id);
    res.json({ success: true, message: 'Service removed.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Portfolio
app.get('/api/portfolio', (req: Request, res: Response) => {
  try {
    const includeUnpublished = req.query.all === 'true' && verifyAdminAuth(req);
    const portfolio = db.getPortfolio(includeUnpublished);
    res.json({ success: true, portfolio });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/portfolio', (req: Request, res: Response) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }
  try {
    const item = req.body;
    if (!item.title || !item.category) {
      return res.status(400).json({ error: 'Title and Category are required.' });
    }
    const saved = db.savePortfolioItem(item);
    res.json({ success: true, item: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/portfolio/:id', (req: Request, res: Response) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }
  try {
    db.deletePortfolioItem(req.params.id);
    res.json({ success: true, message: 'Portfolio item deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Pricing
app.get('/api/pricing', (req: Request, res: Response) => {
  try {
    const pricing = db.getPricing();
    res.json({ success: true, pricing });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/pricing', (req: Request, res: Response) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }
  try {
    const updated = db.updatePricing(req.body.pricing);
    res.json({ success: true, pricing: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Agency Settings
app.get('/api/settings', (req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, settings });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', (req: Request, res: Response) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Inquiries (Start a Project & Contact form submission)
app.post('/api/inquiries', (req: Request, res: Response) => {
  try {
    const {
      clientName,
      businessEmail,
      brandName,
      country,
      serviceId,
      serviceName,
      budgetRangeUsd,
      desiredDeadline,
      projectDescription,
      referenceLinks,
      attachmentUrl,
      privacyConsent
    } = req.body;

    if (!clientName || !clientName.trim()) {
      return res.status(400).json({ error: 'Client name is required.' });
    }
    if (!businessEmail || !businessEmail.includes('@') || !businessEmail.includes('.')) {
      return res.status(400).json({ error: 'A valid business email address is required.' });
    }
    if (!projectDescription || projectDescription.trim().length < 10) {
      return res.status(400).json({ error: 'Project description must be at least 10 characters.' });
    }
    if (!privacyConsent) {
      return res.status(400).json({ error: 'Consent to the privacy policy is required before submission.' });
    }

    const saved = db.addInquiry({
      clientName: clientName.trim(),
      businessEmail: businessEmail.trim().toLowerCase(),
      brandName: (brandName || clientName).trim(),
      country: (country || 'International').trim(),
      serviceId: serviceId || 'custom-inquiry',
      serviceName: serviceName || 'General Project Consultation',
      budgetRangeUsd: budgetRangeUsd || 'Undecided',
      desiredDeadline: desiredDeadline || 'Flexible',
      projectDescription: projectDescription.trim(),
      referenceLinks: referenceLinks || '',
      attachmentUrl: attachmentUrl || '',
      privacyConsent: true
    });

    res.status(201).json({
      success: true,
      inquiry: saved,
      message: 'Project inquiry successfully registered in ZA DIGITAL STUDIO system.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/inquiries', (req: Request, res: Response) => {
  const emailQuery = req.query.email as string | undefined;

  if (emailQuery) {
    const list = db.getInquiriesByEmail(emailQuery);
    return res.json({ success: true, inquiries: list });
  }

  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required to list all records.' });
  }

  const all = db.getInquiries();
  res.json({ success: true, inquiries: all });
});

app.patch('/api/inquiries/:id', (req: Request, res: Response) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }
  const { status, adminNotes } = req.body;
  const updated = db.updateInquiryStatus(req.params.id, status, adminNotes);
  if (!updated) {
    return res.status(404).json({ error: 'Inquiry record not found.' });
  }
  res.json({ success: true, inquiry: updated });
});

// 10. Inquiry conversation messages
app.get('/api/inquiries/:id/messages', (req: Request, res: Response) => {
  const inquiry = db.getInquiryById(req.params.id);
  if (!inquiry) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }

  const clientEmail = (req.query.email as string || '').toLowerCase();
  const isAdmin = verifyAdminAuth(req);

  if (!isAdmin && clientEmail !== inquiry.businessEmail.toLowerCase()) {
    return res.status(403).json({ error: 'Forbidden. You do not have permission to view messages for this project.' });
  }

  const messages = db.getMessages(req.params.id);
  res.json({ success: true, messages });
});

app.post('/api/inquiries/:id/messages', (req: Request, res: Response) => {
  const inquiry = db.getInquiryById(req.params.id);
  if (!inquiry) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }

  const { message, senderName, clientEmail } = req.body;
  const isAdmin = verifyAdminAuth(req);

  if (!isAdmin && (!clientEmail || clientEmail.toLowerCase() !== inquiry.businessEmail.toLowerCase())) {
    return res.status(403).json({ error: 'Forbidden. Unauthorized to post to this inquiry.' });
  }

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  const newMsg = db.addMessage(
    req.params.id,
    isAdmin ? 'agency' : 'client',
    senderName || (isAdmin ? 'ZA DIGITAL STUDIO' : inquiry.clientName),
    message.trim()
  );

  res.status(201).json({ success: true, message: newMsg });
});

// 11. Authentication
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { role, email, password } = req.body;

  if (role === 'admin') {
    const isValid = db.verifyAdmin(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid administrator credentials' });
    }
    return res.json({
      success: true,
      token: 'admin-session-token-za2026',
      role: 'super_admin',
      user: {
        email: email || 'zohaibalioffical12@gmail.com',
        name: 'Zohaib Ali (Founder & CEO)'
      }
    });
  }

  if (role === 'customer') {
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid business email is required.' });
    }
    const customerInquiries = db.getInquiriesByEmail(email);
    if (customerInquiries.length === 0) {
      return res.status(404).json({
        error: 'No active project inquiry found for this email address. Please submit a project inquiry first.'
      });
    }

    return res.json({
      success: true,
      token: `client-session-${Buffer.from(email).toString('base64')}`,
      role: 'customer',
      user: {
        email: email.toLowerCase(),
        name: customerInquiries[0].clientName,
        brandName: customerInquiries[0].brandName,
        projectsCount: customerInquiries.length
      }
    });
  }

  res.status(400).json({ error: 'Invalid authentication role' });
});

app.post('/api/auth/change-password', (req: Request, res: Response) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }
  db.updateAdminPassword(newPassword);
  res.json({ success: true, message: 'Admin password updated successfully.' });
});

app.get('/api/admin/logs', (req: Request, res: Response) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  res.json({ success: true, logs: db.getActivityLogs() });
});

// 12. AI Tools Hub (All 7 Tools Supported)
app.post('/api/gemini/generate', async (req: Request, res: Response) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: 'Rate limit reached for AI tools. Please wait a few moments before requesting another generation.'
      });
    }

    const { toolType, prompt, industry, targetAudience, tone, platform } = req.body;
    if (!toolType || !prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'toolType and prompt are required.' });
    }

    const validTools: AiToolType[] = [
      'business-description',
      'social-caption',
      'brand-names',
      'website-planner',
      'video-script',
      'project-brief',
      'content-calendar'
    ];

    if (!validTools.includes(toolType)) {
      return res.status(400).json({ error: `Invalid toolType. Allowed: ${validTools.join(', ')}` });
    }

    const result = await runAiTool({
      toolType,
      prompt: prompt.trim(),
      industry,
      targetAudience,
      tone,
      platform
    });

    res.json({
      success: true,
      result: result.text,
      isAiGenerated: result.isAiGenerated,
      modelUsed: result.modelUsed,
      notice: result.notice,
      remaining: rateCheck.remaining
    });
  } catch (err: any) {
    console.error('Server error in /api/gemini/generate:', err);
    res.status(500).json({ error: err.message || 'Server error running AI tool.' });
  }
});

/* ========================================================
   VITE DEV MIDDLEWARE / STATIC ASSETS
   ======================================================== */

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZA DIGITAL STUDIO server running on port ${PORT} [${isProduction ? 'Production' : 'Development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
