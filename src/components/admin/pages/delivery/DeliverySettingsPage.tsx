import React, { useState, useEffect } from 'react';
import { Save, Truck, MapPin } from 'lucide-react';
import { PageHeader } from '../../layout/PageHeader';
import { useAdminToast } from '../../common/AdminToast';
import { settingsService } from '../../../../services';
import type { DeliverySettings, DeliveryZoneConfig } from '../../../../types/admin';

export const DeliverySettingsPage: React.FC = () => {
  const { showToast } = useAdminToast();

  const [delivery, setDelivery] = useState<DeliverySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadDelivery = async () => {
    setIsLoading(true);
    try {
      const res = await settingsService.getDeliverySettings();
      setDelivery(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load delivery settings.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDelivery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleZoneChange = (index: number, field: keyof DeliveryZoneConfig, val: any) => {
    if (!delivery) return;
    const updated = [...delivery.zones];
    updated[index] = { ...updated[index], [field]: val };
    setDelivery({ ...delivery, zones: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!delivery) return;
    setIsSaving(true);
    try {
      await settingsService.updateDeliverySettings(delivery);
      showToast('Delivery zones and rates updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to update delivery settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !delivery) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#1C4CB8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#8C8478]">Loading delivery settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Delivery Zones & Cash on Delivery Rates"
        subtitle="Configure shipping fees, free-delivery thresholds, courier partners, and transit time estimates across Bangladesh."
        breadcrumbs={[{ label: 'Operations' }, { label: 'Delivery & COD' }]}
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
        {/* Global Threshold Box */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-sm font-bold text-[#24221F] pb-2 border-b border-[#F4EFE6]">
            Free Shipping Threshold Policy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24221F] mb-1">
                Storewide Free Delivery Threshold (৳ BDT)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8C8478]">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  value={delivery.globalFreeShippingThreshold}
                  onChange={(e) =>
                    setDelivery({
                      ...delivery,
                      globalFreeShippingThreshold: Number(e.target.value)
                    })
                  }
                  className="w-full pl-8 pr-3 py-2.5 text-xs font-bold border border-[#E8E0D2] rounded-xl focus:outline-none focus:border-[#1C4CB8]"
                />
              </div>
              <p className="text-[11px] text-[#8C8478] mt-1">
                Any cart subtotal reaching or exceeding this amount receives ৳0 delivery fee automatically.
              </p>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={delivery.defaultCodAvailable}
                  onChange={(e) =>
                    setDelivery({ ...delivery, defaultCodAvailable: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
                />
                <span>Enable Cash on Delivery for all delivery zones</span>
              </label>
            </div>
          </div>
        </div>

        {/* Delivery Zones Cards */}
        <div className="space-y-4">
          <h3 className="font-serif text-sm font-bold text-[#24221F]">Regional Delivery Zones</h3>

          {delivery.zones.map((zone, idx) => (
            <div
              key={zone.id}
              className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1C4CB8]" />
                  <h4 className="font-bold text-sm text-[#24221F]">{zone.name}</h4>
                </div>
                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={zone.enabled}
                    onChange={(e) => handleZoneChange(idx, 'enabled', e.target.checked)}
                    className="w-4 h-4 rounded border-[#D0C8BA] text-[#1C4CB8] accent-[#1C4CB8]"
                  />
                  <span>Active</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24221F] mb-1">Coverage Areas</label>
                <input
                  type="text"
                  value={zone.description}
                  onChange={(e) => handleZoneChange(idx, 'description', e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#24221F] mb-1">
                    Standard Courier Fee (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={zone.fee}
                    onChange={(e) => handleZoneChange(idx, 'fee', Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs font-bold border border-[#E8E0D2] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24221F] mb-1">
                    Estimated Delivery Window
                  </label>
                  <input
                    type="text"
                    value={zone.estimatedDelivery}
                    onChange={(e) => handleZoneChange(idx, 'estimatedDelivery', e.target.value)}
                    placeholder="e.g. 1–2 business days"
                    className="w-full px-3.5 py-2 text-xs border border-[#E8E0D2] rounded-xl"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Courier Partners Box */}
        <div className="bg-white border border-[#E8E0D2] rounded-2xl p-6 shadow-xs space-y-3">
          <h3 className="font-serif text-sm font-bold text-[#24221F] pb-2 border-b border-[#F4EFE6]">
            Integrated Courier Logistics Partners
          </h3>
          <p className="text-xs text-[#8C8478]">
            Active couriers utilized for Cash on Delivery parcel dispatching:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {delivery.courierPartners.map((partner, pIdx) => (
              <div
                key={pIdx}
                className="p-3 rounded-xl border border-[#E8E0D2] bg-[#FAF7F1]/50 flex items-center gap-2 text-xs font-bold text-[#24221F]"
              >
                <Truck className="w-4 h-4 text-[#1C4CB8]" />
                <span>{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
