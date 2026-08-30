
import { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { fetchRestaurantSettings, updateRestaurantSettings } from '../../features/restaurant/api';
import {  fetchStaff } from '../../features/auth/api';

import { 
  Settings as SettingsIcon, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Globe,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_LABELS = { 
  mon: 'Monday', 
  tue: 'Tuesday', 
  wed: 'Wednesday', 
  thu: 'Thursday', 
  fri: 'Friday', 
  sat: 'Saturday', 
  sun: 'Sunday' 
};

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
  
  const [staffForm, setStaffForm] = useState({ name: '', email: '', password: '' });
  const [staffSaving, setStaffSaving] = useState(false);
  const [staffError, setStaffError] = useState(null);
  const [staffCreated, setStaffCreated] = useState(null);
  const [staffRefreshKey, setStaffRefreshKey] = useState(0);
  const [removingId, setRemovingId] = useState(null);

  const { data: staffList, loading: staffLoading } = useFetch(fetchStaff, [staffRefreshKey]);

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
    return (
      <div className="flex items-center justify-center py-16">
        <p className="label text-muted-foreground">Loading settings…</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="label text-[0.6rem] tracking-[0.3em] text-muted-foreground">
          Administration · Settings
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Restaurant info, hours, and contact details shown on the public site.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- General --- */}
        <div className="border border-gin bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <SettingsIcon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <h2 className="font-display text-xl">General</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                Restaurant name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                Capacity per slot
              </label>
              <input
                type="number" min="1"
                value={form.capacityPerSlot}
                onChange={(e) => setForm((p) => ({ ...p, capacityPerSlot: e.target.value }))}
                required
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
              <p className="mt-1 text-[0.45rem] text-muted-foreground">
                Max total guests bookable per time slot.
              </p>
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                Slot length (minutes)
              </label>
              <input
                type="number" min="15" step="15"
                value={form.slotLengthMinutes}
                onChange={(e) => setForm((p) => ({ ...p, slotLengthMinutes: e.target.value }))}
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* --- Hours --- */}
        <div className="border border-gin bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <h2 className="font-display text-xl">Opening Hours</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Leave both fields blank for a day you're closed.
          </p>
          <div className="space-y-2">
            {form.hours.map((h) => (
              <div key={h.day} className="flex flex-wrap items-center gap-3">
                <span className="w-24 text-sm">{DAY_LABELS[h.day]}</span>
                <input
                  type="time"
                  value={h.open}
                  onChange={(e) => handleHourChange(h.day, 'open', e.target.value)}
                  className="border border-gin bg-transparent px-2 py-1.5 text-sm focus:border-shu focus:outline-none"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <input
                  type="time"
                  value={h.close}
                  onChange={(e) => handleHourChange(h.day, 'close', e.target.value)}
                  className="border border-gin bg-transparent px-2 py-1.5 text-sm focus:border-shu focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* --- Contact --- */}
        <div className="border border-gin bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <h2 className="font-display text-xl">Contact</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                <Phone className="inline-block h-3 w-3 mr-1" strokeWidth={1.5} />
                Phone
              </label>
              <input
                value={form.contact.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                placeholder="+213..."
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                WhatsApp number
              </label>
              <input
                value={form.contact.whatsapp}
                onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                placeholder="213555123456"
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
              <p className="mt-1 text-[0.4rem] text-muted-foreground">
                Used for booking/order confirmation links. Digits only.
              </p>
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                <Mail className="inline-block h-3 w-3 mr-1" strokeWidth={1.5} />
                Email
              </label>
              <input
                type="email"
                value={form.contact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                <MapPin className="inline-block h-3 w-3 mr-1" strokeWidth={1.5} />
                Address
              </label>
              <input
                value={form.contact.address}
                onChange={(e) => handleContactChange('address', e.target.value)}
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                <Globe className="inline-block h-3 w-3 mr-1" strokeWidth={1.5} />
                Facebook URL
              </label>
              <input
                value={form.contact.facebook}
                onChange={(e) => handleContactChange('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                <Globe className="inline-block h-3 w-3 mr-1" strokeWidth={1.5} />
                Instagram URL
              </label>
              <input
                value={form.contact.instagram}
                onChange={(e) => handleContactChange('instagram', e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                Map latitude
              </label>
              <input
                type="number" step="any"
                value={form.contact.lat}
                onChange={(e) => handleContactChange('lat', e.target.value)}
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                Map longitude
              </label>
              <input
                type="number" step="any"
                value={form.contact.lng}
                onChange={(e) => handleContactChange('lng', e.target.value)}
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Error / Success messages */}
        {error && (
          <p className="label text-shu">
            <AlertCircle className="inline-block h-3.5 w-3.5 mr-1.5" strokeWidth={1.5} />
            {error}
          </p>
        )}
        {saved && (
          <p className="label text-nori">
            <CheckCircle className="inline-block h-3.5 w-3.5 mr-1.5" strokeWidth={1.5} />
            Settings saved.
          </p>
        )}

        {/* Save button */}
        <div className="border-t border-gin pt-6">
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
            className="gap-2 label px-6 py-3 text-[0.55rem] tracking-[0.2em] text-washi transition-colors hover:bg-sumi/90 disabled:opacity-50" >
            <Save className="h-4 w-4" strokeWidth={1.5} />
            {saving ? 'Saving…' : 'Save settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;