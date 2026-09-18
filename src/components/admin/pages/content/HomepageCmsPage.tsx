import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Sparkles } from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { MediaPicker } from '../../common/MediaPicker';
import { useAdminToast } from '../../common/AdminToast';
import { contentService } from '../../../../services';
import type { HomepageCMS, HeroSlideCMS } from '../../../../types/admin';

export const HomepageCmsPage: React.FC = () => {
  const { showToast } = useAdminToast();

  const [cms, setCms] = useState<HomepageCMS | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const loadCms = async () => {
    setIsLoading(true);
    try {
      const res = await contentService.getHomepage();
      setCms(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load homepage CMS content.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHeroChange = <K extends keyof HomepageCMS['hero']>(
    key: K,
    value: HomepageCMS['hero'][K]
  ) => {
    if (!cms) return;
    setCms({
      ...cms,
      hero: { ...cms.hero, [key]: value }
    });
  };

  const handleSectionToggle = (sectionKey: keyof HomepageCMS, enabled: boolean) => {
    if (!cms) return;
    setCms({
      ...cms,
      [sectionKey]: { ...(cms[sectionKey] as any), enabled }
    });
  };

  const handleAddSlide = (asset: { url: string; alt?: string }) => {
    if (!cms) return;
    const newSlide: HeroSlideCMS = {
      id: `slide-${Date.now()}`,
      image: asset.url,
      badgeAge: '0–6Y',
      badgeTitle: 'Heirloom Wooden Play',
      badgeSubtitle: 'Montessori Development',
      alt: asset.alt || 'Montessori toy showcase',
      enabled: true,
      sortOrder: cms.hero.slides.length + 1
    };
    handleHeroChange('slides', [...cms.hero.slides, newSlide]);
  };

  const handleRemoveSlide = (slideId: string) => {
    if (!cms) return;
    handleHeroChange('slides', cms.hero.slides.filter((s) => s.id !== slideId));
  };

  const handleSave = async () => {
    if (!cms) return;
    setIsSaving(true);
    try {
      await contentService.updateHomepage(cms);
      showToast('Homepage CMS saved! Changes persist across sessions.');
    } catch (err) {
      console.error(err);
      showToast('Failed to update homepage content.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !cms) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#1C4CB8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#8C8478]">Loading homepage configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Homepage Content Management"
        subtitle="Manage Montessori hero slider, headlines, trust bullet points, and section visibility."
        breadcrumbs={[{ label: 'Content CMS' }, { label: 'Homepage' }]}
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

      {/* 1. Hero Section Card */}
      <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F28F79]" />
            <h3 className="font-serif text-base font-bold text-[#24221F]">Hero Playroom Section</h3>
          </div>
          <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={cms.hero.enabled}
              onChange={(e) => handleHeroChange('enabled', e.target.checked)}
              className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
            />
            <span>Enabled</span>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">Eyebrow Badge</label>
            <input
              type="text"
              value={cms.hero.eyebrow}
              onChange={(e) => handleHeroChange('eyebrow', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">Main Headline</label>
            <input
              type="text"
              value={cms.hero.headline}
              onChange={(e) => handleHeroChange('headline', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-serif font-bold text-base border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">Subheadline Description</label>
            <textarea
              rows={2}
              value={cms.hero.subheadline}
              onChange={(e) => handleHeroChange('subheadline', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Primary Button Label</label>
              <input
                type="text"
                value={cms.hero.primaryCtaLabel}
                onChange={(e) => handleHeroChange('primaryCtaLabel', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Secondary Button Label</label>
              <input
                type="text"
                value={cms.hero.secondaryCtaLabel}
                onChange={(e) => handleHeroChange('secondaryCtaLabel', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Trust Bullet #1</label>
              <input
                type="text"
                value={cms.hero.trustBullet1}
                onChange={(e) => handleHeroChange('trustBullet1', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Trust Bullet #2</label>
              <input
                type="text"
                value={cms.hero.trustBullet2}
                onChange={(e) => handleHeroChange('trustBullet2', e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Hero Slides List */}
        <div className="pt-4 border-t border-[#F4EFE6] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif text-sm font-bold text-[#24221F]">
                Hero Slider Carousel Images ({cms.hero.slides.length})
              </h4>
              <p className="text-xs text-[#8C8478]">Rotating slide pictures and Montessori milestone tags.</p>
            </div>
            <button
              type="button"
              onClick={() => setMediaPickerOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1C4CB8] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slide</span>
            </button>
          </div>

          <div className="space-y-3">
            {cms.hero.slides.map((slide) => (
              <div
                key={slide.id}
                className="p-3 rounded-xl border border-[#E8E0D2] bg-[#FAF7F1]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-16 h-12 rounded-lg object-cover border border-[#E8E0D2] shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-[#1C4CB8] bg-[#E7EDFB] px-2 py-0.5 rounded-full">
                      {slide.badgeAge}
                    </span>
                    <p className="text-xs font-bold text-[#24221F] mt-1">{slide.badgeTitle}</p>
                    <p className="text-[11px] text-[#7D766C]">{slide.badgeSubtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleRemoveSlide(slide.id)}
                    className="text-[#8C8478] hover:text-[#B83A28] p-1.5 cursor-pointer"
                    title="Remove slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Other Homepage Sections Visibility & Titles */}
      <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-serif text-base font-bold text-[#24221F] pb-3 border-b border-[#F4EFE6]">
          Homepage Section Visibility & Titles
        </h3>

        <div className="space-y-4 divide-y divide-[#F4EFE6]">
          {/* Stages */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-[#24221F] mb-1">
                Shop by Stage Section
              </label>
              <input
                type="text"
                value={cms.stages.heading}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    stages: { ...cms.stages, heading: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>
            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer pt-4">
              <input
                type="checkbox"
                checked={cms.stages.enabled}
                onChange={(e) => handleSectionToggle('stages', e.target.checked)}
                className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
              />
              <span>Enabled</span>
            </label>
          </div>

          {/* Trending */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-[#24221F] mb-1">
                Trending Items Slider
              </label>
              <input
                type="text"
                value={cms.trending.heading}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    trending: { ...cms.trending, heading: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>
            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer pt-4">
              <input
                type="checkbox"
                checked={cms.trending.enabled}
                onChange={(e) => handleSectionToggle('trending', e.target.checked)}
                className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
              />
              <span>Enabled</span>
            </label>
          </div>

          {/* Play Personalities */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-[#24221F] mb-1">
                Play Personalities Grid
              </label>
              <input
                type="text"
                value={cms.personalities.heading}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    personalities: { ...cms.personalities, heading: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>
            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer pt-4">
              <input
                type="checkbox"
                checked={cms.personalities.enabled}
                onChange={(e) => handleSectionToggle('personalities', e.target.checked)}
                className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
              />
              <span>Enabled</span>
            </label>
          </div>

          {/* UGC Mosaic */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-[#24221F] mb-1">
                Moments of Wonder (UGC Mosaic)
              </label>
              <input
                type="text"
                value={cms.ugcMosaic.heading}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    ugcMosaic: { ...cms.ugcMosaic, heading: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>
            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer pt-4">
              <input
                type="checkbox"
                checked={cms.ugcMosaic.enabled}
                onChange={(e) => handleSectionToggle('ugcMosaic', e.target.checked)}
                className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
              />
              <span>Enabled</span>
            </label>
          </div>

          {/* Recommendation Quiz */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-[#24221F] mb-1">
                Recommendation Quiz Banner
              </label>
              <input
                type="text"
                value={cms.recommendationQuiz.heading}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    recommendationQuiz: { ...cms.recommendationQuiz, heading: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-[#E8E0D2] rounded-xl"
              />
            </div>
            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer pt-4">
              <input
                type="checkbox"
                checked={cms.recommendationQuiz.enabled}
                onChange={(e) => handleSectionToggle('recommendationQuiz', e.target.checked)}
                className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
              />
              <span>Enabled</span>
            </label>
          </div>
        </div>
      </div>

      <MediaPicker
        isOpen={mediaPickerOpen}
        onSelect={handleAddSlide}
        onClose={() => setMediaPickerOpen(false)}
        title="Select Slide Image"
      />
    </div>
  );
};
