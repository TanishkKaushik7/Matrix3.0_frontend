import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ExternalLink,  
  Download, 
  Filter,
  Clock,
  Fingerprint
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCertificateHistory, type CertificateHistoryResponse } from '../../services/issuerApi';

const RegistryTable = () => {
  const { token } = useAuth();
  
  const [historyData, setHistoryData] = useState<CertificateHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [offset, setOffset] = useState(0);
  const limit = 50;

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const data = await getCertificateHistory(token, limit, offset);
        setHistoryData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load registry history.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [token, offset, limit]);

  // Helper to format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper to truncate hashes cleanly
  const truncateHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  // Client-side filtering
  const filteredCertificates = historyData?.certificates.filter(cert => 
    cert.hash.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cert.cid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificate_id.toString().includes(searchTerm)
  ) || [];

  const handleNextPage = () => {
    if (historyData && offset + limit < historyData.total_generated) {
      setOffset(prev => prev + limit);
    }
  };

  const handlePrevPage = () => {
    if (offset > 0) {
      setOffset(prev => Math.max(0, prev - limit));
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5E6AD2] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Filter by ID, Hash, or CID..."
            className="w-full bg-[#0A0A0C]/60 border border-white/[0.08] rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#5E6AD2]/50 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
        <button className="px-4 py-3 bg-[#0A0A0C]/60 border border-white/[0.08] rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-2">
          <Filter size={16} />
          <span className="text-xs font-medium">Filters</span>
        </button>
      </div>

      {/* Glassmorphic Table */}
      <div className="bg-[#0A0A0C]/60 backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="p-4 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Record ID</th>
                <th className="p-4 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Data Hash (SHA-256)</th>
                <th className="p-4 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">IPFS CID</th>
                <th className="p-4 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Issue Date</th>
                <th className="p-4 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading ? (
                <tr><td colSpan={5} className="p-12 text-center text-[#8A8F98] text-sm">Loading historical data...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="p-12 text-center text-red-400 text-sm">{error}</td></tr>
              ) : filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center">
                    <div className="w-12 h-12 bg-white/[0.02] border border-white/[0.06] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock size={20} className="text-[#8A8F98]" />
                    </div>
                    <p className="text-white text-sm font-medium">No records found</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredCertificates.map((cert) => (
                    <motion.tr 
                      key={cert.certificate_id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Record ID */}
                      <td className="p-4">
                        <span className="text-sm font-mono text-slate-300 group-hover:text-[#d2ad5e] transition-colors">
                          #{cert.certificate_id}
                        </span>
                      </td>

                      {/* Data Hash */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#5E6AD2]/10 flex items-center justify-center border border-[#5E6AD2]/20">
                            <Fingerprint size={14} className="text-[#d2ad5e]" />
                          </div>
                          <span className="text-xs font-mono text-white bg-white/5 px-2 py-1 rounded border border-white/10">
                            {truncateHash(cert.hash)}
                          </span>
                        </div>
                      </td>

                      {/* IPFS CID */}
                      <td className="p-4">
                        <span className="text-sm text-slate-400 font-mono">{truncateHash(cert.cid)}</span>
                      </td>

                      {/* Issue Date */}
                      <td className="p-4">
                        <span className="text-xs font-mono text-slate-500">{formatDate(cert.created_at)}</span>
                      </td>

                      {/* Verification / Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a 
                            href={`https://gateway.pinata.cloud/ipfs/${cert.cid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-white/[0.03] border border-white/10 text-slate-400 hover:text-[#e8ba47] hover:bg-[#5E6AD2]/10 transition-all title='View IPFS Asset'"
                          >
                            <Download size={14} />
                          </a>
                          
                          {cert.token_id ? (
                            <a 
                              href={`https://amoy.polygonscan.com/tx/${cert.token_id}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 text-[#5E6AD2] text-[10px] font-bold uppercase tracking-widest hover:bg-[#5E6AD2]/20 transition-all"
                            >
                              Explorer
                              <ExternalLink size={10} />
                            </a>
                          ) : (
                            <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                              <Clock size={10} /> Pending
                            </span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Empty State / Pagination Placeholder */}
        {historyData && (
          <div className="p-4 border-t border-white/[0.06] flex items-center justify-between bg-white/[0.01] mt-auto">
            <p className="text-[10px] font-mono text-slate-500">
              Showing {Math.min(offset + 1, historyData.total_generated)} to {Math.min(offset + limit, historyData.total_generated)} of {historyData.total_generated} certificates
            </p>
            <div className="flex gap-2">
              <button 
                onClick={handlePrevPage}
                disabled={offset === 0 || isLoading}
                className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button 
                onClick={handleNextPage}
                disabled={(offset + limit) >= historyData.total_generated || isLoading}
                className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistryTable;