import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import {
  fetchDeliveryZones, createDeliveryZone, updateDeliveryZone, deleteDeliveryZone,
} from '../../features/orders/api';
import { cn } from '../../lib/utils';
import { formatPrice } from '../../features/menu/utils/formatPrice';
import { Truck, Edit, Trash2, X, MapPin } from 'lucide-react';
import Button from "../../components/ui/Button";
const emptyForm = { wilaya: '', price: '' };

const DeliveryZones = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const { data: zones, loading } = useFetch(fetchDeliveryZones, [refreshKey]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  const startEdit = (zone) => {
    setEditingId(zone._id);
    setForm({ wilaya: zone.wilaya, price: zone.price });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.wilaya || form.price === '') {
      setError('Wilaya and price are required.');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateDeliveryZone(editingId, parseFloat(form.price));
      } else {
        await createDeliveryZone({ wilaya: form.wilaya, price: parseFloat(form.price) });
      }
      resetForm();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save delivery zone.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this delivery zone? Existing orders that used it keep their delivery price — this only stops it being offered to new orders.')) return;
    setBusyId(id);
    try {
      await deleteDeliveryZone(id);
      if (editingId === id) resetForm();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete zone.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="label text-[0.6rem] tracking-[0.3em] text-muted-foreground">
          Orders · Delivery Zones
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight">Delivery Zones</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Set the wilayas you deliver to and the delivery fee for each.
          {zones && (
            <span className="ml-2 num text-muted-foreground">
              · {zones.length} zones
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gin bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="label text-muted-foreground">Loading delivery zones…</p>
          </div>
        ) : zones?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Truck className="h-8 w-8 text-muted-foreground/30" strokeWidth={1.25} />
            <p className="mt-3 label text-muted-foreground">No delivery zones yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Customers can only pick up for now</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gin bg-gin/10">
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Wilaya
                  </div>
                </th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    Delivery fee
                  </div>
                </th>
                <th className="px-4 py-3 text-right label text-[0.5rem] tracking-[0.15em] text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => (
                <tr key={zone._id} className="border-b border-gin/50 last:border-0 transition-colors hover:bg-gin/5">
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      <Truck className="h-3.5 w-3.5 text-muted-foreground/40" strokeWidth={1.25} />
                      {zone.wilaya}
                    </div>
                  </td>
                  <td className="px-4 py-3 num font-medium">
                    {formatPrice(zone.price)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => startEdit(zone)}
                      className="label inline-flex items-center gap-1 text-[0.45rem] tracking-widest text-muted-foreground transition-colors hover:text-sumi mr-4"
                    >
                      <Edit className="h-3 w-3" strokeWidth={1.5} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(zone._id)}
                      disabled={busyId === zone._id}
                      className="label inline-flex items-center gap-1 text-[0.45rem] tracking-widest text-shu/60 transition-colors hover:text-shu disabled:opacity-40"
                    >
                      <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Zone stats */}
      {zones && zones.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="label text-[0.45rem] tracking-[0.15em]">
            Total zones: <span className="num">{zones.length}</span>
          </span>
          <span className="label text-[0.45rem] tracking-[0.15em]">
            Avg. delivery fee: <span className="num">
              {formatPrice(zones.reduce((sum, z) => sum + z.price, 0) / zones.length)}
            </span>
          </span>
          <span className="label text-[0.45rem] tracking-[0.15em]">
            Min: <span className="num">{formatPrice(Math.min(...zones.map(z => z.price)))}</span>
          </span>
          <span className="label text-[0.45rem] tracking-[0.15em]">
            Max: <span className="num">{formatPrice(Math.max(...zones.map(z => z.price)))}</span>
          </span>
        </div>
      )}

      {/* Form */}
      <div className="mt-10 border border-gin bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="label text-[0.5rem] tracking-[0.2em] text-muted-foreground">
              {editingId ? 'Edit delivery fee' : 'Add new zone'}
            </p>
            <h2 className="mt-1 font-display text-xl">
              {editingId ? 'Edit delivery zone' : 'Create delivery zone'}
            </h2>
          </div>
          {editingId && (
            <button
              onClick={resetForm}
              className="label flex items-center gap-1.5 text-[0.45rem] tracking-[0.15em] text-muted-foreground transition-colors hover:text-sumi"
            >
              <X className="h-3 w-3" strokeWidth={1.5} />
              Cancel edit / add new
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                place
              </label>
              <input
                value={form.wilaya}
                onChange={(e) => setForm((p) => ({ ...p, wilaya: e.target.value }))}
                disabled={!!editingId}
                required
                className={cn(
                  "w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none",
                  editingId && "bg-gin/20 text-muted-foreground"
                )}
                placeholder="e.g. Alger"
              />
              {editingId && (
                <p className="mt-1.5 text-[0.45rem] text-muted-foreground">
                  place name can't be changed — delete and re-add if needed.
                </p>
              )}
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                Delivery fee (DA)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                required
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
                placeholder="e.g. 500"
              />
            </div>
          </div>

          {error && <p className="label text-shu">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button
              variant="primary"
              type="submit"
              disabled={saving}
               className="label px-6 py-3 text-[0.55rem] tracking-[0.2em] text-washi transition-colors hover:bg-sumi/90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add zone'}
            </Button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="label border border-gin px-6 py-3 text-[0.55rem] tracking-[0.2em] text-muted-foreground transition-colors hover:border-sumi hover:text-sumi"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryZones;