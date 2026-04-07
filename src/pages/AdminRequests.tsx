import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  CheckCircle2, 
  XCircle,
  Clock,
  Inbox,
  Eye,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  ExternalLink,
  X
} from 'lucide-react';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { getIssuers, updateIssuerStatus, type Issuer } from '../services/adminApi';

const AdminRequests = () => {
  const { token } = useAuth();

  const [requests, setRequests] = useState<Issuer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState<string | number | null>(null);
  
  // NEW: State to control the details modal
  const [selectedIssuer, setSelectedIssuer] = useState<Issuer | null>(null);

  // Fetch only pending requests
  useEffect(() => {
    const fetchPending = async () => {
      if (!token) return;
      try {
        const data = await getIssuers(token, 'pending');
        setRequests(data);
      } catch (err: any) {
        setError(err.message || "Failed to load pending requests.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPending();
  }, [token]);

  const handleAction = async (id: string | number, action: 'approved' | 'rejected') => {
    if (!token) return;
    setProcessingId(id);
    try {
      await updateIssuerStatus(id, action, token);
      setRequests(prev => prev.filter(req => req.id !== id));
      
      // Close modal if the action was taken from inside the modal
      if (selectedIssuer?.id === id) {
        setSelectedIssuer(null);
      }
    } catch (err: any) {
      alert(err.message || `Failed to mark as ${action}.`);
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = requests.filter(o =>
    (o.college_name && o.college_name.toLowerCase().includes(search.toLowerCase())) ||
    o.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-3">
            Institution Requests
            <span className="text-xs font-mono bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md border border-amber-500/20 flex items-center gap-1.5">
              <Clock size={12} />
              {requests.length} Pending
            </span>
          </h1>
          <p className="text-sm text-[#8A8F98] mt-1">
            Review and verify new applications for the BhoomiNet protocol.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#0A0A0C]/60 backdrop-blur-md border border-white/[0.06] p-3 rounded-2xl shadow-sm">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={14} />}
          />
        </div>
      </div>

      {/* Table & Empty States */}
      <div className="bg-[#0A0A0C]/60 backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-hidden shadow-[0_8px_16px_-6px_rgba(0,0,0,0.5)]">
        {isLoading ? (
          <div className="p-12 text-center text-[#8A8F98] text-sm">Loading requests...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-400 text-sm">{error}</div>
        ) : requests.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.06] rounded-full flex items-center justify-center mb-4">
              <Inbox size={24} className="text-[#8A8F98]" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">Inbox Zero</h3>
            <p className="text-sm text-[#8A8F98] max-w-sm">
              There are no pending institution requests at the moment. You're all caught up!
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                {['Institution', 'Contact Details', 'Status', 'Actions'].map((h, i) => (
                  <th
                    key={i}
                    className={`p-5 text-[10px] font-mono uppercase tracking-widest text-[#8A8F98] font-medium ${i === 3 ? 'text-right' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              <AnimatePresence>
                {filtered.map((org) => (
                  <motion.tr
                    key={org.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Institution */}
                    <td className="p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{org.college_name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#8A8F98]">ID: {org.college_id}</span>
                    </td>

                    {/* Contact */}
                    <td className="p-5">
                      <span className="text-xs font-mono text-[#8A8F98]">{org.email}</span>
                    </td>

                    {/* Status */}
                    <td className="p-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border bg-amber-500/10 text-amber-500 border-amber-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        Pending Review
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-5">
                      <div className="flex justify-end gap-2">
                        {/* Details Button */}
                        <button
                          onClick={() => setSelectedIssuer(org)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all"
                        >
                          <Eye size={14} />
                          Details
                        </button>
                        <button
                          onClick={() => handleAction(org.id, 'approved')}
                          disabled={processingId === org.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                        >
                          <CheckCircle2 size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(org.id, 'rejected')}
                          disabled={processingId === org.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all disabled:opacity-50"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>

      {/* --- Issuer Details Modal --- */}
      <AnimatePresence>
        {selectedIssuer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIssuer(null)}
              className="absolute inset-0 bg-[#050506]/80 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-[#0A0A0C] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#5E6AD2]/50 to-transparent" />
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#5E6AD2]/10 rounded-lg border border-[#5E6AD2]/20">
                    <Building2 size={18} className="text-[#5E6AD2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white leading-tight">Institution Details</h2>
                    <p className="text-[11px] font-mono text-[#8A8F98]">ID: {selectedIssuer.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedIssuer(null)}
                  className="p-1.5 text-[#8A8F98] hover:text-white hover:bg-white/5 rounded-md transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 border-b border-white/[0.04] pb-2">Profile Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500">Institution Name</p>
                      <p className="text-sm font-medium text-white">{selectedIssuer.college_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500">Registration ID</p>
                      <p className="text-sm font-mono text-white">{selectedIssuer.college_id}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 border-b border-white/[0.04] pb-2">Contact Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 flex items-start gap-2">
                      <Mail size={14} className="text-[#5E6AD2] mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase text-slate-500 mb-0.5">Email Address</p>
                        <p className="text-sm text-white">{selectedIssuer.email}</p>
                      </div>
                    </div>
                    <div className="space-y-1 flex items-start gap-2">
                      <Phone size={14} className="text-[#5E6AD2] mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase text-slate-500 mb-0.5">Phone Number</p>
                        <p className="text-sm text-white">{selectedIssuer.phone_number || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="space-y-1 flex items-start gap-2 col-span-1 md:col-span-2">
                      <MapPin size={14} className="text-[#5E6AD2] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase text-slate-500 mb-0.5">Physical Address</p>
                        <p className="text-sm text-white">{selectedIssuer.college_address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 border-b border-white/[0.04] pb-2">Verification Documents</h3>
                  
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-slate-400" />
                      <div>
                        <p className="text-sm text-white font-medium">Affiliation Document</p>
                        <p className="text-[11px] font-mono text-slate-500">Doc ID: {selectedIssuer.document_id || 'N/A'}</p>
                      </div>
                    </div>
                    {selectedIssuer.document ? (
                      <a 
                        href={selectedIssuer.document} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5E6AD2]/10 text-[#5E6AD2] text-xs font-medium rounded-lg hover:bg-[#5E6AD2]/20 transition-colors"
                      >
                        View File <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500">No file attached</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Modal Footer / Actions */}
              <div className="p-6 border-t border-white/[0.04] bg-black/20 flex items-center justify-between gap-4">
                <span className="text-xs text-amber-500 font-medium px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                  Status: Pending Review
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(selectedIssuer.id, 'rejected')}
                    disabled={processingId === selectedIssuer.id}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all disabled:opacity-50"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                  <button
                    onClick={() => handleAction(selectedIssuer.id, 'approved')}
                    disabled={processingId === selectedIssuer.id}
                    className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-400 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 text-black"
                  >
                    {processingId === selectedIssuer.id ? (
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    Approve Request
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminRequests;