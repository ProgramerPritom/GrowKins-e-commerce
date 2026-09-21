import React, { useState, useEffect } from 'react';
import {
  Save,
  ExternalLink,
  Smartphone,
  Monitor,
  Eye
} from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { useAdminToast } from '../../common/AdminToast';
import { MockDatabase } from '../../../../lib/mockDb/MockDatabase';
import { clothingService } from '../../../../services';
import type { ClothingHomepageCMS } from '../../../../types/clothing';

export const ClothingHomepageCmsPage: React.FC = () => {
  const { showToast } = useAdminToast();
  const [content, setContent] = useState<ClothingHomepageCMS | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const loadData = async () => {
    setLoading(true);
    const data = await clothingService.getHomepageContent();
    setContent(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const unsub = MockDatabase.subscribe(loadData);
    return () => unsub();
  }, []);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      await clothingService.updateHomepageContent(content);
      showToast('Clothing homepage content published', 'success');
    } catch {
      showToast('Failed to update homepage content', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="py-24 text-center text-xs text-[#857E73]">
        Loading homepage content CMS...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      <PageHeader
        title="Clothing Boutique Homepage CMS"
        subtitle="Control editorial imagery, Little Wardrobe hero headlines, material stories, and live preview."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.open('/clothing', '_blank')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#524E47] bg-white border border-[#E8E2D5] rounded-xl hover:bg-[#FAF7F1] cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Storefront</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#C85A32] rounded-xl hover:bg-[#B24E2A] cursor-pointer shadow-2xs"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Publishing...' : 'Publish Content'}</span>
            </button>
          </div>
        }
      />

      {/* Mode Switcher: Editor vs Live Preview */}
      <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-[#171715] text-white shadow-xs'
                : 'bg-white border border-[#E8E2D5] text-[#524E47] hover:bg-[#FAF7F1]'
            }`}
          >
            Editorial Content Settings
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-[#171715] text-white shadow-xs'
                : 'bg-white border border-[#E8E2D5] text-[#524E47] hover:bg-[#FAF7F1]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Boutique Preview</span>
          </button>
        </div>

        {activeTab === 'preview' && (
          <div className="flex items-center gap-1 bg-[#FAF7F1] p-1 rounded-xl border border-[#E8E2D5]">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                previewDevice === 'desktop'
                  ? 'bg-white text-[#171715] shadow-2xs font-bold'
                  : 'text-[#857E73] hover:text-[#171715]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                previewDevice === 'mobile'
                  ? 'bg-white text-[#171715] shadow-2xs font-bold'
                  : 'text-[#857E73] hover:text-[#171715]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>
        )}
      </div>

      {activeTab === 'editor' ? (
        <div className="space-y-6">
          {/* Hero Section Card */}
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-6 shadow-2xs space-y-4">
            <h2 className="font-serif font-bold text-base text-[#171715]">
              Section 1 · Hero / The Little Wardrobe
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Eyebrow Label
                </label>
                <input
                  type="text"
                  value={content.hero.eyebrow}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, eyebrow: e.target.value }
                    })
                  }
                  className="w-full h-9 px-3 rounded-xl border border-[#E8E2D5]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Primary Headline
                </label>
                <input
                  type="text"
                  value={content.hero.headline}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, headline: e.target.value }
                    })
                  }
                  className="w-full h-9 px-3 rounded-xl border border-[#E8E2D5]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#171715] mb-1">
                  Subheadline / Editorial Description
                </label>
                <textarea
                  rows={2}
                  value={content.hero.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, description: e.target.value }
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D5]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Primary CTA Text
                </label>
                <input
                  type="text"
                  value={content.hero.primaryCtaText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, primaryCtaText: e.target.value }
                    })
                  }
                  className="w-full h-9 px-3 rounded-xl border border-[#E8E2D5]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Secondary CTA Text
                </label>
                <input
                  type="text"
                  value={content.hero.secondaryCtaText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, secondaryCtaText: e.target.value }
                    })
                  }
                  className="w-full h-9 px-3 rounded-xl border border-[#E8E2D5]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#171715] mb-1">
                  Desktop Hero Editorial Photography URL
                </label>
                <input
                  type="text"
                  value={content.hero.desktopImage}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, desktopImage: e.target.value }
                    })
                  }
                  className="w-full h-9 px-3 rounded-xl border border-[#E8E2D5]"
                />
              </div>
            </div>
          </div>

          {/* Material Story Card */}
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-6 shadow-2xs space-y-4">
            <h2 className="font-serif font-bold text-base text-[#171715]">
              Section 2 · Material Story ("Feels Good, Too.")
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={content.materialStory.headline}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      materialStory: { ...content.materialStory, headline: e.target.value }
                    })
                  }
                  className="w-full h-9 px-3 rounded-xl border border-[#E8E2D5]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Subheadline / Skin-Sensitivity Rationale
                </label>
                <textarea
                  rows={2}
                  value={content.materialStory.subheadline}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      materialStory: { ...content.materialStory, subheadline: e.target.value }
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-[#E8E2D5]"
                />
              </div>
            </div>
          </div>

          {/* Seasonal Campaign Card */}
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-6 shadow-2xs space-y-4">
            <h2 className="font-serif font-bold text-base text-[#171715]">
              Section 3 · Seasonal Campaign Banner
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={content.seasonalEditorial.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      seasonalEditorial: {
                        ...content.seasonalEditorial,
                        title: e.target.value
                      }
                    })
                  }
                  className="w-full h-9 px-3 rounded-xl border border-[#E8E2D5]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171715] mb-1">
                  CTA Label
                </label>
                <input
                  type="text"
                  value={content.seasonalEditorial.ctaText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      seasonalEditorial: {
                        ...content.seasonalEditorial,
                        ctaText: e.target.value
                      }
                    })
                  }
                  className="w-full h-9 px-3 rounded-xl border border-[#E8E2D5]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#171715] mb-1">
                  Campaign Banner Photography URL
                </label>
                <input
                  type="text"
                  value={content.seasonalEditorial.image}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      seasonalEditorial: {
                        ...content.seasonalEditorial,
                        image: e.target.value
                      }
                    })
                  }
                  className="w-full h-9 px-3 rounded-xl border border-[#E8E2D5]"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LIVE BOUTIQUE PREVIEW */
        <div className="flex justify-center bg-[#ECE6DA] p-4 sm:p-8 rounded-2xl border border-[#E8E2D5] overflow-hidden">
          <div
            className={`transition-all duration-300 bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#171715]/10 ${
              previewDevice === 'mobile'
                ? 'w-[375px] h-[720px] rounded-[36px] border-8 border-[#171715]'
                : 'w-full max-w-5xl h-[760px]'
            }`}
          >
            <iframe
              src="/clothing"
              title="Live Boutique Preview"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};
