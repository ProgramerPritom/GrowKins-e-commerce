import React, { useState, useEffect } from 'react';
import { Save, Camera, Users } from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { useAdminToast } from '../../common/AdminToast';
import { contentService } from '../../../../services';
import type { HomepageCMS } from '../../../../types/admin';

export const TestimonialsCmsPage: React.FC = () => {
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
      showToast('Failed to load testimonials content.', 'error');
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
      showToast('Community & UGC section settings saved!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save testimonials content.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !cms) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#1C4CB8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#8C8478]">Loading testimonials CMS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Testimonials & Community CMS"
        subtitle="Manage the 'Moments of Wonder' parent playroom mosaic and mindful community headlines."
        breadcrumbs={[{ label: 'Content CMS' }, { label: 'Testimonials' }]}
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
        {/* UGC Mosaic Box */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#D96F58]" />
              <h3 className="font-serif text-sm font-bold text-[#24221F]">
                UGC Parent Playroom Mosaic
              </h3>
            </div>
            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={cms.ugcMosaic.enabled}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    ugcMosaic: { ...cms.ugcMosaic, enabled: e.target.checked }
                  })
                }
                className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">Headline</label>
            <input
              type="text"
              value={cms.ugcMosaic.heading}
              onChange={(e) =>
                setCms({
                  ...cms,
                  ugcMosaic: { ...cms.ugcMosaic, heading: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">Subheading</label>
            <input
              type="text"
              value={cms.ugcMosaic.subheading}
              onChange={(e) =>
                setCms({
                  ...cms,
                  ugcMosaic: { ...cms.ugcMosaic, subheading: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">Social Tag Handle</label>
            <input
              type="text"
              value={cms.ugcMosaic.handle}
              onChange={(e) =>
                setCms({
                  ...cms,
                  ugcMosaic: { ...cms.ugcMosaic, handle: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>
        </div>

        {/* Community Box */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1C4CB8]" />
              <h3 className="font-serif text-sm font-bold text-[#24221F]">Community Section</h3>
            </div>
            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={cms.community.enabled}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    community: { ...cms.community, enabled: e.target.checked }
                  })
                }
                className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">Community Title</label>
            <input
              type="text"
              value={cms.community.heading}
              onChange={(e) =>
                setCms({
                  ...cms,
                  community: { ...cms.community, heading: e.target.value }
                })
              }
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">Community Subtitle</label>
            <input
              type="text"
              value={cms.community.subheading}
              onChange={(e) =>
                setCms({
                  ...cms,
                  community: { ...cms.community, subheading: e.target.value }
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
