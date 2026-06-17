import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, ExternalLink, IndianRupee, Users, Clock } from 'lucide-react';
import { dashboardService } from './dashboardService';
import { paymentsService } from '../payments/paymentsService';

export default function AdminEventDetail() {
  const { eventId } = useParams();
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Rejection Modal State
  const [rejectingPaymentId, setRejectingPaymentId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchDetails = async () => {
    try {
      const responseData = await dashboardService.getEventAdminDetails(eventId);
      setData(responseData);
    } catch (error) {
      toast.error(error.message || 'Failed to load event details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const handleApprove = async (paymentId) => {
    setIsProcessing(true);
    const loadingToast = toast.loading('Approving payment...');
    try {
      await paymentsService.reviewPayment(paymentId, { status: 'SUCCESS' });
      toast.success('Payment approved! User enrolled.', { id: loadingToast });
      fetchDetails(); // Refresh the data grid
    } catch (error) {
      toast.error(error.message || 'Failed to approve payment.', { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return toast.error('A rejection reason is strictly required.');
    
    setIsProcessing(true);
    const loadingToast = toast.loading('Rejecting payment...');
    try {
      await paymentsService.reviewPayment(rejectingPaymentId, { 
        status: 'REJECTED', 
        rejectionReason 
      });
      toast.success('Payment rejected successfully.', { id: loadingToast });
      setRejectingPaymentId(null);
      setRejectionReason('');
      fetchDetails(); // Refresh the data grid
    } catch (error) {
      toast.error(error.message || 'Failed to reject payment.', { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-500"></div></div>;
  if (!data) return null;

  const { eventInfo, stats, pendingRequests = [], participants = [] } = data;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 relative">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/dashboard" className="text-sm font-medium text-medical-500 hover:underline">Dashboard</Link>
            <span className="text-slate-400">/</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">Event Details</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{eventInfo.title}</h1>
        </div>
        <span className={`px-4 py-2 rounded-lg font-bold text-sm ${eventInfo.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
          {eventInfo.isActive ? 'ACTIVE' : 'INACTIVE'}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Total Revenue</p>
          <div className="flex items-center gap-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            <IndianRupee size={24} />
            {new Intl.NumberFormat('en-IN').format(stats.totalRevenue)}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Approved Participants</p>
          <div className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
            <Users size={24} className="text-medical-500" />
            {stats.approvedParticipants}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Pending Verifications</p>
          <div className="flex items-center gap-2 text-2xl font-bold text-amber-600 dark:text-amber-500">
            <Clock size={24} />
            {stats.pendingVerifications}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Rejected Requests</p>
          <div className="flex items-center gap-2 text-2xl font-bold text-red-600 dark:text-red-500">
            <XCircle size={24} />
            {stats.rejectedRequests}
          </div>
        </div>
      </div>

      {/* Pending Verifications Table */}
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Action Required: Pending Payments</h2>
      {pendingRequests.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500 dark:text-slate-400 mb-10">
          No pending verifications at this time.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl mb-10 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">User</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">UTR Number</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Screenshot</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {pendingRequests.map((req) => (
                <tr key={req.paymentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-900 dark:text-white">{req.user.fullName}</div>
                    <div className="text-slate-500">{req.user.email}</div>
                  </td>
                  <td className="p-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                    {req.utr}
                  </td>
                  <td className="p-4">
                    <a href={req.screenshotUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-medical-500 hover:text-medical-600 font-medium">
                      View Image <ExternalLink size={14} />
                    </a>
                  </td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleApprove(req.paymentId)}
                      disabled={isProcessing}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 rounded-lg flex items-center gap-1 font-medium transition-colors disabled:opacity-50"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button 
                      onClick={() => setRejectingPaymentId(req.paymentId)}
                      disabled={isProcessing}
                      className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg flex items-center gap-1 font-medium transition-colors disabled:opacity-50"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingPaymentId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Reject Payment</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Please provide a reason for rejecting this payment. This will be visible to the user.
            </p>
            <form onSubmit={handleReject}>
              <textarea
                required
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., UTR number does not match bank records."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-red-500 dark:text-white resize-none mb-6"
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setRejectingPaymentId(null); setRejectionReason(''); }}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow transition-colors disabled:opacity-70"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approved Participants Roster */}
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Approved Participants Roster</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {participants.map((p) => (
          <div key={p.enrollmentId} className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <img src={p.user.imageUrl || `https://ui-avatars.com/api/?name=${p.user.fullName}&background=random`} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">{p.user.fullName}</p>
              <p className="text-xs text-slate-500 truncate">{p.user.email}</p>
            </div>
          </div>
        ))}
        {participants.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400 col-span-full">No approved participants yet.</p>
        )}
      </div>

    </div>
  );
}