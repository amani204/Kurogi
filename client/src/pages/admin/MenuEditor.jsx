import { useState, useMemo } from 'react';
import { useFetch } from '../../hooks/useFetch';
import {
  fetchMenu, fetchCategories, createMenuItem, updateMenuItem,
  deleteMenuItem, toggleAvailability, toggleFeatured, uploadImage,
} from '../../features/menu/api';
const emptyForm = {
  slug: '',
  name: { en: '', fr: '', ar: '' },
  description: { en: '', fr: '', ar: '' },
  price: '',
  category: '',
  photoUrl: '',
  available: true,
  featured: false,
};

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const MenuEditor = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingId, setEditingId] = useState(null); // null = "add new" mode
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null); // per-row toggle/delete spinner guard
  const [fileInputKey, setFileInputKey] = useState(0);
  const { data: items, loading: itemsLoading } = useFetch(() => fetchMenu({}), [refreshKey]);
  const { data: categories, loading: categoriesLoading } = useFetch(fetchCategories, []);
  const [uploading, setUploading] = useState(false);
  const categoryLabel = useMemo(() => {
    const map = {};
    (categories || []).forEach((c) => { map[c.slug] = c.label.en; });
    return map;
  }, [categories]);

  const resetForm = () => {
  setEditingId(null);
  setForm(emptyForm);
  setError(null);
  setFileInputKey((k) => k + 1);
};

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      slug: item.slug,
      name: { en: item.name.en || '', fr: item.name.fr || '', ar: item.name.ar || '' },
      description: {
        en: item.description?.en || '', fr: item.description?.fr || '', ar: item.description?.ar || '',
      },
      price: item.price,
      category: item.category,
      photoUrl: item.photoUrl || '',
      available: item.available,
      featured: item.featured,
    });
    setError(null);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleNameEnChange = (value) => {
    setForm((prev) => ({
      ...prev,
      name: { ...prev.name, en: value },
      // auto-suggest slug only while creating a brand new item
      slug: editingId ? prev.slug : slugify(value),
    }));
  };
  const handleFileSelect = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);
  setError(null);
  try {
    const url = await uploadImage(file);
    setForm((p) => ({ ...p, photoUrl: url }));
  } catch (err) {
    setError(err.response?.data?.message || 'Image upload failed.');
  } finally {
    setUploading(false);
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  if (!form.slug || !form.name.en || !form.name.fr || !form.name.ar || !form.category || form.price === '' || !form.photoUrl) {
    setError('Slug, all three names, category, price, and a photo are required.');
    return;
  }

  setSaving(true);
  try {
    const payload = { ...form, price: parseFloat(form.price) };

    if (editingId) {
      const { slug, ...updatePayload } = payload;
      await updateMenuItem(editingId, updatePayload);
    } else {
      await createMenuItem(payload);
    }

    resetForm();
    setRefreshKey((k) => k + 1);
  } catch (err) {
    // log full detail to console so we can see exactly what's failing
    console.error('Save failed:', err.response?.data || err.message);
    const serverMsg = err.response?.data?.message;
    const validationErrors = err.response?.data?.errors;
    if (validationErrors?.length) {
      setError(validationErrors.map((e) => e.msg).join(', '));
    } else {
      setError(serverMsg || 'Failed to save item.');
    }
  } finally {
    setSaving(false);
  }
};
  const handleDelete = async (id) => {
    if (!confirm('Delete this menu item? This cannot be undone.')) return;
    setBusyId(id);
    try {
      await deleteMenuItem(id);
      if (editingId === id) resetForm();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item.');
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleAvailable = async (id) => {
    setBusyId(id);
    try {
      await toggleAvailability(id);
      setRefreshKey((k) => k + 1);
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleFeatured = async (id) => {
    setBusyId(id);
    try {
      await toggleFeatured(id);
      setRefreshKey((k) => k + 1);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Menu Editor</h1>
      <p className="mt-1 text-sm text-neutral-500">Add, edit, and manage dishes across all three languages.</p>

      {/* --- List --- */}
      <div className="mt-6 overflow-x-auto rounded border border-neutral-200 bg-white">
        {itemsLoading || categoriesLoading ? (
          <div className="p-8 text-center text-sm text-neutral-400">Loading...</div>
        ) : items?.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-400">No menu items yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">Name (EN)</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Available</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3">{item.name.en}</td>
                  <td className="px-4 py-3 text-neutral-500">{categoryLabel[item.category] || item.category}</td>
                  <td className="px-4 py-3 font-medium">{item.price} DA</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleAvailable(item._id)}
                      disabled={busyId === item._id}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium disabled:opacity-50 ${
                        item.available ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {item.available ? 'Available' : 'Sold out'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleFeatured(item._id)}
                      disabled={busyId === item._id}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium disabled:opacity-50 ${
                        item.featured ? 'bg-amber-100 text-amber-700' : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {item.featured ? '★ Featured' : 'Not featured'}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button onClick={() => startEdit(item)} className="text-xs text-neutral-600 hover:text-neutral-900 underline mr-3">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={busyId === item._id}
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

      {/* --- Add / Edit form --- */}
      <div className="mt-8 rounded border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">
            {editingId ? 'Edit item' : 'Add new item'}
          </h2>
          {editingId && (
            <button onClick={resetForm} className="text-xs text-neutral-500 hover:text-neutral-900 underline">
              Cancel edit / add new instead
            </button>


          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Slug (URL-safe ID)</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))}
                disabled={!!editingId}
                required
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm disabled:bg-neutral-50 disabled:text-neutral-400"
              />
              {editingId && <p className="mt-1 text-xs text-neutral-400">Slug can't be changed after creation.</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                required
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              >
                <option value="" disabled>Select a category</option>
                {categories?.map((c) => (
                  <option key={c._id} value={c.slug}>{c.label.en}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Name (English)</label>
              <input
                value={form.name.en}
                onChange={(e) => handleNameEnChange(e.target.value)}
                required
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Name (French)</label>
              <input
                value={form.name.fr}
                onChange={(e) => setForm((p) => ({ ...p, name: { ...p.name, fr: e.target.value } }))}
                required
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Name (Arabic)</label>
              <input
                value={form.name.ar}
                onChange={(e) => setForm((p) => ({ ...p, name: { ...p.name, ar: e.target.value } }))}
                required dir="rtl"
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Description (English)</label>
              <textarea
                rows={2}
                value={form.description.en}
                onChange={(e) => setForm((p) => ({ ...p, description: { ...p.description, en: e.target.value } }))}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Description (French)</label>
              <textarea
                rows={2}
                value={form.description.fr}
                onChange={(e) => setForm((p) => ({ ...p, description: { ...p.description, fr: e.target.value } }))}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Description (Arabic)</label>
              <textarea
                rows={2} dir="rtl"
                value={form.description.ar}
                onChange={(e) => setForm((p) => ({ ...p, description: { ...p.description, ar: e.target.value } }))}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Price (DA)</label>
              <input
                type="number" min="0" step="1"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                required
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
           <div>
  <label className="block text-xs font-medium text-neutral-600 mb-1">Photo</label>

  {form.photoUrl && (
    <img
      src={form.photoUrl}
      alt="Preview"
      className="mb-2 h-24 w-24 rounded object-cover border border-neutral-200"
    />
  )}

  <input
  key={fileInputKey}
  type="file"
  accept="image/jpeg,image/png,image/webp"
  onChange={handleFileSelect}
  disabled={uploading}
  className="w-full text-sm"
/>

  {uploading && <p className="mt-1 text-xs text-neutral-400">Uploading...</p>}
  {!form.photoUrl && !uploading && (
    <p className="mt-1 text-xs text-neutral-400">No image selected yet.</p>
  )}
</div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm((p) => ({ ...p, available: e.target.checked }))}
              />
              Available
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
              />
              Featured (shown on homepage)
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
  type="submit" disabled={saving || uploading}
  className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
>
  {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add item'}
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

export default MenuEditor;