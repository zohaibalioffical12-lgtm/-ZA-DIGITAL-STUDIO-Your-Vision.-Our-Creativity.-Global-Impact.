import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  InquiryRecord,
  ServiceItem,
  PortfolioItem,
  PricingPackage,
  AgencySettings,
  ActivityLog,
  MediaItem,
  TeamMember
} from '../types';
import {
  Lock,
  LogOut,
  FolderKanban,
  Layers,
  DollarSign,
  Briefcase,
  Settings,
  Shield,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  Search,
  Image as ImageIcon,
  Users,
  Layout,
  Upload,
  Crop,
  Copy,
  Check,
  Eye,
  KeyRound
} from 'lucide-react';
import { MediaSelectModal } from '../components/MediaSelectModal';

export const AdminPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { isAdmin, adminLogin, adminLogout, getAuthHeaders, adminUser } = useAuth();

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Active Sidebar Module
  type AdminModule =
    | 'overview'
    | 'website_editor'
    | 'media'
    | 'services'
    | 'portfolio'
    | 'team'
    | 'pricing'
    | 'inquiries'
    | 'messages'
    | 'settings';
  const [activeModule, setActiveModule] = useState<AdminModule>('overview');

  // Loaded Data
  const [stats, setStats] = useState<any>(null);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [pricing, setPricing] = useState<PricingPackage[]>([]);
  const [settings, setSettings] = useState<AgencySettings | null>(null);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [teamList, setTeamList] = useState<TeamMember[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const [loadingData, setLoadingData] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Inquiries management
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [editingInquiryStatus, setEditingInquiryStatus] = useState<InquiryRecord['status']>('new');
  const [editingInquiryNotes, setEditingInquiryNotes] = useState('');
  const [searchInquiryQuery, setSearchInquiryQuery] = useState('');
  const [replyText, setReplyText] = useState('');

  // Media Picker Dialog State
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{
    open: boolean;
    currentUrl?: string;
    category?: any;
    label: string;
    onSelected: (url: string) => void;
  } | null>(null);

  // Team Member Form
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);

  // Service Edit Form
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Portfolio Item Form
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<PortfolioItem | null>(null);

  // Security Password Change Form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch all admin data
  const fetchAllData = async () => {
    if (!isAdmin) return;
    setLoadingData(true);
    const headers = getAuthHeaders();

    try {
      const [resStats, resInq, resServ, resPort, resPric, resSett, resMedia, resTeam, resLogs] = await Promise.all([
        fetch('/api/stats', { headers }).then((r) => r.json()).catch(() => ({})),
        fetch('/api/inquiries', { headers }).then((r) => r.json()).catch(() => ({})),
        fetch('/api/services?all=true', { headers }).then((r) => r.json()).catch(() => ({})),
        fetch('/api/portfolio?all=true', { headers }).then((r) => r.json()).catch(() => ({})),
        fetch('/api/pricing').then((r) => r.json()).catch(() => ({})),
        fetch('/api/settings').then((r) => r.json()).catch(() => ({})),
        fetch('/api/media').then((r) => r.json()).catch(() => ({})),
        fetch('/api/team?all=true', { headers }).then((r) => r.json()).catch(() => ({})),
        fetch('/api/admin/logs', { headers }).then((r) => r.json()).catch(() => ({})),
      ]);

      if (resStats.stats) setStats(resStats.stats);
      if (resInq.inquiries) setInquiries(resInq.inquiries);
      if (resServ.services) setServices(resServ.services);
      if (resPort.portfolio) setPortfolio(resPort.portfolio);
      if (resPric.pricing) setPricing(resPric.pricing);
      if (resSett.settings) setSettings(resSett.settings);
      if (resMedia.media) setMediaList(resMedia.media);
      if (resTeam.team) setTeamList(resTeam.team);
      if (resLogs.logs) setActivityLogs(resLogs.logs);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);

    const res = await adminLogin(passwordInput);
    setLoggingIn(false);

    if (!res.success) {
      setLoginError(res.error || 'Authentication rejected by security policy.');
    } else {
      setPasswordInput('');
    }
  };

  // Inquiry update
  const handleUpdateInquiry = async () => {
    if (!selectedInquiry) return;
    try {
      const res = await fetch(`/api/inquiries/${selectedInquiry.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: editingInquiryStatus,
          adminNotes: editingInquiryNotes
        })
      });
      const data = await res.json();
      if (data.success && data.inquiry) {
        setInquiries((prev) => prev.map((i) => (i.id === data.inquiry.id ? data.inquiry : i)));
        setSelectedInquiry(data.inquiry);
        showFeedback('success', `Updated inquiry #${data.inquiry.id}`);
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to update inquiry');
    }
  };

  // Inquiry Reply Message
  const handleSendReply = async () => {
    if (!selectedInquiry || !replyText.trim()) return;
    try {
      const res = await fetch(`/api/inquiries/${selectedInquiry.id}/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          sender: 'agency',
          senderName: 'Zohaib Ali (ZA DIGITAL STUDIO)',
          message: replyText.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setReplyText('');
        showFeedback('success', 'Reply delivered to client conversation.');
      }
    } catch (err: any) {
      showFeedback('error', 'Failed to send message');
    }
  };

  // Website Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        showFeedback('success', 'Website settings, hero content, and founder details saved.');
      }
    } catch (err: any) {
      showFeedback('error', 'Failed to update settings');
    }
  };

  // Team Member Save
  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamMember) return;
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(editingTeamMember)
      });
      const data = await res.json();
      if (data.success && data.member) {
        setTeamList((prev) => {
          const idx = prev.findIndex((t) => t.id === data.member.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = data.member;
            return next;
          }
          return [...prev, data.member];
        });
        setEditingTeamMember(null);
        showFeedback('success', `Saved profile for "${data.member.name}".`);
      }
    } catch (err: any) {
      showFeedback('error', 'Failed to save team member profile');
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team member profile?')) return;
    try {
      const res = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setTeamList((prev) => prev.filter((t) => t.id !== id));
        showFeedback('success', 'Team profile deleted.');
      }
    } catch {
      showFeedback('error', 'Failed to delete team member');
    }
  };

  // Media Delete
  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.id !== id));
        showFeedback('success', 'Media asset removed.');
      }
    } catch {
      showFeedback('error', 'Failed to delete media asset');
    }
  };

  // Service Save
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(editingService)
      });
      const data = await res.json();
      if (data.success && data.service) {
        setServices((prev) => {
          const idx = prev.findIndex((s) => s.id === data.service.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = data.service;
            return next;
          }
          return [...prev, data.service];
        });
        setEditingService(null);
        showFeedback('success', `Service "${data.service.title}" saved.`);
      }
    } catch (err: any) {
      showFeedback('error', 'Failed to save service');
    }
  };

  // Portfolio Save
  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPortfolioItem) return;
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(editingPortfolioItem)
      });
      const data = await res.json();
      if (data.success && data.item) {
        setPortfolio((prev) => {
          const idx = prev.findIndex((p) => p.id === data.item.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = data.item;
            return next;
          }
          return [data.item, ...prev];
        });
        setEditingPortfolioItem(null);
        showFeedback('success', `Case study "${data.item.title}" saved.`);
      }
    } catch (err: any) {
      showFeedback('error', 'Failed to save case study');
    }
  };

  // Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showFeedback('error', 'Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      showFeedback('error', 'Password must be at least 8 characters.');
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setNewPassword('');
        setConfirmPassword('');
        showFeedback('success', 'Admin master password updated securely.');
      } else {
        showFeedback('error', data.error || 'Failed to update password');
      }
    } catch {
      showFeedback('error', 'Connection error');
    }
  };

  // Export JSON Backup
  const handleExportRecords = () => {
    const backup = {
      exportTime: new Date().toISOString(),
      stats,
      inquiries,
      services,
      portfolio,
      pricing,
      settings,
      mediaList,
      teamList,
      activityLogs
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `za_digital_studio_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ========================================================
     UNAUTHENTICATED: OWNER SIGN-IN SCREEN
     ======================================================== */
  if (!isAdmin) {
    return (
      <div className="w-full py-20 max-w-md mx-auto px-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center mx-auto text-yellow-500">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
              Studio Owner Sign-In
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Protected administrative console for Zohaib Ali (ZA DIGITAL STUDIO).
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Administrator Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter master password"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Default security passkey: <code className="font-mono text-yellow-600 dark:text-yellow-400">ZA-Studio2026!</code>
              </span>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loggingIn ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Authorizing Session...</span>
                </>
              ) : (
                <span>Access Admin Console</span>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
            <button onClick={() => onNavigate('/')} className="hover:underline">
              &larr; Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================
     AUTHENTICATED ADMIN WORKSPACE WITH SIDEBAR
     ======================================================== */
  const sidebarItems: { id: AdminModule; label: string; icon: any; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'website_editor', label: 'Website Content', icon: Edit },
    { id: 'media', label: 'Media & Images', icon: ImageIcon, count: mediaList.length },
    { id: 'services', label: 'Services Catalog', icon: Layers, count: services.length },
    { id: 'portfolio', label: 'Portfolio Projects', icon: Briefcase, count: portfolio.length },
    { id: 'team', label: 'Team & Staff', icon: Users, count: teamList.length },
    { id: 'pricing', label: 'Pricing Packages', icon: DollarSign, count: pricing.length },
    { id: 'inquiries', label: 'Project Inquiries', icon: FolderKanban, count: inquiries.length },
    { id: 'settings', label: 'Settings & Security', icon: Settings }
  ];

  const filteredInquiries = inquiries.filter((inq) => {
    if (!searchInquiryQuery.trim()) return true;
    const q = searchInquiryQuery.toLowerCase();
    return (
      inq.clientName.toLowerCase().includes(q) ||
      inq.businessEmail.toLowerCase().includes(q) ||
      inq.brandName.toLowerCase().includes(q) ||
      inq.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-yellow-500">
            <Shield className="w-4 h-4" />
            <span>ZA DIGITAL STUDIO &middot; Administrative Console</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
            Studio Management System
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportRecords}
            className="px-3.5 py-1.5 text-xs font-semibold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Export Backup JSON
          </button>
          <button
            onClick={adminLogout}
            className="px-3.5 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div
          className={`mb-6 p-3.5 rounded-lg text-xs flex items-center gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200'
              : 'bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300 border border-red-200'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Main Layout: Left Sidebar + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 space-y-1 bg-white dark:bg-zinc-900 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-yellow-400 text-black font-bold shadow-sm'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-black/20 text-black' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Right Content Workspace */}
        <div className="lg:col-span-9 space-y-6">
          {/* ========================================================
              MODULE 1: OVERVIEW (REAL STATS)
              ======================================================== */}
          {activeModule === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-xs font-mono text-zinc-400 block mb-1">Total Inquiries</span>
                  <span className="font-mono text-3xl font-extrabold text-zinc-900 dark:text-white tabular-nums">
                    {stats?.totalInquiries ?? inquiries.length}
                  </span>
                </div>
                <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-xs font-mono text-amber-500 block mb-1">New Review</span>
                  <span className="font-mono text-3xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                    {stats?.newInquiries ?? inquiries.filter((i) => i.status === 'new').length}
                  </span>
                </div>
                <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-xs font-mono text-emerald-500 block mb-1">Active Projects</span>
                  <span className="font-mono text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {stats?.activeProjects ?? 0}
                  </span>
                </div>
                <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-xs font-mono text-yellow-500 block mb-1">Media Assets</span>
                  <span className="font-mono text-3xl font-extrabold text-zinc-900 dark:text-white tabular-nums">
                    {mediaList.length}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <h3 className="font-display text-base font-bold text-zinc-900 dark:text-white mb-3">
                  Quick Management Shortcuts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <button
                    onClick={() => setActiveModule('website_editor')}
                    className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-left hover:border-yellow-400"
                  >
                    <span className="font-bold block mb-1">Edit Homepage &amp; Hero</span>
                    <span className="text-zinc-500">Change headlines, hero image, and CTA text</span>
                  </button>
                  <button
                    onClick={() => setActiveModule('media')}
                    className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-left hover:border-yellow-400"
                  >
                    <span className="font-bold block mb-1">Upload New Media</span>
                    <span className="text-zinc-500">Upload, crop, and replace photos</span>
                  </button>
                  <button
                    onClick={() => setActiveModule('team')}
                    className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-left hover:border-yellow-400"
                  >
                    <span className="font-bold block mb-1">Founder &amp; Staff Profiles</span>
                    <span className="text-zinc-500">Update Zohaib Ali's bio and add team members</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity Logs */}
              <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <h3 className="font-display text-base font-bold text-zinc-900 dark:text-white mb-3">
                  System Audit Logs
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto text-xs font-mono">
                  {activityLogs.slice(0, 8).map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-zinc-900 dark:text-white mr-2">{log.action}:</span>
                        <span className="text-zinc-500">{log.details}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MODULE 2: WEBSITE CONTENT & HERO EDITOR
              ======================================================== */}
          {activeModule === 'website_editor' && settings && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white">
                  Website Content &amp; Hero Section Editor
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Changes made here update the public homepage and about sections in real-time.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
                {/* Brand Logo & Website Emblem */}
                <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <h4 className="font-display text-sm font-bold text-zinc-900 dark:text-white flex items-center justify-between">
                    <span>Website Logo &amp; Brand Emblem</span>
                    <span className="text-[10px] font-mono text-yellow-500 uppercase">Global Header &amp; Footer</span>
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Upload or crop your custom agency logo. If empty, the sleek geometric text-mark is displayed.
                  </p>
                  <div className="flex items-center gap-4">
                    {settings.websiteLogo ? (
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 ring-2 ring-yellow-400/40">
                        <img
                          src={settings.websiteLogo}
                          alt="Brand Logo Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0 flex items-center justify-center font-bold text-yellow-400 font-display text-lg">
                        ZA
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setMediaPickerConfig({
                            open: true,
                            currentUrl: settings.websiteLogo,
                            category: 'logo',
                            label: 'Website Logo & Brand Emblem',
                            onSelected: (url) => setSettings({ ...settings, websiteLogo: url })
                          })
                        }
                        className="px-4 py-2 text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 rounded flex items-center gap-1.5 shadow-sm"
                      >
                        <Crop className="w-3.5 h-3.5" />
                        <span>Upload / Crop Logo Emblem</span>
                      </button>
                      {settings.websiteLogo && (
                        <button
                          type="button"
                          onClick={() => setSettings({ ...settings, websiteLogo: '' })}
                          className="px-3 py-2 text-xs font-semibold rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300"
                        >
                          Reset to Monogram
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hero Section */}
                <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <h4 className="font-display text-sm font-bold text-zinc-900 dark:text-white">
                    Homepage Hero Section
                  </h4>

                  <div>
                    <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                      Hero Headline
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.heroHeadline}
                      onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                      Hero Supporting Subtext
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={settings.heroSubtext}
                      onChange={(e) => setSettings({ ...settings, heroSubtext: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>

                  {/* Hero Image Selection */}
                  <div>
                    <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                      Hero Background Visual Image
                    </label>
                    <div className="flex items-center gap-4">
                      {settings.heroImage && (
                        <div className="w-24 h-16 rounded overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                          <img
                            src={settings.heroImage}
                            alt="Hero preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <button
                          type="button"
                          onClick={() =>
                            setMediaPickerConfig({
                              open: true,
                              currentUrl: settings.heroImage,
                              category: 'hero',
                              label: 'Hero Background Visual',
                              onSelected: (url) => setSettings({ ...settings, heroImage: url })
                            })
                          }
                          className="px-4 py-2 text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 rounded flex items-center gap-1.5"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Choose / Upload Hero Image</span>
                        </button>
                        <span className="text-[10px] text-zinc-400 block mt-1">
                          Current URL: <code className="font-mono">{settings.heroImage}</code>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hero Button Labels */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-zinc-500 mb-1">Primary CTA Button</label>
                      <input
                        type="text"
                        value={settings.heroButtonPrimary}
                        onChange={(e) => setSettings({ ...settings, heroButtonPrimary: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-500 mb-1">Secondary Button</label>
                      <input
                        type="text"
                        value={settings.heroButtonSecondary}
                        onChange={(e) => setSettings({ ...settings, heroButtonSecondary: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-500 mb-1">Tertiary Button</label>
                      <input
                        type="text"
                        value={settings.heroButtonTertiary}
                        onChange={(e) => setSettings({ ...settings, heroButtonTertiary: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Founder Profile Details */}
                <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <h4 className="font-display text-sm font-bold text-zinc-900 dark:text-white">
                    Founder Profile (Zohaib Ali)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                        Founder Name
                      </label>
                      <input
                        type="text"
                        value={settings.founderName}
                        onChange={(e) => setSettings({ ...settings, founderName: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        value={settings.founderTitle}
                        onChange={(e) => setSettings({ ...settings, founderTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>
                  </div>

                  {/* Founder Photograph Upload/Change */}
                  <div>
                    <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                      Founder Photograph
                    </label>
                    <div className="flex items-center gap-4">
                      {settings.founderImage && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                          <img
                            src={settings.founderImage}
                            alt="Founder preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            setMediaPickerConfig({
                              open: true,
                              currentUrl: settings.founderImage,
                              category: 'founder',
                              label: 'Founder Photograph',
                              onSelected: (url) => setSettings({ ...settings, founderImage: url })
                            })
                          }
                          className="px-4 py-2 text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 rounded flex items-center gap-1.5"
                        >
                          <Crop className="w-3.5 h-3.5" />
                          <span>Upload / Crop Founder Picture</span>
                        </button>
                        <span className="text-[10px] text-zinc-400 block mt-1 truncate max-w-sm">
                          {settings.founderImage}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                      Founder Biography
                    </label>
                    <textarea
                      rows={3}
                      value={settings.founderBio}
                      onChange={(e) => setSettings({ ...settings, founderBio: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                      Creative Philosophy
                    </label>
                    <input
                      type="text"
                      value={settings.founderPhilosophy}
                      onChange={(e) => setSettings({ ...settings, founderPhilosophy: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                      Studio Mission &amp; Goals
                    </label>
                    <input
                      type="text"
                      value={settings.founderGoals}
                      onChange={(e) => setSettings({ ...settings, founderGoals: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800"
                    />
                  </div>
                </div>

                {/* Final Call to Action Section */}
                <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <h4 className="font-display text-sm font-bold text-zinc-900 dark:text-white">
                    Homepage Bottom CTA
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                        CTA Headline
                      </label>
                      <input
                        type="text"
                        value={settings.ctaHeadline}
                        onChange={(e) => setSettings({ ...settings, ctaHeadline: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                        CTA Button Label
                      </label>
                      <input
                        type="text"
                        value={settings.ctaButtonText}
                        onChange={(e) => setSettings({ ...settings, ctaButtonText: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded flex items-center gap-1.5 shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Website Content</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================
              MODULE 3: ADVANCED MEDIA & IMAGE MANAGER
              ======================================================== */}
          {activeModule === 'media' && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white">
                    Media &amp; Image Assets Library
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Upload, crop, preview, replace, and manage persistent images across the agency platform.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setMediaPickerConfig({
                      open: true,
                      label: 'General Media Library',
                      onSelected: () => fetchAllData()
                    })
                  }
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload &amp; Crop New Image</span>
                </button>
              </div>

              {/* Media Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mediaList.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-between"
                  >
                    <div className="aspect-[4/3] bg-zinc-900 overflow-hidden relative group">
                      <img
                        src={item.url}
                        alt={item.altText}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] text-yellow-400">
                        {item.category}
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.url);
                            showFeedback('success', 'Image URL copied to clipboard');
                          }}
                          className="p-1.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700"
                          title="Copy Image URL"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMedia(item.id)}
                          className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-500"
                          title="Delete Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 text-xs">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200 block truncate text-[11px]">
                        {item.originalName}
                      </span>
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mt-1">
                        <span>{(item.size / 1024).toFixed(0)} KB</span>
                        <span>{item.dimensions ? `${item.dimensions.width}x${item.dimensions.height}` : ''}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              MODULE 4: SERVICES CATALOG MANAGER
              ======================================================== */}
          {activeModule === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white">
                    Services Catalog ({services.length})
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Add, edit deliverables, upload service imagery, set pricing and toggle status.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingService({
                      id: `serv_${Date.now()}`,
                      category: 'web',
                      categoryLabel: 'Web Development',
                      title: 'New Service Package',
                      description: 'Comprehensive service overview...',
                      deliverables: ['Custom Deliverable 1', 'Custom Deliverable 2'],
                      turnaround: '5–7 business days',
                      startingPriceUsd: 199,
                      status: 'available',
                      icon: 'Zap',
                      published: true,
                      image: '/src/assets/images/service_web_interface_1791995786512.jpg'
                    })
                  }
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Service</span>
                </button>
              </div>

              {/* Service Edit Modal / Inline Form */}
              {editingService && (
                <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg space-y-4 text-xs">
                  <h4 className="font-display text-base font-bold text-zinc-900 dark:text-white">
                    Edit Service Specification
                  </h4>
                  <form onSubmit={handleSaveService} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-1">Service Title</label>
                        <input
                          type="text"
                          required
                          value={editingService.title}
                          onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Category</label>
                        <select
                          value={editingService.category}
                          onChange={(e) => {
                            const cat = e.target.value as any;
                            const labels: Record<string, string> = {
                              branding: 'Branding & Design',
                              web: 'Web Development',
                              'ai-content': 'AI Content Creation',
                              career: 'Digital Career Services',
                              automation: 'AI & Automation'
                            };
                            setEditingService({
                              ...editingService,
                              category: cat,
                              categoryLabel: labels[cat] || cat
                            });
                          }}
                          className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                        >
                          <option value="branding">Branding &amp; Design</option>
                          <option value="web">Web Development</option>
                          <option value="ai-content">AI Content Creation</option>
                          <option value="career">Digital Career Services</option>
                          <option value="automation">AI &amp; Automation</option>
                        </select>
                      </div>
                    </div>

                    {/* Image selector */}
                    <div>
                      <label className="block font-semibold mb-1">Service Visual Image</label>
                      <div className="flex items-center gap-3">
                        {editingService.image && (
                          <div className="w-16 h-12 rounded overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                            <img src={editingService.image} alt="Service" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setMediaPickerConfig({
                              open: true,
                              currentUrl: editingService.image,
                              category: 'service',
                              label: `Service: ${editingService.title}`,
                              onSelected: (url) => setEditingService({ ...editingService, image: url })
                            })
                          }
                          className="px-3 py-1.5 text-xs font-semibold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
                        >
                          Change Service Image
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Description</label>
                      <textarea
                        rows={2}
                        required
                        value={editingService.description}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-semibold mb-1">Starting Price (USD)</label>
                        <input
                          type="number"
                          value={editingService.startingPriceUsd}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              startingPriceUsd: parseFloat(e.target.value) || 0
                            })
                          }
                          className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Turnaround</label>
                        <input
                          type="text"
                          value={editingService.turnaround}
                          onChange={(e) => setEditingService({ ...editingService, turnaround: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Status</label>
                        <select
                          value={editingService.status}
                          onChange={(e) =>
                            setEditingService({ ...editingService, status: e.target.value as any })
                          }
                          className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                        >
                          <option value="available">Available / Active</option>
                          <option value="coming-soon">Coming Soon</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Revision Policy</label>
                      <input
                        type="text"
                        value={editingService.revisionPolicy || ''}
                        onChange={(e) =>
                          setEditingService({ ...editingService, revisionPolicy: e.target.value })
                        }
                        placeholder="e.g. 2 structured feedback rounds included"
                        className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>

                    {/* Service Card Image Selector */}
                    <div>
                      <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                        Service Card Image / Visual
                      </label>
                      <div className="flex items-center gap-4">
                        {editingService.image ? (
                          <div className="w-20 h-14 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0 shadow-sm">
                            <img
                              src={editingService.image}
                              alt={editingService.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-14 rounded-lg bg-zinc-800 border border-zinc-700 shrink-0 flex items-center justify-center text-[10px] text-zinc-500">
                            No image
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setMediaPickerConfig({
                                open: true,
                                currentUrl: editingService.image,
                                category: 'service',
                                label: `Service: ${editingService.title}`,
                                onSelected: (url) => setEditingService({ ...editingService, image: url })
                              })
                            }
                            className="px-3 py-1.5 text-xs font-semibold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 flex items-center gap-1.5"
                          >
                            <Crop className="w-3.5 h-3.5" />
                            <span>Choose / Crop Image</span>
                          </button>
                          {editingService.image && (
                            <button
                              type="button"
                              onClick={() => setEditingService({ ...editingService, image: '' })}
                              className="px-2.5 py-1.5 text-xs font-semibold rounded bg-zinc-200 dark:bg-zinc-800 text-red-500 hover:bg-zinc-300"
                            >
                              Remove Image
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Deliverables (one per line)</label>
                      <textarea
                        rows={3}
                        value={editingService.deliverables.join('\n')}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            deliverables: e.target.value.split('\n').filter(Boolean)
                          })
                        }
                        className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 font-mono text-[11px]"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingService(null)}
                        className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded bg-yellow-400 hover:bg-yellow-300 text-black font-bold"
                      >
                        Save Service
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Services Table */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-mono">
                    <tr>
                      <th className="p-3.5">Service</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Turnaround</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {services.map((serv) => (
                      <tr key={serv.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                        <td className="p-3.5 font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                          {serv.image && (
                            <img src={serv.image} alt="" className="w-7 h-7 rounded object-cover" />
                          )}
                          <span>{serv.title}</span>
                        </td>
                        <td className="p-3.5 text-zinc-500 font-mono">{serv.categoryLabel}</td>
                        <td className="p-3.5 font-mono font-bold">${serv.startingPriceUsd}</td>
                        <td className="p-3.5 text-zinc-500">{serv.turnaround}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              serv.status === 'available'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                            }`}
                          >
                            {serv.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => setEditingService(serv)}
                            className="px-2.5 py-1 text-[11px] rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              MODULE 5: PORTFOLIO & CASE STUDIES MANAGER
              ======================================================== */}
          {activeModule === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white">
                    Portfolio &amp; Case Studies ({portfolio.length})
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Manage project previews, gallery images, deliverables, and live demo links.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingPortfolioItem({
                      id: `proj_${Date.now()}`,
                      title: 'New Case Study Project',
                      category: 'Branding',
                      image: '/src/assets/images/portfolio_branding_showcase_1791906979435.jpg',
                      galleryImages: ['/src/assets/images/portfolio_branding_showcase_1791906979435.jpg'],
                      description: 'Project summary description...',
                      tools: ['Figma', 'React', 'Tailwind CSS'],
                      objective: 'State the client challenge and goal...',
                      deliverables: ['Vector Logo Suite', 'Brand Guidelines'],
                      demoUrl: '',
                      caseStudyText: '',
                      isSampleWork: true,
                      published: true
                    })
                  }
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Portfolio Form */}
              {editingPortfolioItem && (
                <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg space-y-4 text-xs">
                  <h4 className="font-display text-base font-bold text-zinc-900 dark:text-white">
                    Edit Portfolio Item
                  </h4>
                  <form onSubmit={handleSavePortfolio} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-1">Title</label>
                        <input
                          type="text"
                          required
                          value={editingPortfolioItem.title}
                          onChange={(e) =>
                            setEditingPortfolioItem({ ...editingPortfolioItem, title: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Category</label>
                        <select
                          value={editingPortfolioItem.category}
                          onChange={(e) =>
                            setEditingPortfolioItem({ ...editingPortfolioItem, category: e.target.value as any })
                          }
                          className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                        >
                          <option>Branding</option>
                          <option>Graphic Design</option>
                          <option>Websites</option>
                          <option>AI Content</option>
                          <option>UI/UX</option>
                          <option>Automation</option>
                        </select>
                      </div>
                    </div>

                    {/* Image selector */}
                    <div>
                      <label className="block font-semibold mb-1">Project Thumbnail</label>
                      <div className="flex items-center gap-3">
                        {editingPortfolioItem.image && (
                          <div className="w-16 h-12 rounded overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                            <img src={editingPortfolioItem.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setMediaPickerConfig({
                              open: true,
                              currentUrl: editingPortfolioItem.image,
                              category: 'portfolio',
                              label: `Project: ${editingPortfolioItem.title}`,
                              onSelected: (url) => setEditingPortfolioItem({ ...editingPortfolioItem, image: url })
                            })
                          }
                          className="px-3 py-1.5 text-xs font-semibold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
                        >
                          Choose / Crop Thumbnail
                        </button>
                      </div>
                    </div>

                    {/* Gallery Images Selector */}
                    <div>
                      <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                        Portfolio Gallery Images (Expanded Modal &amp; Slideshow)
                      </label>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        {(editingPortfolioItem.galleryImages || []).map((imgUrl, gIdx) => (
                          <div
                            key={gIdx}
                            className="relative w-16 h-12 rounded overflow-hidden bg-zinc-900 border border-zinc-700 group shrink-0"
                          >
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (editingPortfolioItem.galleryImages || []).filter((_, i) => i !== gIdx);
                                setEditingPortfolioItem({ ...editingPortfolioItem, galleryImages: updated });
                              }}
                              className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              title="Remove gallery image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            setMediaPickerConfig({
                              open: true,
                              category: 'portfolio',
                              label: `Add Gallery Asset: ${editingPortfolioItem.title}`,
                              onSelected: (url) => {
                                const current = editingPortfolioItem.galleryImages || [];
                                setEditingPortfolioItem({ ...editingPortfolioItem, galleryImages: [...current, url] });
                              }
                            })
                          }
                          className="px-3 py-2 text-xs font-semibold rounded border border-dashed border-zinc-400 dark:border-zinc-700 hover:border-yellow-400 text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Gallery Image</span>
                        </button>
                      </div>
                      <span className="text-[10px] text-zinc-400 block">
                        Hover an image to remove. Visitors can view full-screen gallery slides in the portfolio detail modal.
                      </span>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Description</label>
                      <textarea
                        rows={2}
                        required
                        value={editingPortfolioItem.description}
                        onChange={(e) =>
                          setEditingPortfolioItem({ ...editingPortfolioItem, description: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Objective</label>
                      <textarea
                        rows={2}
                        required
                        value={editingPortfolioItem.objective}
                        onChange={(e) =>
                          setEditingPortfolioItem({ ...editingPortfolioItem, objective: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-1">Tools (comma separated)</label>
                        <input
                          type="text"
                          value={editingPortfolioItem.tools.join(', ')}
                          onChange={(e) =>
                            setEditingPortfolioItem({
                              ...editingPortfolioItem,
                              tools: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                            })
                          }
                          className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Live Demo URL (Optional)</label>
                        <input
                          type="text"
                          value={editingPortfolioItem.demoUrl || ''}
                          onChange={(e) =>
                            setEditingPortfolioItem({ ...editingPortfolioItem, demoUrl: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPortfolioItem.published}
                          onChange={(e) =>
                            setEditingPortfolioItem({ ...editingPortfolioItem, published: e.target.checked })
                          }
                          className="w-4 h-4 text-yellow-500 rounded"
                        />
                        <span>Published to Gallery</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPortfolioItem.isSampleWork}
                          onChange={(e) =>
                            setEditingPortfolioItem({ ...editingPortfolioItem, isSampleWork: e.target.checked })
                          }
                          className="w-4 h-4 text-yellow-500 rounded"
                        />
                        <span>Marked as Sample Concept Work (Truth in Advertising)</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setEditingPortfolioItem(null)}
                        className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded bg-yellow-400 hover:bg-yellow-300 text-black font-bold"
                      >
                        Save Project
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Projects List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {portfolio.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-zinc-900 mb-3 relative">
                        <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] text-yellow-400">
                          {proj.category}
                        </span>
                      </div>
                      <h4 className="font-display text-sm font-bold text-zinc-900 dark:text-white mb-1">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-zinc-500 line-clamp-2">{proj.description}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-400">
                        {proj.published ? 'Published' : 'Draft'}
                      </span>
                      <div className="space-x-1.5">
                        <button
                          onClick={() => setEditingPortfolioItem(proj)}
                          className="px-2.5 py-1 text-[11px] rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm('Delete this case study?')) return;
                            await fetch(`/api/portfolio/${proj.id}`, {
                              method: 'DELETE',
                              headers: getAuthHeaders()
                            });
                            setPortfolio((prev) => prev.filter((p) => p.id !== proj.id));
                            showFeedback('success', 'Case study deleted.');
                          }}
                          className="px-2.5 py-1 text-[11px] rounded bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              MODULE 6: TEAM, MANAGER & STAFF PROFILES
              ======================================================== */}
          {activeModule === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white">
                    Team, Manager &amp; Administrator Management ({teamList.length})
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Manage founder, manager, designer, developer, and specialist profiles with photograph upload &amp; cropping.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingTeamMember({
                      id: `team_${Date.now()}`,
                      name: 'New Team Member',
                      role: 'Web Developer',
                      jobTitle: 'Senior Full-Stack Engineer',
                      department: 'Engineering',
                      biography: 'Engineering responsive web architectures and high-speed portals...',
                      skills: ['React', 'TypeScript', 'Node.js'],
                      photograph: '/src/assets/images/portfolio_branding_showcase_1791906979435.jpg',
                      published: true,
                      displayOrder: teamList.length + 1
                    })
                  }
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Staff Profile</span>
                </button>
              </div>

              {/* Team Member Edit Modal */}
              {editingTeamMember && (
                <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg space-y-4 text-xs">
                  <h4 className="font-display text-base font-bold text-zinc-900 dark:text-white">
                    Edit Profile Details
                  </h4>

                  <form onSubmit={handleSaveTeamMember} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={editingTeamMember.name}
                          onChange={(e) =>
                            setEditingTeamMember({ ...editingTeamMember, name: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Job Title</label>
                        <input
                          type="text"
                          required
                          value={editingTeamMember.jobTitle}
                          onChange={(e) =>
                            setEditingTeamMember({ ...editingTeamMember, jobTitle: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-1">Department</label>
                        <select
                          value={editingTeamMember.department}
                          onChange={(e) =>
                            setEditingTeamMember({ ...editingTeamMember, department: e.target.value as any })
                          }
                          className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                        >
                          <option>Leadership</option>
                          <option>Design</option>
                          <option>Engineering</option>
                          <option>AI &amp; Automation</option>
                          <option>Management</option>
                          <option>Marketing</option>
                        </select>
                      </div>

                      {/* Photo selector with cropper */}
                      <div>
                        <label className="block font-semibold mb-1">Profile Photograph</label>
                        <div className="flex items-center gap-3">
                          {editingTeamMember.photograph && (
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 shrink-0">
                              <img src={editingTeamMember.photograph} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setMediaPickerConfig({
                                open: true,
                                currentUrl: editingTeamMember.photograph,
                                category: 'team',
                                label: `Staff Picture: ${editingTeamMember.name}`,
                                onSelected: (url) =>
                                  setEditingTeamMember({ ...editingTeamMember, photograph: url })
                              })
                            }
                            className="px-3 py-1.5 text-xs font-semibold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
                          >
                            Upload &amp; Crop Photograph
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Biography</label>
                      <textarea
                        rows={3}
                        required
                        value={editingTeamMember.biography}
                        onChange={(e) =>
                          setEditingTeamMember({ ...editingTeamMember, biography: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-1">Skills (comma separated)</label>
                        <input
                          type="text"
                          value={editingTeamMember.skills.join(', ')}
                          onChange={(e) =>
                            setEditingTeamMember({
                              ...editingTeamMember,
                              skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                            })
                          }
                          className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">LinkedIn URL</label>
                        <input
                          type="text"
                          value={editingTeamMember.linkedinUrl || ''}
                          onChange={(e) =>
                            setEditingTeamMember({ ...editingTeamMember, linkedinUrl: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingTeamMember.published}
                          onChange={(e) =>
                            setEditingTeamMember({ ...editingTeamMember, published: e.target.checked })
                          }
                          className="w-4 h-4 text-yellow-500 rounded"
                        />
                        <span>Visible on Public Website</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setEditingTeamMember(null)}
                        className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded bg-yellow-400 hover:bg-yellow-300 text-black font-bold"
                      >
                        Save Profile
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Team Members List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {teamList.map((member) => (
                  <div
                    key={member.id}
                    className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-zinc-300 dark:border-zinc-700">
                          <img
                            src={member.photograph}
                            alt={member.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-display text-sm font-bold text-zinc-900 dark:text-white">
                            {member.name}
                          </h4>
                          <span className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold block">
                            {member.jobTitle}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono block">
                            {member.department}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-2">
                        {member.biography}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-400">
                        {member.published ? 'Published' : 'Hidden'}
                      </span>
                      <div className="space-x-1.5">
                        <button
                          onClick={() => setEditingTeamMember(member)}
                          className="px-2.5 py-1 text-[11px] rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
                        >
                          Edit
                        </button>
                        {!member.isFounder && (
                          <button
                            onClick={() => handleDeleteTeamMember(member.id)}
                            className="px-2.5 py-1 text-[11px] rounded bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              MODULE 7: PRICING PACKAGES
              ======================================================== */}
          {activeModule === 'pricing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white">
                    International Pricing Packages (USD)
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Edit rates, inclusions, revision policy, and delivery estimates.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/pricing', {
                        method: 'PUT',
                        headers: getAuthHeaders(),
                        body: JSON.stringify({ pricing })
                      });
                      if (res.ok) showFeedback('success', 'Pricing packages saved successfully.');
                    } catch {
                      showFeedback('error', 'Failed to save pricing.');
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Packages</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pricing.map((pkg, idx) => (
                  <div
                    key={pkg.id}
                    className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 text-xs"
                  >
                    <div>
                      <label className="text-zinc-400 block mb-0.5">Package Title</label>
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => {
                          const next = [...pricing];
                          next[idx].name = e.target.value;
                          setPricing(next);
                        }}
                        className="w-full px-2.5 py-1.5 font-bold rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-zinc-400 block mb-0.5">Price (USD)</label>
                        <input
                          type="number"
                          value={pkg.priceUsd}
                          onChange={(e) => {
                            const next = [...pricing];
                            next[idx].priceUsd = parseFloat(e.target.value) || 0;
                            setPricing(next);
                          }}
                          className="w-full px-2.5 py-1.5 font-mono rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 block mb-0.5">Turnaround</label>
                        <input
                          type="text"
                          value={pkg.turnaroundDays}
                          onChange={(e) => {
                            const next = [...pricing];
                            next[idx].turnaroundDays = e.target.value;
                            setPricing(next);
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-zinc-400 block mb-0.5">Inclusions (one per line)</label>
                      <textarea
                        rows={4}
                        value={pkg.includes.join('\n')}
                        onChange={(e) => {
                          const next = [...pricing];
                          next[idx].includes = e.target.value.split('\n').filter(Boolean);
                          setPricing(next);
                        }}
                        className="w-full px-2.5 py-1.5 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              MODULE 8: PROJECT INQUIRIES & LEAD MANAGEMENT
              ======================================================== */}
          {activeModule === 'inquiries' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Inquiries List */}
              <div className="lg:col-span-5 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                  <input
                    type="text"
                    value={searchInquiryQuery}
                    onChange={(e) => setSearchInquiryQuery(e.target.value)}
                    placeholder="Search by client, brand, email..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {filteredInquiries.map((inq) => {
                    const isSelected = selectedInquiry?.id === inq.id;
                    return (
                      <button
                        key={inq.id}
                        onClick={() => {
                          setSelectedInquiry(inq);
                          setEditingInquiryStatus(inq.status);
                          setEditingInquiryNotes(inq.adminNotes || '');
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-zinc-900 text-white dark:bg-yellow-400 dark:text-black border-zinc-900 dark:border-yellow-400 shadow-sm'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="font-mono">{inq.id}</span>
                          <span className="uppercase font-mono font-bold">
                            {inq.status}
                          </span>
                        </div>
                        <div className="font-display text-sm font-bold truncate">
                          {inq.clientName} &middot; {inq.brandName}
                        </div>
                        <div
                          className={`text-xs mt-1 truncate ${
                            isSelected ? 'text-zinc-300 dark:text-zinc-900' : 'text-zinc-500'
                          }`}
                        >
                          {inq.serviceName} &middot; {inq.budgetRangeUsd}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Inquiry Detail */}
              <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6">
                {selectedInquiry ? (
                  <>
                    <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                      <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                        <span className="font-mono">Inquiry #{selectedInquiry.id}</span>
                        <span>{new Date(selectedInquiry.createdAt).toLocaleString()}</span>
                      </div>
                      <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                        {selectedInquiry.clientName}
                      </h2>
                      <div className="text-xs text-zinc-500 mt-1">
                        {selectedInquiry.brandName} &middot; {selectedInquiry.country} &middot;{' '}
                        <a href={`mailto:${selectedInquiry.businessEmail}`} className="text-yellow-600 dark:text-yellow-400 underline">
                          {selectedInquiry.businessEmail}
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                      <div>
                        <span className="text-zinc-400 block mb-0.5">Service:</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">{selectedInquiry.serviceName}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block mb-0.5">Budget:</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">{selectedInquiry.budgetRangeUsd}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block mb-0.5">Target Launch:</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">{selectedInquiry.desiredDeadline}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block mb-0.5">References:</span>
                        <span className="font-semibold text-zinc-900 dark:text-white truncate block">
                          {selectedInquiry.referenceLinks || 'None provided'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Client Scope Brief:
                      </h4>
                      <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
                        {selectedInquiry.projectDescription}
                      </div>
                    </div>

                    {/* Status update */}
                    <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                        Update Status &amp; Admin Notes
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                            Status
                          </label>
                          <select
                            value={editingInquiryStatus}
                            onChange={(e) => setEditingInquiryStatus(e.target.value as any)}
                            className="w-full px-3 py-2 text-xs rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                          >
                            <option value="new">New Review</option>
                            <option value="in_review">In Review / Proposal Scoping</option>
                            <option value="accepted">Accepted / In Production</option>
                            <option value="completed">Completed &amp; Delivered</option>
                            <option value="declined">Declined</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                            Note (Visible in Client Portal)
                          </label>
                          <input
                            type="text"
                            value={editingInquiryNotes}
                            onChange={(e) => setEditingInquiryNotes(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleUpdateInquiry}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded"
                      >
                        Save Status &amp; Note
                      </button>
                    </div>

                    {/* Direct message reply */}
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                        Direct Client Update Message
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type update message..."
                          className="flex-1 px-3 py-2 text-xs rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white"
                        />
                        <button
                          onClick={handleSendReply}
                          disabled={!replyText.trim()}
                          className="px-4 py-2 text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 rounded"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20 text-zinc-500">
                    Select an inquiry from the left to view details and update status.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              MODULE 9: SETTINGS & SECURITY
              ======================================================== */}
          {activeModule === 'settings' && settings && (
            <div className="space-y-6">
              {/* Agency Links */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 space-y-4 text-xs">
                <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
                  Agency Channels &amp; Social Links
                </h3>
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Business Email</label>
                      <input
                        type="email"
                        value={settings.businessEmail}
                        onChange={(e) => setSettings({ ...settings, businessEmail: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Direct Messaging (WhatsApp/Telegram)</label>
                      <input
                        type="text"
                        value={settings.messagingLink}
                        onChange={(e) => setSettings({ ...settings, messagingLink: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Founder's Portfolio Link</label>
                    <input
                      type="url"
                      value={settings.existingPortfolioUrl}
                      onChange={(e) => setSettings({ ...settings, existingPortfolioUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">LinkedIn Profile</label>
                      <input
                        type="text"
                        value={settings.linkedinUrl}
                        onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Instagram Profile</label>
                      <input
                        type="text"
                        value={settings.instagramUrl}
                        onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded"
                    >
                      Save Channels
                    </button>
                  </div>
                </form>
              </div>

              {/* Password update */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 space-y-4 text-xs">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
                    Update Administrator Master Password
                  </h3>
                </div>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block font-semibold mb-1">New Password (Min 8 characters)</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Media Picker Dialog */}
      {mediaPickerConfig?.open && (
        <MediaSelectModal
          currentUrl={mediaPickerConfig.currentUrl}
          categoryFilter={mediaPickerConfig.category}
          targetLabel={mediaPickerConfig.label}
          onSelect={(url) => {
            mediaPickerConfig.onSelected(url);
            showFeedback('success', `Assigned image for ${mediaPickerConfig.label}`);
          }}
          onClose={() => setMediaPickerConfig(null)}
        />
      )}
    </div>
  );
};
