import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Check } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }
    setJoined(true);
    showToast('Welcome to GrowKins! Check your inbox for play ideas.');
  };

  return (
    <section className="py-14 sm:py-24 bg-[#FAF7F1] text-center border-b border-[#E8E0D2]/60">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        
        {/* Tiny decorative coral mark */}
        <div className="w-8 h-8 rounded-full bg-[#FCE8E3] text-[#F28F79] flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-4 h-4" />
        </div>

        <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#24221F] mb-3">
          A little more wonder in your inbox.
        </h2>

        <p className="text-xs sm:text-base text-[#6E6A63] leading-relaxed mb-6 sm:mb-8">
          New discoveries, thoughtful play ideas and things worth knowing. No daily spam, just gentle inspiration for family days.
        </p>

        {joined ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E6EFE9] text-[#4F7A5E] font-medium text-xs sm:text-sm border border-[#C9DEC0]">
            <Check className="w-4 h-4" />
            <span>Thank you for joining our community!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center max-w-md mx-auto relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full h-12 sm:h-14 pl-5 sm:pl-6 pr-24 sm:pr-28 rounded-full bg-white border border-[#D9D3C7] focus:outline-none focus:ring-2 focus:ring-[#1C4CB8]/30 text-xs sm:text-sm text-[#24221F] placeholder-[#A8A49C] shadow-xs"
              required
            />
            <button
              type="submit"
              className="absolute right-1.5 sm:right-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#24221F] text-white hover:bg-[#1C4CB8] text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              Join
            </button>
          </form>
        )}

        <div className="mt-4 text-[11px] text-[#A8A49C]">
          Unsubscribe anytime with a single click.
        </div>

      </div>
    </section>
  );
};
