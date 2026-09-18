import React, { useState, useEffect } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { useAdminToast } from '../../common/AdminToast';
import { settingsService } from '../../../../services';
import type { CheckoutSettings } from '../../../../types/admin';

export const CheckoutSettingsPage: React.FC = () => {
  const { showToast } = useAdminToast();

  const [checkout, setCheckout] = useState<CheckoutSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCheckout();
  }, []);

  const loadCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await settingsService.getCheckoutSettings();
      setCheckout(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load checkout settings.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = <K extends keyof CheckoutSettings>(key: K, val: CheckoutSettings[K]) => {
    if (!checkout) return;
    setCheckout({ ...checkout, [key]: val });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkout) return;
    setIsSaving(true);
    try {
      await settingsService.updateCheckoutSettings(checkout);
      showToast('Cash on Delivery checkout settings updated!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save checkout settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !checkout) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#1C4CB8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#8C8478]">Loading checkout configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Checkout & Cash on Delivery (COD) Settings"
        subtitle="Manage payment methods, required fields for courier delivery, and order confirmation messages."
        breadcrumbs={[{ label: 'System' }, { label: 'Checkout Settings' }]}
        actions={
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* COD Policy */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
            <div className="flex items-center gap-2 text-[#1C4CB8]">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="font-serif text-sm font-bold text-[#24221F]">
                Cash on Delivery Payment Mode
              </h3>
            </div>
            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={checkout.codEnabled}
                onChange={(e) => handleChange('codEnabled', e.target.checked)}
                className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">
              Checkout Title Display
            </label>
            <input
              type="text"
              value={checkout.codTitle}
              onChange={(e) => handleChange('codTitle', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">
              Payment Instruction Text
            </label>
            <textarea
              rows={2}
              value={checkout.codDescription}
              onChange={(e) => handleChange('codDescription', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>
        </div>

        {/* Customer Checkout Requirements */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-sm font-bold text-[#24221F] pb-2 border-b border-[#F4EFE6]">
            Required Customer Checkout Fields
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-[#E8E0D2] bg-[#FAF7F1]/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#24221F]">Mobile Phone Number</p>
                <p className="text-[11px] text-[#8C8478]">Essential for courier phone verification</p>
              </div>
              <input
                type="checkbox"
                checked={checkout.phoneRequired}
                onChange={(e) => handleChange('phoneRequired', e.target.checked)}
                className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
              />
            </div>

            <div className="p-3.5 rounded-xl border border-[#E8E0D2] bg-[#FAF7F1]/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#24221F]">Email Address</p>
                <p className="text-[11px] text-[#8C8478]">Optional for guest checkouts</p>
              </div>
              <input
                type="checkbox"
                checked={checkout.emailRequired}
                onChange={(e) => handleChange('emailRequired', e.target.checked)}
                className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">
                Minimum Order Value (৳)
              </label>
              <input
                type="number"
                min="0"
                value={checkout.minOrderValue}
                onChange={(e) => handleChange('minOrderValue', Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl font-bold"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="giftWrap"
                checked={checkout.allowGiftWrapping}
                onChange={(e) => handleChange('allowGiftWrapping', e.target.checked)}
                className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
              />
              <label htmlFor="giftWrap" className="text-xs font-bold text-[#24221F] cursor-pointer">
                Allow customers to add free gift note & recipient name
              </label>
            </div>
          </div>
        </div>

        {/* Confirmation Message */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-sm font-bold text-[#24221F] pb-2 border-b border-[#F4EFE6]">
            Order Placed Confirmation Message
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">
              Message shown on order confirmation screen
            </label>
            <textarea
              rows={3}
              value={checkout.orderConfirmationMessage}
              onChange={(e) => handleChange('orderConfirmationMessage', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
