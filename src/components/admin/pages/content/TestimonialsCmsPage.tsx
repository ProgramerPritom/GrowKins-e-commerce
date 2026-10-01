import React, { useState, useEffect } from 'react';
import {
  Save,
  Camera,
  Users,
  Plus,
  Trash2,
  Edit2,
  Star,
  Quote,
  Check,
  X,
  Sparkles,
  MapPin
} from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { useAdminToast } from '../../common/AdminToast';
import { contentService } from '../../../../services';
import type { HomepageCMS, TestimonialItem } from '../../../../types/admin';

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
];

export const TestimonialsCmsPage: React.FC = () => {
  const { showToast } = useAdminToast();

  const [cms, setCms] = useState<HomepageCMS | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modal / Form state for adding/editing a testimonial
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cms) return;
    setIsSaving(true);
    try {
      await contentService.updateHomepage(cms);
      showToast('Testimonials & community settings saved successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save testimonials content.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const openNewModal = () => {
    setEditingItem({
      id: `t-${Date.now()}`,
      author: '',
      role: 'Parent of toddler',
      location: 'Dhaka, Bangladesh',
      quote: '',
      avatar: DEFAULT_AVATARS[0],
      rating: 5,
      enabled: true,
      sortOrder: (cms?.ugcMosaic?.testimonials?.length ?? 0) + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: TestimonialItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveTestimonialModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cms || !editingItem) return;
    if (!editingItem.author.trim() || !editingItem.quote.trim()) {
      showToast('Please provide both author name and quote text.', 'warning');
      return;
    }

    const currentList = cms.ugcMosaic?.testimonials ?? [];
    const exists = currentList.some((t) => t.id === editingItem.id);

    let updatedList: TestimonialItem[];
    if (exists) {
      updatedList = currentList.map((t) => (t.id === editingItem.id ? editingItem : t));
    } else {
      updatedList = [...currentList, editingItem];
    }

    setCms({
      ...cms,
      ugcMosaic: {
        ...cms.ugcMosaic,
        testimonials: updatedList
      }
    });

    setIsModalOpen(false);
    setEditingItem(null);
    showToast(exists ? 'Testimonial updated!' : 'Testimonial added! Click Save Changes to sync.');
  };

  const handleDeleteTestimonial = (id: string) => {
    if (!cms) return;
    const currentList = cms.ugcMosaic?.testimonials ?? [];
    const updatedList = currentList.filter((t) => t.id !== id);
    setCms({
      ...cms,
      ugcMosaic: {
        ...cms.ugcMosaic,
        testimonials: updatedList
      }
    });
    showToast('Testimonial removed.');
  };

  const handleToggleEnabled = (id: string) => {
    if (!cms) return;
    const currentList = cms.ugcMosaic?.testimonials ?? [];
    const updatedList = currentList.map((t) =>
      t.id === id ? { ...t, enabled: t.enabled === false ? true : false } : t
    );
    setCms({
      ...cms,
      ugcMosaic: {
        ...cms.ugcMosaic,
        testimonials: updatedList
      }
    });
  };

  if (isLoading || !cms) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#1C4CB8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#8C8478]">Loading testimonials CMS...</p>
      </div>
    );
  }

  const testimonials = cms.ugcMosaic?.testimonials ?? [];

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <PageHeader
        title="Testimonials & Community CMS"
        subtitle="Manage the 'Moments of Wonder' parent playroom reviews, star ratings, and mindful community headlines."
        breadcrumbs={[{ label: 'Content CMS' }, { label: 'Testimonials' }]}
        actions={
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        }
      />

      <div className="space-y-6">
        {/* Dynamic Testimonials List Box */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
            <div>
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-[#1C4CB8]" />
                <h3 className="font-serif text-sm font-bold text-[#24221F]">
                  Customer Reviews & Playroom Testimonials ({testimonials.length})
                </h3>
              </div>
              <p className="text-[11px] text-[#8C8478] mt-0.5">
                These testimonials display dynamically in the homepage &quot;Moments of Wonder&quot; section.
              </p>
            </div>
            <button
              type="button"
              onClick={openNewModal}
              className="px-3.5 py-1.5 rounded-xl bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Testimonial</span>
            </button>
          </div>

          {testimonials.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-[#E8E0D2] rounded-xl">
              <Quote className="w-8 h-8 text-[#A67E14]/40 mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#24221F]">No testimonials added yet</p>
              <p className="text-[11px] text-[#8C8478] max-w-sm mx-auto mt-1 mb-4">
                Add reviews from verified parents in Dhaka, Chittagong, Sylhet to build authentic trust.
              </p>
              <button
                type="button"
                onClick={openNewModal}
                className="px-4 py-2 rounded-xl bg-[#FAF7F1] border border-[#D0C8BA] hover:bg-[#F4EFE6] text-xs font-bold text-[#24221F] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Testimonial</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    item.enabled !== false
                      ? 'bg-[#FAF7F1]/60 border-[#E8E0D2] hover:border-[#1C4CB8]/40'
                      : 'bg-[#F4EFE6]/40 border-[#E8E0D2]/50 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Avatar, Author, Rating */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.avatar || DEFAULT_AVATARS[0]}
                          alt={item.author}
                          className="w-10 h-10 rounded-full object-cover border border-[#E8E0D2] shrink-0 bg-white"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATARS[0];
                          }}
                        />
                        <div>
                          <p className="text-xs font-bold text-[#24221F] leading-tight">
                            {item.author}
                          </p>
                          <p className="text-[10px] text-[#7D766C]">{item.role}</p>
                          <p className="text-[10px] text-[#A67E14] flex items-center gap-1 mt-0.5 font-medium">
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            <span>{item.location}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-[#F28F79]">
                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>

                    {/* Quote */}
                    <blockquote className="text-xs text-[#4A463F] italic leading-relaxed pl-2 border-l-2 border-[#1C4CB8]/30">
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E8E0D2]/60">
                    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#635E55] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.enabled !== false}
                        onChange={() => handleToggleEnabled(item.id)}
                        className="w-3.5 h-3.5 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
                      />
                      <span>{item.enabled !== false ? 'Active' : 'Hidden'}</span>
                    </label>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg text-[#635E55] hover:text-[#1C4CB8] hover:bg-[#E7EDFB] transition-colors cursor-pointer"
                        title="Edit testimonial"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTestimonial(item.id)}
                        className="p-1.5 rounded-lg text-[#635E55] hover:text-[#B83A28] hover:bg-[#FBE8E5] transition-colors cursor-pointer"
                        title="Delete testimonial"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* UGC Mosaic Header Settings */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#D96F58]" />
              <h3 className="font-serif text-sm font-bold text-[#24221F]">
                UGC Parent Playroom Mosaic Section
              </h3>
            </div>
            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={cms.ugcMosaic?.enabled ?? true}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Section Headline</label>
              <input
                type="text"
                value={cms.ugcMosaic?.heading ?? ''}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    ugcMosaic: { ...cms.ugcMosaic, heading: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8] bg-[#FAF7F1]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Social Tag Handle</label>
              <input
                type="text"
                value={cms.ugcMosaic?.handle ?? ''}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    ugcMosaic: { ...cms.ugcMosaic, handle: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8] bg-[#FAF7F1]/30"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#24221F] mb-1">Section Subheading</label>
              <input
                type="text"
                value={cms.ugcMosaic?.subheading ?? ''}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    ugcMosaic: { ...cms.ugcMosaic, subheading: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8] bg-[#FAF7F1]/30"
              />
            </div>
          </div>
        </div>

        {/* Community Box */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1C4CB8]" />
              <h3 className="font-serif text-sm font-bold text-[#24221F]">
                Mindful Parenting Community Box
              </h3>
            </div>
            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={cms.community?.enabled ?? true}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Community Title</label>
              <input
                type="text"
                value={cms.community?.heading ?? ''}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    community: { ...cms.community, heading: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8] bg-[#FAF7F1]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">Community Subtitle</label>
              <input
                type="text"
                value={cms.community?.subheading ?? ''}
                onChange={(e) =>
                  setCms({
                    ...cms,
                    community: { ...cms.community, subheading: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8] bg-[#FAF7F1]/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Add/Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-[#24221F]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E0D2] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#F4EFE6] flex items-center justify-between bg-[#FAF7F1]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1C4CB8]" />
                <h4 className="font-serif text-sm font-bold text-[#24221F]">
                  {editingItem.id && testimonials.some((t) => t.id === editingItem.id)
                    ? 'Edit Parent Testimonial'
                    : 'Add New Parent Testimonial'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#8C8478] hover:text-[#24221F] hover:bg-[#E8E0D2]/50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonialModal} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#24221F] mb-1">
                    Author / Parent Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farhana Ahmed"
                    value={editingItem.author}
                    onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24221F] mb-1">
                    Role / Child Age
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mum of 2Y toddler"
                    value={editingItem.role}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24221F] mb-1">
                    Location in Bangladesh
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dhanmondi, Dhaka"
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24221F] mb-1">Star Rating</label>
                  <select
                    value={editingItem.rating || 5}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, rating: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8] bg-white cursor-pointer"
                  >
                    <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                    <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24221F] mb-1">
                  Testimonial Quote *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share what the parent said about your wooden heirloom play sets..."
                  value={editingItem.quote}
                  onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8] resize-none"
                />
              </div>

              {/* Avatar Preset or URL */}
              <div>
                <label className="block text-xs font-bold text-[#24221F] mb-1">
                  Parent Avatar Photo URL
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={editingItem.avatar || DEFAULT_AVATARS[0]}
                    alt="Preview"
                    className="w-10 h-10 rounded-full object-cover border border-[#E8E0D2] shrink-0 bg-[#FAF7F1]"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATARS[0];
                    }}
                  />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={editingItem.avatar}
                    onChange={(e) => setEditingItem({ ...editingItem, avatar: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-[#8C8478]">Presets:</span>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {DEFAULT_AVATARS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, avatar: url })}
                        className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                          editingItem.avatar === url ? 'border-[#1C4CB8] scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={url}
                          alt="preset"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F4EFE6] flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.enabled !== false}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, enabled: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
                  />
                  <span>Show on Homepage</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#D0C8BA] hover:bg-[#F4EFE6] text-xs font-semibold text-[#635E55] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
