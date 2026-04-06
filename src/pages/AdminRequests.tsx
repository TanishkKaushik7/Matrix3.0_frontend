import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  XCircle,
  Clock,
  Inbox
} from 'lucide-react';
import Input from '../components/ui/Input';
import { getIssuers, updateIssuerStatus, type Issuer } from '../services/adminApi';

const AdminRequests = () => {
  const [requests, setRequests] = useState<Issuer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState<string | number | null>(null);

  // Fetch only pending requests
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const data = await getIssuers('pending');
        setRequests(data);
      } catch (err: any) {
        setError(err.message || "Failed to load pending requests.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleAction = async (id: string | number, action: 'approved' | 'rejected') => {
    setProcessingId(id);
    try {
      await updateIssuerStatus(id, action);
      // Remove the processed request from the UI
      setRequests(prev => prev.filter(req => req.id !== id));
    } catch (err: any) {
      alert(err.message || `Failed to mark as ${action}.`);
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = requests.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
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
                        <span className="text-sm font-medium text-white">{org.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#8A8F98]">ID: {org.id}</span>
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
    </div>
  );
};

export default AdminRequests;