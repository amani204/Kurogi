// pages/admin/Settings.jsx
import { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { fetchRestaurantSettings, updateRestaurantSettings } from '../../features/restaurant/api';
import { registerStaff, fetchStaff, deleteStaffAccount } from '../../features/auth/api';
import { cn } from '../../lib/utils';
import { 
  Settings as SettingsIcon, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Globe,
  Plus,
  Trash2,
  X,
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

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setStaffError(null);
    setStaffCreated(null);

    if (!staffForm.name || !staffForm.email || !staffForm.password) {
      setStaffError('Name, email, and password are all required.');
      return;
    }
    if (staffForm.password.length < 8) {
      setStaffError('Password must be at least 8 characters.');
      return;
    }

    setStaffSaving(true);
    try {
      const submittedEmail = staffForm.email;
      const user = await registerStaff(staffForm);
      setStaffCreated({ ...user, email: submittedEmail });
      setStaffForm({ name: '', email: '', password: '' });
      setStaffRefreshKey((k) => k + 1);
    } catch (err) {
      const validationErrors = err.response?.data?.errors;
      setStaffError(
        validationErrors?.length
          ? validationErrors.map((e) => e.msg).join(', ')
          : err.response?.data?.message || 'Failed to create staff account.'
      );
    } finally {
      setStaffSaving(false);
    }
  };

  const handleRemoveStaff = async (id, name) => {
    if (!confirm(`Remove staff account for ${name}? They'll no longer be able to log in.`)) return;
    setRemovingId(id);
    try {
      await deleteStaffAccount(id);
      setStaffRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove account.');
    } finally {
      setRemovingId(null);
    }
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

        {/* --- Staff Accounts --- */}
        <div className="border border-gin bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <h2 className="font-display text-xl">Staff Accounts</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Staff can manage bookings and orders, but not the menu or these settings.
          </p>

          <div className="overflow-x-auto border border-gin">
            {staffLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="label text-muted-foreground">Loading staff…</p>
              </div>
            ) : staffList?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Users className="h-6 w-6 text-muted-foreground/30" strokeWidth={1.25} />
                <p className="mt-2 label text-muted-foreground">No staff accounts yet</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gin bg-gin/10">
                    <th className="px-4 py-3 text-left label text-[0.45rem] tracking-[0.15em] text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left label text-[0.45rem] tracking-[0.15em] text-muted-foreground">Email</th>
                    <th className="px-4 py-3 text-left label text-[0.45rem] tracking-[0.15em] text-muted-foreground">Added</th>
                    <th className="px-4 py-3 text-right label text-[0.45rem] tracking-[0.15em] text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {staffList?.map((s) => (
                    <tr key={s._id} className="border-b border-gin/50 last:border-0 transition-colors hover:bg-gin/5">
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.email}</td>
                      <td className="px-4 py-3 num text-xs text-muted-foreground">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleRemoveStaff(s._id, s.name)}
                          disabled={removingId === s._id}
                          className="label inline-flex items-center gap-1 text-[0.4rem] tracking-[0.1em] text-shu/60 transition-colors hover:text-shu disabled:opacity-40"
                        >
                          <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-5 border-t border-gin pt-5">
            <p className="label text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-3">
              Add new staff account
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                placeholder="Name"
                value={staffForm.name}
                onChange={(e) => setStaffForm((p) => ({ ...p, name: e.target.value }))}
                className="border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
              <input
                type="email" placeholder="Email"
                value={staffForm.email}
                onChange={(e) => setStaffForm((p) => ({ ...p, email: e.target.value }))}
                className="border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
              <input
                type="password" placeholder="Password (min 8 chars)"
                value={staffForm.password}
                onChange={(e) => setStaffForm((p) => ({ ...p, password: e.target.value }))}
                className="border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>

            {staffError && (
              <p className="mt-2 label text-shu">
                <AlertCircle className="inline-block h-3 w-3 mr-1" strokeWidth={1.5} />
                {staffError}
              </p>
            )}
            {staffCreated && (
              <p className="mt-2 label text-nori">
                <CheckCircle className="inline-block h-3 w-3 mr-1" strokeWidth={1.5} />
                Account created for {staffCreated.name} ({staffCreated.email}).
              </p>
            )}

            <Button
            variant='primary'
              type="button" onClick={handleStaffSubmit} disabled={staffSaving}
             className="mt-6 label px-6 py-3 text-[0.55rem] tracking-[0.2em] text-washi transition-colors hover:bg-sumi/90 disabled:opacity-50"
            >
              {staffSaving ? 'Creating…' : 'Create staff account'}
            </Button>
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
            className="gap-2 label px-6 py-3 text-[0.55rem] tracking-[0.2em] text-washi transition-colors hover:bg-sumi/90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" strokeWidth={1.5} />
            {saving ? 'Saving…' : 'Save settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;