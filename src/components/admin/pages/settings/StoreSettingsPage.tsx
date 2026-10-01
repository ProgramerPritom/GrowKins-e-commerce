import React, { useState, useEffect } from 'react';
import { Save, Store } from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { FormSkeleton, InlineLoadingSpinner } from '../../../common/LoadingSkeleton';
import { useAdminToast } from '../../common/AdminToast';
import { settingsService } from '../../../../services';
import type { StoreSettings } from '../../../../types/admin';

export const StoreSettingsPage: React.FC = () => {
  const { toast } = useAdminToast();

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await settingsService.getStoreSettings();
      setSettings(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load store settings from Google Sheets.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = <K extends keyof StoreSettings>(key: K, val: StoreSettings[K]) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: val });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    try {
      await settingsService.updateStoreSettings(settings);
      toast.success('Store settings saved and synced to Google Sheets!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save store settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="space-y-6 max-w-4xl">
        <PageHeader
          title="Store Profile & Brand Settings"
          subtitle="Manage store identity, operational contacts, currency, and social presence."
          breadcrumbs={[{ label: 'Settings' }, { label: 'Store' }]}
        />
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Store Profile & Brand Settings"
        subtitle="Manage store identity, operational contacts, currency, and social presence."
        breadcrumbs={[{ label: 'System' }, { label: 'Store Settings' }]}
        actions={
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <InlineLoadingSpinner text="Saving to Sheets..." />
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand identity */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F4EFE6] text-[#1C4CB8]">
            <Store className="w-4 h-4" />
            <h3 className="font-serif text-sm font-bold text-[#24221F]">Brand Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Store Tagline</label>
              <input
                type="text"
                value={settings.storeTagline}
                onChange={(e) => handleChange('storeTagline', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Currency Code</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settings.currencySymbol}
                onChange={(e) => handleChange('currencySymbol', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl font-bold"
              />
            </div>
          </div>
        </div>

        {/* Support & Contact */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-sm font-bold text-[#24221F] pb-2 border-b border-[#F4EFE6]">
            Customer Support & Headquarters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Customer Care Phone</label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => handleChange('supportPhone', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Customer Care Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">Office Address</label>
            <input
              type="text"
              value={settings.officeAddress}
              onChange={(e) => handleChange('officeAddress', e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
