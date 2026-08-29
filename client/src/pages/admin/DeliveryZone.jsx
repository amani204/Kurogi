import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import {
  fetchDeliveryZones, createDeliveryZone, updateDeliveryZone, deleteDeliveryZone,
} from '../../features/orders/api';

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
        // wilaya name isn't editable — backend only accepts price on update
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
      <h1 className="text-xl font-semibold text-neutral-900">Delivery Zones</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Set the wilayas you deliver to and the delivery fee for each.
      </p>

      <div className="mt-6 overflow-x-auto rounded border border-neutral-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-neutral-400">Loading...</div>
        ) : zones?.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-400">No delivery zones yet — customers can only pick up for now.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">Wilaya</th>
                <th className="px-4 py-3 font-medium">Delivery fee</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => (
                <tr key={zone._id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3">{zone.wilaya}</td>
                  <td className="px-4 py-3 font-medium">{zone.price} DA</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button onClick={() => startEdit(zone)} className="text-xs text-neutral-600 hover:text-neutral-900 underline mr-3">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(zone._id)}
                      disabled={busyId === zone._id}
                      className="text-xs text-red-500 hover:text-red-700 underline disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-8 rounded border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">{editingId ? 'Edit delivery fee' : 'Add new zone'}</h2>
          {editingId && (
            <button onClick={resetForm} className="text-xs text-neutral-500 hover:text-neutral-900 underline">
              Cancel edit / add new instead
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Wilaya</label>
              <input
                value={form.wilaya}
                onChange={(e) => setForm((p) => ({ ...p, wilaya: e.target.value }))}
                disabled={!!editingId}
                required
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm disabled:bg-neutral-50 disabled:text-neutral-400"
              />
              {editingId && <p className="mt-1 text-xs text-neutral-400">Wilaya name can't be changed — delete and re-add if needed.</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Delivery fee (DA)</label>
              <input
                type="number" min="0" step="1"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                required
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit" disabled={saving}
              className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add zone'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded border border-neutral-300 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
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