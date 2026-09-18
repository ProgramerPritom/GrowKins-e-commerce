import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { useAdminToast } from '../../common/AdminToast';
import { contentService } from '../../../../services';
import type { FooterCMS } from '../../../../types/admin';

export const FooterCmsPage: React.FC = () => {
  const { showToast } = useAdminToast();

  const [footer, setFooter] = useState<FooterCMS | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadFooter = async () => {
    setIsLoading(true);
    try {
      const res = await contentService.getFooter();
      setFooter(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load footer CMS.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFooter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = <K extends keyof FooterCMS>(key: K, val: FooterCMS[K]) => {
    if (!footer) return;
    setFooter({ ...footer, [key]: val });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footer) return;
    setIsSaving(true);
    try {
      await contentService.updateFooter(footer);
      showToast('Footer settings and contact information saved!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save footer.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !footer) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#1C4CB8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#8C8478]">Loading footer CMS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Footer & Contact Information CMS"
        subtitle="Manage footer brand statement, support contacts, address, social handles, and COD disclaimer."
        breadcrumbs={[{ label: 'Content CMS' }, { label: 'Footer' }]}
        actions={
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Footer'}</span>
          </button>
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand statement */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-sm font-bold text-[#24221F] pb-2 border-b border-[#F4EFE6]">
            Brand Mission & Taglines
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">Tagline</label>
            <input
              type="text"
              value={footer.brandTagline}
              onChange={(e) => handleChange('brandTagline', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">Brand Description</label>
            <textarea
              rows={2}
              value={footer.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">
              Cash on Delivery Trust Notice (Shown in Footer)
            </label>
            <input
              type="text"
              value={footer.codNoticeText}
              onChange={(e) => handleChange('codNoticeText', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">Copyright Statement</label>
            <input
              type="text"
              value={footer.copyrightText}
              onChange={(e) => handleChange('copyrightText', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>
        </div>

        {/* Contacts & Location */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-sm font-bold text-[#24221F] pb-2 border-b border-[#F4EFE6]">
            Dhaka Playroom & Support Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Support Phone</label>
              <input
                type="text"
                value={footer.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Support Email</label>
              <input
                type="email"
                value={footer.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Physical Address</label>
              <input
                type="text"
                value={footer.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Operating Hours</label>
              <input
                type="text"
                value={footer.hours}
                onChange={(e) => handleChange('hours', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-sm font-bold text-[#24221F] pb-2 border-b border-[#F4EFE6]">
            Social Channels & WhatsApp
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Facebook URL</label>
              <input
                type="url"
                value={footer.facebookUrl}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Instagram URL</label>
              <input
                type="url"
                value={footer.instagramUrl}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={footer.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
