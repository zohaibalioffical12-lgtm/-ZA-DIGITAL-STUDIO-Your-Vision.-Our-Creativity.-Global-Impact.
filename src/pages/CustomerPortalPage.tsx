import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { InquiryRecord, CustomerMessage } from '../types';
import { ArrowRight, Clock, MessageSquare, Send, CheckCircle2, AlertCircle, FileText, ExternalLink, RefreshCw } from 'lucide-react';

export const CustomerPortalPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { customerUser, customerLogin, customerLogout } = useAuth();

  const [inputEmail, setInputEmail] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Load customer inquiries when customerUser is active
  useEffect(() => {
    if (!customerUser) {
      setInquiries([]);
      setSelectedInquiry(null);
      setMessages([]);
      return;
    }

    setLoadingData(true);
    fetch(`/api/inquiries?email=${encodeURIComponent(customerUser.email)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.inquiries) {
          setInquiries(data.inquiries);
          if (data.inquiries.length > 0) {
            setSelectedInquiry(data.inquiries[0]);
          }
        }
        setLoadingData(false);
      })
      .catch(() => setLoadingData(false));
  }, [customerUser]);

  // Load conversation messages for selected inquiry
  useEffect(() => {
    if (!selectedInquiry || !customerUser) return;

    fetch(`/api/inquiries/${selectedInquiry.id}/messages?email=${encodeURIComponent(customerUser.email)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages) {
          setMessages(data.messages);
        }
      })
      .catch(() => {});
  }, [selectedInquiry, customerUser]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim() || !inputEmail.includes('@')) {
      setLoginError('Please enter a valid email address.');
      return;
    }

    setLoadingLogin(true);
    setLoginError(null);

    const res = await customerLogin(inputEmail.trim());
    setLoadingLogin(false);
    if (!res.success) {
      setLoginError(res.error || 'Failed to authenticate project inquiry.');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !newMessage.trim() || !customerUser) return;

    setSendingMessage(true);
    try {
      const res = await fetch(`/api/inquiries/${selectedInquiry.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: customerUser.email,
          senderName: customerUser.name,
          message: newMessage.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Failed to post message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const getStatusBadge = (status: InquiryRecord['status']) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded">New Under Review</span>;
      case 'in_review':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded">Proposal Scoping</span>;
      case 'accepted':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded">Project Accepted</span>;
      case 'completed':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded">Completed &amp; Delivered</span>;
      case 'declined':
        return <span className="px-2 py-0.5 text-[11px] font-semibold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800 rounded">Declined</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="w-full py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
          Client Workspace
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
          Client Project Portal
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Track the live status of your submitted briefs, review administrator notes, and communicate directly with ZA DIGITAL STUDIO.
        </p>
      </div>

      {!customerUser ? (
        /* Login / Lookup Form */
        <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 shadow-sm">
          <h2 className="font-display text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Access Your Project History
          </h2>
          <p className="text-xs text-zinc-500 mb-6">
            Enter the business email address you provided when submitting your project brief:
          </p>

          {loginError && (
            <div className="mb-4 p-3 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Business Email Address
              </label>
              <input
                type="email"
                required
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="e.g. sarah@aurorastudios.co"
                className="w-full px-3.5 py-2.5 text-sm rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <button
              type="submit"
              disabled={loadingLogin}
              className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 rounded transition-colors flex items-center justify-center gap-2"
            >
              {loadingLogin ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Records...</span>
                </>
              ) : (
                <>
                  <span>Lookup Project Records</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-500">
            Have not submitted a project yet?{' '}
            <button
              onClick={() => onNavigate('/start-project')}
              className="text-yellow-600 dark:text-yellow-400 font-semibold hover:underline"
            >
              Start a project brief &rarr;
            </button>
          </div>
        </div>
      ) : (
        /* Logged In Portal View */
        <div className="space-y-8">
          {/* Top User Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div>
              <span className="text-xs text-zinc-400 block">Logged In Client:</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-white">
                {customerUser.name} &middot; {customerUser.email}
              </span>
            </div>
            <button
              onClick={customerLogout}
              className="px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors self-start sm:self-auto"
            >
              Sign Out
            </button>
          </div>

          {loadingData ? (
            <div className="text-center py-16 text-zinc-500">Loading your project briefs...</div>
          ) : inquiries.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                No active project inquiries found under this email.
              </p>
              <button
                onClick={() => onNavigate('/start-project')}
                className="mt-4 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded"
              >
                Submit New Project Brief
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Inquiries List */}
              <div className="lg:col-span-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block px-1">
                  Your Projects ({inquiries.length})
                </span>
                {inquiries.map((inq) => {
                  const isSelected = selectedInquiry?.id === inq.id;
                  return (
                    <button
                      key={inq.id}
                      onClick={() => setSelectedInquiry(inq)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-zinc-900 text-white dark:bg-yellow-400 dark:text-black border-zinc-900 dark:border-yellow-400 shadow-sm'
                          : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-mono">{inq.id}</span>
                        {getStatusBadge(inq.status)}
                      </div>
                      <div className="font-display text-sm font-bold truncate">
                        {inq.serviceName}
                      </div>
                      <div
                        className={`text-xs mt-1 truncate ${
                          isSelected ? 'text-zinc-300 dark:text-zinc-900' : 'text-zinc-500'
                        }`}
                      >
                        {inq.brandName} &middot; {new Date(inq.createdAt).toLocaleDateString()}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Selected Inquiry Detail & Messages */}
              <div className="lg:col-span-8 space-y-6">
                {selectedInquiry && (
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 sm:p-8 space-y-6">
                    {/* Status Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-zinc-400">Project #{selectedInquiry.id}</span>
                          {getStatusBadge(selectedInquiry.status)}
                        </div>
                        <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                          {selectedInquiry.serviceName}
                        </h2>
                      </div>
                      <div className="text-xs text-zinc-500 font-mono">
                        Submitted: {new Date(selectedInquiry.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Scope Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs p-4 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                      <div>
                        <span className="text-zinc-400 block mb-0.5">Brand Name:</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">{selectedInquiry.brandName}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block mb-0.5">Budget Range:</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">{selectedInquiry.budgetRangeUsd}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block mb-0.5">Target Launch:</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">{selectedInquiry.desiredDeadline}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        Project Scope Brief
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-4 rounded border border-zinc-200 dark:border-zinc-800 whitespace-pre-wrap">
                        {selectedInquiry.projectDescription}
                      </p>
                    </div>

                    {/* Admin Notes / Updates */}
                    {selectedInquiry.adminNotes && (
                      <div className="p-4 rounded bg-yellow-400/10 border border-yellow-400/30 text-xs text-zinc-800 dark:text-zinc-200 space-y-1">
                        <span className="font-bold text-yellow-600 dark:text-yellow-400 block">
                          Agency Director Note (Zohaib Ali):
                        </span>
                        <p>{selectedInquiry.adminNotes}</p>
                      </div>
                    )}

                    {/* Conversation Message Feed */}
                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-yellow-500" />
                        <span>Project Messages &amp; Updates ({messages.length})</span>
                      </h4>

                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {messages.length === 0 ? (
                          <div className="text-xs text-zinc-500 italic py-2">
                            No messages exchanged yet. Use the field below to send an update.
                          </div>
                        ) : (
                          messages.map((m) => (
                            <div
                              key={m.id}
                              className={`p-3.5 rounded text-xs leading-relaxed ${
                                m.sender === 'agency'
                                  ? 'bg-yellow-400/10 dark:bg-yellow-400/5 border border-yellow-400/20 text-zinc-900 dark:text-zinc-100'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                              }`}
                            >
                              <div className="flex items-center justify-between font-semibold mb-1">
                                <span className={m.sender === 'agency' ? 'text-yellow-600 dark:text-yellow-400' : 'text-zinc-600 dark:text-zinc-400'}>
                                  {m.senderName}
                                </span>
                                <span className="text-[10px] text-zinc-400">
                                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p>{m.message}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Reply Form */}
                      <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
                        <input
                          type="text"
                          required
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Send a project update or question..."
                          className="flex-1 px-3.5 py-2 text-xs rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                        />
                        <button
                          type="submit"
                          disabled={sendingMessage || !newMessage.trim()}
                          className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 rounded transition-colors flex items-center gap-1.5"
                        >
                          <span>Send</span>
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
