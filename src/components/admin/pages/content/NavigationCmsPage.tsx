import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Navigation, Bell } from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { useAdminToast } from '../../common/AdminToast';
import { contentService } from '../../../../services';
import type { NavigationCMS, NavigationMenuItem } from '../../../../types/admin';

export const NavigationCmsPage: React.FC = () => {
  const { showToast } = useAdminToast();

  const [navData, setNavData] = useState<NavigationCMS | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadNav = async () => {
    setIsLoading(true);
    try {
      const res = await contentService.getNavigation();
      setNavData(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load navigation configuration.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNav();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnnouncementChange = <K extends keyof NavigationCMS['announcementBar']>(
    key: K,
    val: NavigationCMS['announcementBar'][K]
  ) => {
    if (!navData) return;
    setNavData({
      ...navData,
      announcementBar: { ...navData.announcementBar, [key]: val }
    });
  };

  const handleAddMenuItem = () => {
    if (!navData) return;
    const newItem: NavigationMenuItem = {
      id: `nav-${Date.now()}`,
      label: 'New Link',
      path: '/shop',
      enabled: true,
      sortOrder: navData.menuItems.length + 1
    };
    setNavData({
      ...navData,
      menuItems: [...navData.menuItems, newItem]
    });
  };

  const handleMenuItemChange = (index: number, field: keyof NavigationMenuItem, val: any) => {
    if (!navData) return;
    const updated = [...navData.menuItems];
    updated[index] = { ...updated[index], [field]: val };
    setNavData({ ...navData, menuItems: updated });
  };

  const handleRemoveMenuItem = (index: number) => {
    if (!navData) return;
    setNavData({
      ...navData,
      menuItems: navData.menuItems.filter((_, i) => i !== index)
    });
  };

  const handleSave = async () => {
    if (!navData) return;
    setIsSaving(true);
    try {
      await contentService.updateNavigation(navData);
      showToast('Navigation & Announcement Bar settings saved!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save navigation.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !navData) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#1C4CB8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#8C8478]">Loading navigation CMS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Navigation & Announcement Bar CMS"
        subtitle="Control the top promotional ticker and header mega menu links."
        breadcrumbs={[{ label: 'Content CMS' }, { label: 'Navigation' }]}
        actions={
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-[#1C4CB8] hover:bg-[#15398B] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Navigation'}</span>
          </button>
        }
      />

      {/* Top Announcement Bar */}
      <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#DDA428]" />
            <h3 className="font-serif text-sm font-bold text-[#24221F]">Top Announcement Bar</h3>
          </div>
          <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={navData.announcementBar.enabled}
              onChange={(e) => handleAnnouncementChange('enabled', e.target.checked)}
              className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
            />
            <span>Enabled</span>
          </label>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">
              English Message (Free Shipping / COD notice)
            </label>
            <input
              type="text"
              value={navData.announcementBar.messageEn}
              onChange={(e) => handleAnnouncementChange('messageEn', e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24221F] mb-1">
              Bengali Message (বাংলা বার্তা)
            </label>
            <input
              type="text"
              value={navData.announcementBar.messageBn}
              onChange={(e) => handleAnnouncementChange('messageBn', e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
            />
          </div>
        </div>
      </div>

      {/* Header Menu Items */}
      <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#1C4CB8]" />
            <h3 className="font-serif text-sm font-bold text-[#24221F]">Header Menu Links</h3>
          </div>
          <button
            type="button"
            onClick={handleAddMenuItem}
            className="px-3 py-1.5 rounded-xl border border-[#E8E0D2] text-xs font-semibold hover:bg-[#FAF7F1] flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add Menu Link</span>
          </button>
        </div>

        <div className="space-y-3">
          {navData.menuItems.map((item, idx) => (
            <div
              key={item.id}
              className="p-3 border border-[#E8E0D2] rounded-xl bg-[#FAF7F1]/40 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 w-full">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleMenuItemChange(idx, 'label', e.target.value)}
                  placeholder="Link label (e.g. Shop All)"
                  className="px-3 py-1.5 text-xs font-bold border border-[#E8E0D2] rounded-lg bg-white"
                />

                <input
                  type="text"
                  value={item.path}
                  onChange={(e) => handleMenuItemChange(idx, 'path', e.target.value)}
                  placeholder="/shop"
                  className="px-3 py-1.5 text-xs font-mono border border-[#E8E0D2] rounded-lg bg-white"
                />

                <select
                  value={item.megaMenuTab || ''}
                  onChange={(e) => handleMenuItemChange(idx, 'megaMenuTab', e.target.value || undefined)}
                  className="px-3 py-1.5 text-xs border border-[#E8E0D2] rounded-lg bg-white"
                >
                  <option value="">No Mega Menu</option>
                  <option value="shop">Shop Drawer</option>
                  <option value="age">By Age Drawer</option>
                  <option value="play">Play Personalities</option>
                  <option value="gifts">Gifts Drawer</option>
                </select>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <label className="flex items-center gap-1 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(e) => handleMenuItemChange(idx, 'enabled', e.target.checked)}
                    className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
                  />
                  <span>Active</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveMenuItem(idx)}
                  className="text-[#8C8478] hover:text-[#B83A28] p-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
