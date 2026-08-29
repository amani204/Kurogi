import { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { fetchRestaurantSettings, updateRestaurantSettings } from '../../features/restaurant/api';

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_LABELS = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };

const emptyHours = DAYS.map((day) => ({ day, open: '', close: '' }));

const emptyForm = {
  name: '',
  capacityPerSlot: '',
  slotLengthMinutes: '',
  hours: emptyHours,
  contact: {
    phone: '', whatsapp: '', email: '', address: '',
    lat: '', lng: '', facebook: '', instagram: '',
  },
};

const Settings = () => {
  const { data: current, loading } = useFetch(fetchRestaurantSettings, []);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  // populate the form once real settings load, filling in any missing days
  useEffect(() => {
    if (!current) return;

    const hoursByDay = {};
    (current.hours || []).forEach((h) => { hoursByDay[h.day] = h; });
    const mergedHours = DAYS.map((day) => hoursByDay[day] || { day, open: '', close: '' });

    setForm({
      name: current.name || '',
      capacityPerSlot: current.capacityPerSlot ?? '',
      slotLengthMinutes: current.slotLengthMinutes ?? '',
      hours: mergedHours,
      contact: {
        phone: current.contact?.phone || '',
        whatsapp: current.contact?.whatsapp || '',
        email: current.contact?.email || '',
        address: current.contact?.address || '',
        lat: current.contact?.lat ?? '',
        lng: current.contact?.lng ?? '',
        facebook: current.contact?.facebook || '',
        instagram: current.contact?.instagram || '',
      },
    });
  }, [current]);

  const handleContactChange = (field, value) => {
    setForm((p) => ({ ...p, contact: { ...p.contact, [field]: value } }));
  };

  const handleHourChange = (day, field, value) => {
    setForm((p) => ({
      ...p,
      hours: p.hours.map((h) => (h.day === day ? { ...h, [field]: value } : h)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (!form.name || !form.capacityPerSlot) {
      setError('Restaurant name and capacity per slot are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        capacityPerSlot: parseInt(form.capacityPerSlot, 10),
        slotLengthMinutes: form.slotLengthMinutes ? parseInt(form.slotLengthMinutes, 10) : undefined,
        // only send hours that actually have both open+close set — leaves
        // genuinely closed days out rather than sending empty strings
        hours: form.hours.filter((h) => h.open && h.close),
        contact: {
          ...form.contact,
          lat: form.contact.lat !== '' ? parseFloat(form.contact.lat) : undefined,
          lng: form.contact.lng !== '' ? parseFloat(form.contact.lng) : undefined,
        },
      };

      await updateRestaurantSettings(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const validationErrors = err.response?.data?.errors;
      setError(
        validationErrors?.length
          ? validationErrors.map((e) => e.msg).join(', ')
          : err.response?.data?.message || 'Failed to save settings.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-neutral-400">Loading settings...</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Settings</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Restaurant info, hours, and contact details shown on the public site.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        {/* --- General --- */}
        <div className="rounded border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">General</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Restaurant name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Capacity per slot</label>
              <input
                type="number" min="1"
                value={form.capacityPerSlot}
                onChange={(e) => setForm((p) => ({ ...p, capacityPerSlot: e.target.value }))}
                required
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-neutral-400">Max total guests bookable per time slot.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Slot length (minutes)</label>
              <input
                type="number" min="15" step="15"
                value={form.slotLengthMinutes}
                onChange={(e) => setForm((p) => ({ ...p, slotLengthMinutes: e.target.value }))}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* --- Hours --- */}
        <div className="rounded border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Opening Hours</h2>
          <p className="text-xs text-neutral-400 mb-4">Leave both fields blank for a day you're closed.</p>
          <div className="space-y-2">
            {form.hours.map((h) => (
              <div key={h.day} className="flex items-center gap-3">
                <span className="w-24 text-sm text-neutral-700">{DAY_LABELS[h.day]}</span>
                <input
                  type="time"
                  value={h.open}
                  onChange={(e) => handleHourChange(h.day, 'open', e.target.value)}
                  className="rounded border border-neutral-300 px-2 py-1.5 text-sm"
                />
                <span className="text-neutral-400 text-sm">to</span>
                <input
                  type="time"
                  value={h.close}
                  onChange={(e) => handleHourChange(h.day, 'close', e.target.value)}
                  className="rounded border border-neutral-300 px-2 py-1.5 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* --- Contact --- */}
        <div className="rounded border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Contact</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Phone</label>
              <input
                value={form.contact.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                placeholder="+213..."
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">WhatsApp number</label>
              <input
                value={form.contact.whatsapp}
                onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                placeholder="213555123456"
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-neutral-400">Used for booking/order confirmation links. Digits only work best.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Email</label>
              <input
                type="email"
                value={form.contact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Address</label>
              <input
                value={form.contact.address}
                onChange={(e) => handleContactChange('address', e.target.value)}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Facebook URL</label>
              <input
                value={form.contact.facebook}
                onChange={(e) => handleContactChange('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Instagram URL</label>
              <input
                value={form.contact.instagram}
                onChange={(e) => handleContactChange('instagram', e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Map latitude</label>
              <input
                type="number" step="any"
                value={form.contact.lat}
                onChange={(e) => handleContactChange('lat', e.target.value)}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Map longitude</label>
              <input
                type="number" step="any"
                value={form.contact.lng}
                onChange={(e) => handleContactChange('lng', e.target.value)}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="text-sm text-green-600">Settings saved.</p>}

        <button
          type="submit" disabled={saving}
          className="rounded bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </form>
    </div>
  );
};

export default Settings;