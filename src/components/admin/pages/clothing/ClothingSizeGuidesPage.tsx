import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Save
} from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { useAdminToast } from '../../common/AdminToast';
import { MockDatabase } from '../../../../lib/mockDb/MockDatabase';
import { clothingService } from '../../../../services';
import type { SizeGuide, SizeGuideRow } from '../../../../types/clothing';

export const ClothingSizeGuidesPage: React.FC = () => {
  const { showToast } = useAdminToast();
  const [guides, setGuides] = useState<SizeGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGuideId, setActiveGuideId] = useState<string>('clothing-guide');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await clothingService.getSizeGuides();
    setGuides(data);
    if (data.length > 0 && !activeGuideId) {
      setActiveGuideId(data[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const unsub = MockDatabase.subscribe(loadData);
    return () => unsub();
  }, []);

  const activeGuide = guides.find((g) => g.id === activeGuideId) || guides[0];

  const handleUpdateRow = (idx: number, field: keyof SizeGuideRow, val: string) => {
    if (!activeGuide) return;
    const nextRows = [...activeGuide.rows];
    nextRows[idx] = {
      ...nextRows[idx],
      [field]: val
    };

    setGuides((prev) =>
      prev.map((g) => (g.id === activeGuide.id ? { ...g, rows: nextRows } : g))
    );
  };

  const handleAddRow = () => {
    if (!activeGuide) return;
    const newRow: SizeGuideRow =
      activeGuide.category === 'shoes'
        ? {
            age: '18–24M',
            euSize: 'EU 23',
            footLengthCm: '14.2 cm'
          }
        : {
            age: '24–36M',
            weightKg: '13–15 kg',
            heightCm: '98 cm',
            chestCm: '54 cm',
            waistCm: '52 cm'
          };

    const nextRows = [...activeGuide.rows, newRow];
    setGuides((prev) =>
      prev.map((g) => (g.id === activeGuide.id ? { ...g, rows: nextRows } : g))
    );
  };

  const handleDeleteRow = (idx: number) => {
    if (!activeGuide) return;
    const nextRows = activeGuide.rows.filter((_, i) => i !== idx);
    setGuides((prev) =>
      prev.map((g) => (g.id === activeGuide.id ? { ...g, rows: nextRows } : g))
    );
  };

  const handleSave = async () => {
    if (!activeGuide) return;
    setSaving(true);
    try {
      await clothingService.updateSizeGuide(activeGuide.id, activeGuide);
      showToast('Size measurement guide saved', 'success');
    } catch {
      showToast('Failed to save size guide', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      <PageHeader
        title="Apparel & Shoe Size Guides"
        subtitle="Manage official measurement tables for baby clothing and first-step footwear."
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#C85A32] rounded-xl hover:bg-[#B24E2A] transition-colors shadow-2xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Size Guide'}</span>
          </button>
        }
      />

      {/* Guide Tabs */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#857E73]">Loading size guides...</div>
      ) : (
        <div className="flex items-center gap-2">
          {guides.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGuideId(g.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeGuide?.id === g.id
                  ? 'bg-[#171715] text-white shadow-xs'
                  : 'bg-white border border-[#E8E2D5] text-[#524E47] hover:bg-[#FAF7F1]'
              }`}
            >
              {g.title}
            </button>
          ))}
        </div>
      )}

      {/* Guide Content Card */}
      {!loading && activeGuide && (
        <div className="bg-white border border-[#E8E2D5] rounded-2xl p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-4">
            <div>
              <h2 className="font-serif font-bold text-base text-[#171715]">
                {activeGuide.title} Measurement Chart
              </h2>
              <p className="text-xs text-[#857E73] mt-0.5">
                Measurements displayed in both customer PDP drawer and size modals.
              </p>
            </div>
            <button
              onClick={handleAddRow}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#C85A32] text-[#C85A32] text-xs font-bold hover:bg-[#FAF3EE] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Size Row</span>
            </button>
          </div>

          {/* Measurements Table */}
          <div className="overflow-x-auto border border-[#E8E2D5] rounded-xl">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#FAF7F1] border-b border-[#E8E2D5] text-[#857E73] text-[10px] uppercase font-bold">
                  <th className="py-3 px-4">Age / Size</th>
                  {activeGuide.category === 'shoes' ? (
                    <>
                      <th className="py-3 px-3">EU Shoe Size</th>
                      <th className="py-3 px-3">Foot Length</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3 px-3">Height</th>
                      <th className="py-3 px-3">Weight</th>
                      <th className="py-3 px-3">Chest</th>
                      <th className="py-3 px-3">Waist</th>
                    </>
                  )}
                  <th className="py-3 px-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {activeGuide.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FCFAF7]">
                    <td className="py-2.5 px-4 font-bold text-[#171715]">
                      <input
                        type="text"
                        value={row.age || row.ageLabel || ''}
                        onChange={(e) => handleUpdateRow(idx, 'age', e.target.value)}
                        className="w-28 h-8 px-2 rounded-lg border border-[#E8E2D5] text-xs font-bold"
                      />
                    </td>

                    {activeGuide.category === 'shoes' ? (
                      <>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={row.euSize || ''}
                            onChange={(e) => handleUpdateRow(idx, 'euSize', e.target.value)}
                            className="w-24 h-8 px-2 rounded-lg border border-[#E8E2D5] text-xs font-mono"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={row.footLengthCm || ''}
                            onChange={(e) => handleUpdateRow(idx, 'footLengthCm', e.target.value)}
                            className="w-28 h-8 px-2 rounded-lg border border-[#E8E2D5] text-xs"
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={row.heightCm || ''}
                            onChange={(e) => handleUpdateRow(idx, 'heightCm', e.target.value)}
                            className="w-24 h-8 px-2 rounded-lg border border-[#E8E2D5] text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={row.weightKg || ''}
                            onChange={(e) => handleUpdateRow(idx, 'weightKg', e.target.value)}
                            className="w-28 h-8 px-2 rounded-lg border border-[#E8E2D5] text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={row.chestCm || ''}
                            onChange={(e) => handleUpdateRow(idx, 'chestCm', e.target.value)}
                            className="w-24 h-8 px-2 rounded-lg border border-[#E8E2D5] text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={row.waistCm || ''}
                            onChange={(e) => handleUpdateRow(idx, 'waistCm', e.target.value)}
                            className="w-24 h-8 px-2 rounded-lg border border-[#E8E2D5] text-xs"
                          />
                        </td>
                      </>
                    )}

                    <td className="py-2.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(idx)}
                        className="p-1.5 text-[#857E73] hover:text-rose-600 rounded cursor-pointer"
                        title="Delete row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Measuring Tips Guide */}
          <div className="space-y-3 pt-4 border-t border-[#E8E2D5]">
            <h3 className="font-serif font-bold text-sm text-[#171715]">
              Measuring Instructions for Parents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(activeGuide.measuringTips || []).map((tip, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#FCFAF7] border border-[#E8E2D5] space-y-1">
                  <div className="font-bold text-xs text-[#171715]">{tip.title}</div>
                  <div className="text-[11px] text-[#857E73] leading-relaxed">{tip.instruction}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
