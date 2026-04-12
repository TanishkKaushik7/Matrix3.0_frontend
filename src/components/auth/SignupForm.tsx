import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Building2, MapPin, Hash, Phone, Mail, Lock, Link as LinkIcon } from 'lucide-react';
import { registerIssuer } from '../../services/issuerApi';

const SignupForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State mapping exactly to your FastAPI schema
  const [formData, setFormData] = useState({
    college_name: '',
    college_address: '',
    college_id: '',
    document: '', // Expecting a URL for now based on your JSON
    document_id: '',
    phone_number: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await registerIssuer(formData);
      setSuccess(true);
      
      // Redirect to login after 2 seconds so they can read the success message
      setTimeout(() => {
        navigate('/login');
      }, 2500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-8 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 size={24} className="text-emerald-500" />
        </div>
        <h3 className="text-xl font-semibold text-white">Application Submitted</h3>
        <p className="text-sm text-[#8A8F98] leading-relaxed">
          Your registration for <span className="text-white font-medium">{formData.college_name}</span> is now pending review. You will be redirected to the login page momentarily.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-xs">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Row 1: Name & ID */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1">Institution Name</label>
          <div className="relative group">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5E6AD2] transition-colors" size={14} />
            <input required name="college_name" value={formData.college_name} onChange={handleChange} placeholder="ABC University" className="w-full bg-[#0F0F12] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-[#5E6AD2]/50 focus:border-[#5E6AD2] outline-none transition-all" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1">College ID</label>
          <div className="relative group">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#d2a25e] transition-colors" size={14} />
            <input required name="college_id" value={formData.college_id} onChange={handleChange} placeholder="ABC-IND-001" className="w-full bg-[#0F0F12] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-[#5E6AD2]/50 focus:border-[#5E6AD2] outline-none transition-all font-mono" />
          </div>
        </div>
      </div>

      {/* Full Width: Address */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1">Full Address</label>
        <div className="relative group">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#d2ad5e] transition-colors" size={14} />
          <input required name="college_address" value={formData.college_address} onChange={handleChange} placeholder="MG Road, Indore" className="w-full bg-[#0F0F12] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-[#5E6AD2]/50 focus:border-[#5E6AD2] outline-none transition-all" />
        </div>
      </div>

      {/* Row 2: Doc URL & Doc ID */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1">Affiliation Doc URL</label>
          <div className="relative group">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5E6AD2] transition-colors" size={14} />
            <input required type="url" name="document" value={formData.document} onChange={handleChange} placeholder="https://..." className="w-full bg-[#0F0F12] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-[#5E6AD2]/50 focus:border-[#5E6AD2] outline-none transition-all" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1">Document ID</label>
          <div className="relative group">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5E6AD2] transition-colors" size={14} />
            <input required name="document_id" value={formData.document_id} onChange={handleChange} placeholder="DOC-2026-001" className="w-full bg-[#0F0F12] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-[#5E6AD2]/50 focus:border-[#5E6AD2] outline-none transition-all font-mono" />
          </div>
        </div>
      </div>

      {/* Row 3: Phone & Email */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1">Phone Number</label>
          <div className="relative group">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5E6AD2] transition-colors" size={14} />
            <input required type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="+91 98765 43210" className="w-full bg-[#0F0F12] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-[#5E6AD2]/50 focus:border-[#5E6AD2] outline-none transition-all font-mono" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1">Admin Email</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5E6AD2] transition-colors" size={14} />
            <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="issuer@abc.edu" className="w-full bg-[#0F0F12] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-[#5E6AD2]/50 focus:border-[#5E6AD2] outline-none transition-all" />
          </div>
        </div>
      </div>

      {/* Full Width: Password */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1">Master Password</label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5E6AD2] transition-colors" size={14} />
          <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••••••" className="w-full bg-[#0F0F12] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-[#5E6AD2]/50 focus:border-[#5E6AD2] outline-none transition-all" />
        </div>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full mt-4 bg-[#d29a4b] text-white hover:bg-[#f19721] disabled:bg-slate-800 disabled:text-slate-500 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Submit Application'}
      </button>
    </form>
  );
};

export default SignupForm;