import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useAdminRouter } from '../../../context/AdminRouterContext';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAdminAuth();
  const { navigate } = useAdminRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password, rememberMe });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please enter authorized admin email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail('growkins-admin@gmail.com');
    setPassword('growkins123');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F1] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#1C4CB8]/20">
      {/* Decorative Warm Background Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F28F79]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-80 h-80 bg-[#A3C1AD]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <div
            className="inline-flex items-baseline gap-1 cursor-pointer"
            onClick={() => (window.location.href = '/')}
          >
            <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#24221F]">
              GrowKins
            </span>
            <span className="w-2 h-2 rounded-full bg-[#F28F79]" />
          </div>
          <h2 className="mt-3 text-xs font-bold tracking-widest text-[#7D766C] uppercase">
            Store Administration Portal
          </h2>
        </div>

        {/* Login Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white border border-[#E8E0D2] py-8 px-6 shadow-md rounded-3xl sm:px-10"
        >
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-[#FBE8E5] border border-[#F28F79]/30 text-xs font-semibold text-[#B83A28] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8478]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="growkins-admin@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#E8E0D2] rounded-xl text-[#24221F] placeholder-[#9E9689] focus:outline-none focus:border-[#1C4CB8] focus:ring-2 focus:ring-[#1C4CB8]/10 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#24221F]">
                  Password
                </label>
                <span className="text-[11px] text-[#7D766C]">Min. 4 characters</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8478]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-white border border-[#E8E0D2] rounded-xl text-[#24221F] placeholder-[#9E9689] focus:outline-none focus:border-[#1C4CB8] focus:ring-2 focus:ring-[#1C4CB8]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8478] hover:text-[#24221F] p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[#635E55]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] focus:ring-[#1C4CB8]/20 accent-[#1C4CB8]"
                />
                <span>Stay signed in for 7 days</span>
              </label>

              <button
                type="button"
                onClick={handleQuickDemo}
                className="text-[#1C4CB8] hover:underline text-[11px] font-semibold cursor-pointer"
              >
                Auto-fill
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#1C4CB8] hover:bg-[#15398B] transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Credentials Helper */}
          <div className="mt-6 pt-5 border-t border-[#F4EFE6] text-center">
            <div className="bg-[#FAF7F1] border border-[#E8E0D2] p-3 rounded-2xl text-[11px] text-[#7D766C]">
              <p className="font-semibold text-[#24221F] flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-[#DDA428]" />
                Authorized Admin Credentials
              </p>
              <p className="mt-1">
                User: <span className="font-mono font-bold text-[#1C4CB8]">growkins-admin@gmail.com</span>
              </p>
              <p className="mt-0.5">
                Pass: <span className="font-mono font-bold text-[#1C4CB8]">growkins123</span>
              </p>
            </div>

            <div className="mt-4">
              <button
                onClick={() => (window.location.href = '/')}
                className="text-xs text-[#8C8478] hover:text-[#24221F] transition-colors cursor-pointer"
              >
                ← Back to customer storefront
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
