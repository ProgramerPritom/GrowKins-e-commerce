import React, { useState, useEffect } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { useAdminToast } from '../../common/AdminToast';
import { contentService } from '../../../../services';
import type { HomepageCMS } from '../../../../types/admin';

export const TrustCmsPage: React.FC = () => {
  const { showToast } = useAdminToast();

  const [cms, setCms] = useState<HomepageCMS | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCms();
  }, []);

  const loadCms = async () => {
    setIsLoading(true);
    try {
      const res = await contentService.getHomepage();
      setCms(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load trust content.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cms) return;
    setIsSaving(true);
    try {
      await contentService.updateHomepage(cms);
      showToast('Brand Philosophy & Trust points updated!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save trust content.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !cms) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#1C4CB8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#8C8478]">Loading brand philosophy...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Trust & Brand Philosophy CMS"
        subtitle="Manage the safety certifications, non-toxic guarantees, and heirloom Montessori philosophy."
        breadcrumbs={[{ label: 'Content CMS' }, { label: 'Trust & Philosophy' }]}
        actions={
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
              <h3 className="font-serif text-sm font-bold text-[#24221F]">Brand Philosophy Section</h3>
            </div>
            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={cms.brandPhilosophy.enabled}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    brandPhilosophy: { ...cms.brandPhilosophy, enabled: e.target.checked }
                  })
                }
                className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">Section Title</label>
            <input
              type="text"
              value={cms.brandPhilosophy.heading}
              onChange={(e) =>
                setCms({
                  ...cms,
                  brandPhilosophy: { ...cms.brandPhilosophy, heading: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">Subheading</label>
            <textarea
              rows={2}
              value={cms.brandPhilosophy.subheading}
              onChange={(e) =>
                setCms({
                  ...cms,
                  brandPhilosophy: { ...cms.brandPhilosophy, subheading: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">
              Core Montessori Play Quote
            </label>
            <input
              type="text"
              value={cms.brandPhilosophy.quote}
              onChange={(e) =>
                setCms({
                  ...cms,
                  brandPhilosophy: { ...cms.brandPhilosophy, quote: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
