import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CheckCircle, XCircle, ExternalLink,
  IndianRupee, Users, Clock, ArrowLeft, Search
} from 'lucide-react';
import { dashboardService } from './dashboardService';
import { paymentsService } from '../payments/paymentsService';
import BrandLoader from '../../utils/BrandLoader';
import { getErrorMessage, getSuccessMessage } from '../../utils/apiMessage';

const ACCENT = '#0C6E72';

export default function AdminEventDetail() {
  const { eventId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectingPaymentId, setRejectingPaymentId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [search, setSearch] = useState('');

  const fetchDetails = async () => {
    try {
      const responseData = await dashboardService.getEventAdminDetails(eventId);
      setData(responseData);
    } catch (e) {
      toast.error(getErrorMessage(e, 'Failed to load event details.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDetails(); }, [eventId]);

  const handleApprove = async (paymentId) => {
    setIsProcessing(true);
    const t = toast.loading('Approving payment…');
    try {
      const res = await paymentsService.reviewPayment(paymentId, { status: 'SUCCESS' });
      toast.success(getSuccessMessage(res, 'Payment approved.'), { id: t });
      fetchDetails();
    } catch (e) {
      toast.error(getErrorMessage(e, 'Failed to approve.'), { id: t });
    } finally { setIsProcessing(false); }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    const reason = rejectionReason.trim();
    if (!reason) return toast.error('Rejection reason is required.');
    if (reason.length < 5) return toast.error('Rejection reason must be at least 5 characters.');
    if (reason.length > 500) return toast.error('Rejection reason must be 500 characters or fewer.');
    setIsProcessing(true);
    const t = toast.loading('Rejecting payment…');
    try {
      const res = await paymentsService.reviewPayment(rejectingPaymentId, { status: 'REJECTED', rejectionReason: reason });
      toast.success(getSuccessMessage(res, 'Payment rejected.'), { id: t });
      setRejectingPaymentId(null);
      setRejectionReason('');
      fetchDetails();
    } catch (e) {
      toast.error(getErrorMessage(e, 'Failed to reject.'), { id: t });
    } finally { setIsProcessing(false); }
  };

  if (isLoading) return <BrandLoader label="Loading event details…" />;
  if (!data) return null;

  const { eventInfo, stats, pendingRequests = [], participants = [] } = data;

  const filteredParticipants = participants.filter(p => {
    const q = search.toLowerCase();
    return (
      p.user.fullName?.toLowerCase().includes(q) ||
      p.user.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-indriya-muted dark:text-indriya-darkMuted hover:text-[#0C6E72] transition-colors mb-3 group"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
          <p className="text-[11px] font-black tracking-[0.14em] uppercase text-indriya-muted dark:text-indriya-darkMuted mb-1.5">
            Event Management
          </p>
          <h1
            className="text-indriya-text dark:text-indriya-darkText tracking-[-0.025em] leading-tight"
            style={{ fontFamily: "'DM Serif Display', 'Georgia', serif", fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 400 }}
          >
            {eventInfo.title}
          </h1>
        </div>
        <span
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.08em]"
          style={
            eventInfo.isActive
              ? { backgroundColor: 'rgba(16,185,129,0.1)', color: '#059669' }
              : { backgroundColor: 'rgba(120,120,120,0.1)' }
          }
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: eventInfo.isActive ? '#10b981' : '#888' }}
          />
          <span className={eventInfo.isActive ? '' : 'text-indriya-muted dark:text-indriya-darkMuted'}>
            {eventInfo.isActive ? 'Active' : 'Inactive'}
          </span>
        </span>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Revenue',
            value: `₹${new Intl.NumberFormat('en-IN').format(stats.totalRevenue)}`,
            icon: IndianRupee,
            color: '#059669',
            bg: 'rgba(16,185,129,0.1)',
          },
          {
            label: 'Approved',
            value: stats.approvedParticipants,
            icon: Users,
            color: ACCENT,
            bg: 'rgba(12,110,114,0.1)',
          },
          {
            label: 'Pending',
            value: stats.pendingVerifications,
            icon: Clock,
            color: '#d97706',
            bg: 'rgba(217,119,6,0.1)',
          },
          {
            label: 'Rejected',
            value: stats.rejectedRequests,
            icon: XCircle,
            color: '#ef4444',
            bg: 'rgba(239,68,68,0.1)',
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[18px] p-5 flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-indriya-muted dark:text-indriya-darkMuted mb-2">
                {label}
              </p>
              <p
                className="tracking-tight leading-none"
                style={{ fontFamily: "'DM Serif Display', serif", fontSize: '28px', fontWeight: 400, color }}
              >
                {value}
              </p>
            </div>
            <div
              className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0"
              style={{ backgroundColor: bg }}
            >
              <Icon size={19} style={{ color }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Pending Payments ── */}
      <div
        className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[20px] overflow-hidden"
        style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
      >
        <div className="px-6 py-4 border-b border-indriya-border dark:border-indriya-darkBorder flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-[8px] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(217,119,6,0.1)' }}
          >
            <Clock size={14} style={{ color: '#d97706' }} />
          </div>
          <h2 className="text-[14px] font-bold text-indriya-text dark:text-indriya-darkText flex items-center">
            Pending Payments
            {pendingRequests.length > 0 && (
              <span
                className="ml-2 text-[11px] font-black px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(217,119,6,0.12)', color: '#d97706' }}
              >
                {pendingRequests.length}
              </span>
            )}
          </h2>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(16,185,129,0.08)' }}
            >
              <CheckCircle size={22} style={{ color: '#10b981' }} />
            </div>
            <p className="text-[13px] font-semibold text-indriya-text dark:text-indriya-darkText mb-1">
              All caught up
            </p>
            <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted">
              No pending verifications at this time.
            </p>
          </div>
        ) : (
          <>
            {/* ── Desktop: table ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-[13px] text-left">
                <thead>
                  <tr className="border-b border-indriya-border dark:border-indriya-darkBorder bg-indriya-secondary/40 dark:bg-indriya-darkSecondary/40">
                    {['User', 'UTR Number', 'Screenshot', ''].map((h) => (
                      <th
                        key={h}
                        className={`px-6 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-indriya-muted dark:text-indriya-darkMuted ${h === '' ? 'text-right' : ''}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-indriya-border dark:divide-indriya-darkBorder">
                  {pendingRequests.map((req) => (
                    <tr key={req.paymentId} className="hover:bg-indriya-secondary dark:hover:bg-indriya-darkSecondary transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="font-semibold text-indriya-text dark:text-indriya-darkText">{req.user.fullName}</p>
                        <p className="text-indriya-muted dark:text-indriya-darkMuted text-[12px]">{req.user.email}</p>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="font-mono font-semibold text-indriya-text dark:text-indriya-darkText bg-indriya-secondary dark:bg-indriya-darkSecondary px-2.5 py-1 rounded-md text-[12px]">
                          {req.utr}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <a
                          href={req.screenshotUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 hover:underline font-semibold text-[12px]"
                          style={{ color: ACCENT }}
                        >
                          View <ExternalLink size={12} />
                        </a>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(req.paymentId)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all hover:scale-[0.97] disabled:opacity-50"
                            style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#059669' }}
                          >
                            <CheckCircle size={13} /> Approve
                          </button>
                          <button
                            onClick={() => setRejectingPaymentId(req.paymentId)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all hover:scale-[0.97] disabled:opacity-50"
                            style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                          >
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile: stacked cards ── */}
            <div className="md:hidden divide-y divide-indriya-border dark:divide-indriya-darkBorder">
              {pendingRequests.map((req) => (
                <div key={req.paymentId} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-indriya-text dark:text-indriya-darkText text-[14px] truncate">
                        {req.user.fullName}
                      </p>
                      <p className="text-indriya-muted dark:text-indriya-darkMuted text-[12px] truncate">
                        {req.user.email}
                      </p>
                    </div>
                    <a
                      href={req.screenshotUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-shrink-0 inline-flex items-center gap-1 hover:underline font-semibold text-[12px]"
                      style={{ color: ACCENT }}
                    >
                      Proof <ExternalLink size={12} />
                    </a>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-indriya-muted dark:text-indriya-darkMuted">
                      UTR
                    </span>
                    <span className="font-mono font-semibold text-indriya-text dark:text-indriya-darkText bg-indriya-secondary dark:bg-indriya-darkSecondary px-2.5 py-1 rounded-md text-[12px] break-all">
                      {req.utr}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleApprove(req.paymentId)}
                      disabled={isProcessing}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full text-[13px] font-bold transition-all active:scale-[0.97] disabled:opacity-50"
                      style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#059669' }}
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      onClick={() => setRejectingPaymentId(req.paymentId)}
                      disabled={isProcessing}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full text-[13px] font-bold transition-all active:scale-[0.97] disabled:opacity-50"
                      style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Participants Roster ── */}
      <div
        className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[20px] overflow-hidden"
        style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
      >
        <div className="px-6 py-4 border-b border-indriya-border dark:border-indriya-darkBorder flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-[14px] font-bold text-indriya-text dark:text-indriya-darkText flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-[8px] flex items-center justify-center"
              style={{ backgroundColor: 'rgba(12,110,114,0.1)' }}
            >
              <Users size={14} style={{ color: ACCENT }} />
            </div>
            Approved Participants
            <span
              className="text-[11px] font-black px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(12,110,114,0.1)', color: ACCENT }}
            >
              {participants.length}
            </span>
          </h2>

          {/* Search */}
          {participants.length > 0 && (
            <div className="flex items-center gap-2 bg-indriya-secondary dark:bg-indriya-darkSecondary border border-indriya-border dark:border-indriya-darkBorder rounded-full px-3.5 py-2 w-full sm:w-64">
              <Search size={14} className="text-indriya-muted flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search participants…"
                className="bg-transparent text-[13px] text-indriya-text dark:text-indriya-darkText placeholder:text-indriya-muted outline-none w-full"
              />
            </div>
          )}
        </div>

        {participants.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(12,110,114,0.08)' }}
            >
              <Users size={22} style={{ color: ACCENT }} />
            </div>
            <p className="text-[13px] font-semibold text-indriya-text dark:text-indriya-darkText mb-1">
              No participants yet
            </p>
            <p className="text-[12px] text-indriya-muted dark:text-indriya-darkMuted">
              Approved registrations will appear here.
            </p>
          </div>
        ) : filteredParticipants.length === 0 ? (
          <div className="px-6 py-12 text-center text-[13px] text-indriya-muted dark:text-indriya-darkMuted">
            No participants match "{search}".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
            {filteredParticipants.map((p) => (
              <div
                key={p.enrollmentId}
                className="flex items-center gap-3 bg-indriya-secondary dark:bg-indriya-darkSecondary border border-indriya-border dark:border-indriya-darkBorder rounded-[14px] p-3.5 transition-colors"
                style={{ borderColor: undefined }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(12,110,114,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
              >
                {p.user.imageUrl ? (
                  <img
                    src={p.user.imageUrl}
                    alt={p.user.fullName}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold"
                    style={{ backgroundColor: 'rgba(12,110,114,0.12)', color: ACCENT }}
                  >
                    {p.user.fullName?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-indriya-text dark:text-indriya-darkText truncate">
                    {p.user.fullName}
                  </p>
                  <p className="text-[11px] text-indriya-muted dark:text-indriya-darkMuted truncate">
                    {p.user.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Rejection Modal ── */}
      {rejectingPaymentId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-indriya-card dark:bg-indriya-darkCard border border-indriya-border dark:border-indriya-darkBorder rounded-[24px] w-full max-w-md p-7 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
              >
                <XCircle size={16} style={{ color: '#ef4444' }} />
              </div>
              <h3 className="text-[17px] font-bold text-indriya-text dark:text-indriya-darkText">
                Reject Payment
              </h3>
            </div>
            <p className="text-[13px] text-indriya-muted dark:text-indriya-darkMuted mb-5 ml-12">
              Provide a reason — this will be shown to the user.
            </p>
            <form onSubmit={handleReject} className="flex flex-col gap-4">
              <textarea
                required
                rows={4}
                maxLength={500}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. UTR number does not match our bank records."
                className="w-full px-4 py-3 bg-indriya-secondary dark:bg-indriya-darkSecondary border border-indriya-border dark:border-indriya-darkBorder rounded-[14px] text-[13px] text-indriya-text dark:text-indriya-darkText placeholder:text-indriya-muted focus:outline-none resize-none transition-colors"
                onFocus={e => (e.target.style.borderColor = '#ef4444')}
                onBlur={e => (e.target.style.borderColor = '')}
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setRejectingPaymentId(null); setRejectionReason(''); }}
                  className="px-4 py-2 text-[13px] font-semibold text-indriya-muted dark:text-indriya-darkMuted hover:text-indriya-text dark:hover:text-indriya-darkText hover:bg-indriya-secondary dark:hover:bg-indriya-darkSecondary rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 text-white text-[13px] font-bold rounded-full transition-all hover:scale-[0.97] disabled:opacity-60"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  {isProcessing ? 'Processing…' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}