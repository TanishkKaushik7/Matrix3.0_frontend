import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShieldCheck, 
  Ban,
  Wallet,
  X,
  CheckCircle2
} from 'lucide-react';
import Input from '../components/ui/Input';
import { getIssuers, updateIssuerStatus, whitelistWallet, type Issuer } from '../services/adminApi';

const AdminIssuers = () => {
  const [issuers, setIssuers] = useState<Issuer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Modal State for Whitelisting
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [selectedIssuer, setSelectedIssuer] = useState<Issuer | null>(null);
  const [walletInput, setWalletInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch only approved issuers
  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const data = await getIssuers('approved');
        setIssuers(data);
      } catch (err: any) {
        setError(err.message || "Failed to load verified issuers.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchApproved();
  }, []);

  const handleSuspend = async (id: string | number) => {
    try {
      // Suspend by moving them back to pending
      await updateIssuerStatus(id, 'pending');
      setIssuers(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error("Failed to suspend issuer", err);
      alert("Failed to suspend issuer.");
    }
  };

  const handleOpenWalletModal = (issuer: Issuer) => {
    setSelectedIssuer(issuer);
    setWalletInput(issuer.wallet_address || '');
    setWalletModalOpen(true);
  };

  const submitWhitelist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssuer || !walletInput.startsWith('0x') || walletInput.length !== 42) {
      alert("Please enter a valid Ethereum/Polygon wallet address starting with 0x (42 characters).");
      return;
    }

    setIsSubmitting(true);
    try {
      await whitelistWallet(selectedIssuer.id, walletInput);
      
      // Update local state to reflect the new wallet address
      setIssuers(prev => prev.map(i => 
        i.id === selectedIssuer.id ? { ...i, wallet_address: walletInput } : i
      ));
      
      setWalletModalOpen(false);
      setWalletInput('');
    } catch (err: any) {
      alert(err.message || "Failed to whitelist wallet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = issuers.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-3">
            Verified Issuers
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md border border-emerald-500/20">
              {issuers.length} Active
            </span>
          </h1>
          <p className="text-sm text-[#8A8F98] mt-1">
            Manage approved institutions and whitelist their Polygon Amoy wallet addresses.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#0A0A0C]/60 backdrop-blur-md border border-white/[0.06] p-3 rounded-2xl shadow-sm">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search verified institutions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={14} />}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0A0A0C]/60 backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-hidden shadow-[0_8px_16px_-6px_rgba(0,0,0,0.5)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.04] bg-white/[0.01]">
              {['Institution', 'Contact', 'Wallet Status', 'Actions'].map((h, i) => (
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
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[#8A8F98] text-sm">
                  Loading verified issuers...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-red-400 text-sm">
                  {error}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[#8A8F98] text-sm">
                  No verified issuers found.
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {filtered.map((org) => (
                  <motion.tr
                    key={org.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Institution */}
                    <td className="p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-sm font-medium text-white">{org.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#8A8F98] ml-5">ID: {org.id}</span>
                    </td>

                    {/* Contact */}
                    <td className="p-5">
                      <span className="text-xs font-mono text-[#8A8F98]">{org.email}</span>
                    </td>

                    {/* Wallet Status */}
                    <td className="p-5">
                      {org.wallet_address ? (
                        <div className="flex items-center gap-2 text-xs font-mono text-[#5E6AD2]">
                          <Wallet size={12} />
                          {org.wallet_address.substring(0, 6)}...{org.wallet_address.substring(38)}
                          <button 
                            onClick={() => handleOpenWalletModal(org)}
                            className="text-[10px] text-[#8A8F98] hover:text-white underline ml-2 transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleOpenWalletModal(org)}
                          className="flex items-center gap-1.5 text-xs font-medium text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-all"
                        >
                          <Wallet size={12} />
                          Link Wallet
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleSuspend(org.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#8A8F98] border border-white/[0.08] rounded-lg hover:text-amber-500 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all"
                        >
                          <Ban size={12} />
                          Suspend
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Whitelist Wallet Modal --- */}
      <AnimatePresence>
        {walletModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWalletModalOpen(false)}
              className="absolute inset-0 bg-[#050506]/80 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#0A0A0C] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#5E6AD2]/50 to-transparent" />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Whitelist Wallet</h2>
                    <p className="text-xs text-[#8A8F98]">
                      Link a Polygon Amoy address for <span className="text-white font-medium">{selectedIssuer?.name}</span>.
                    </p>
                  </div>
                  <button 
                    onClick={() => setWalletModalOpen(false)}
                    className="p-1 text-[#8A8F98] hover:text-white transition-colors rounded-md"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={submitWhitelist} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[#8A8F98] ml-1">
                      Polygon Address (0x...)
                    </label>
                    <div className="relative">
                      <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5E6AD2]" size={16} />
                      <input 
                        required
                        type="text"
                        value={walletInput}
                        onChange={(e) => setWalletInput(e.target.value)}
                        placeholder="0x..."
                        className="w-full bg-[#0F0F12] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-[#EDEDEF] focus:ring-2 focus:ring-[#5E6AD2]/30 focus:border-[#5E6AD2] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setWalletModalOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-[#8A8F98] hover:text-white hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 rounded-xl bg-[#5E6AD2] hover:bg-[#6872D9] text-white text-sm font-medium transition-all shadow-[0_0_20px_rgba(94,106,210,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          Save Wallet
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminIssuers;