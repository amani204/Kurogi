import { useState, Fragment } from 'react';
import { useFetch } from '../../hooks/useFetch';
import {
  fetchCategories, createCategory, updateCategory, deleteCategory,
} from '../../features/menu/api';
import { fetchMenu } from '../../features/menu/api';
const emptyForm = { slug: '', label: { en: '', fr: '', ar: '' }, order: 0 };

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const CategoryItemsPreview = ({ categorySlug }) => {
  const { data: items, loading } = useFetch(() => fetchMenu({ category: categorySlug }), [categorySlug]);

  if (loading) return <div className="px-4 py-3 text-xs text-neutral-400">Loading items...</div>;
  if (!items || items.length === 0) {
    return <div className="px-4 py-3 text-xs text-neutral-400">No items in this category.</div>;
  }

  return (
    <div className="flex flex-wrap gap-3 px-4 py-3 bg-neutral-50">
      {items.map((item) => (
        <div key={item._id} className="flex items-center gap-2 rounded border border-neutral-200 bg-white px-2 py-1.5">
          {item.photoUrl ? (
            <img src={item.photoUrl} alt={item.name.en} className="h-8 w-8 rounded object-cover" />
          ) : (
            <div className="h-8 w-8 rounded bg-neutral-100 flex items-center justify-center text-[0.6rem] text-neutral-400">
              No img
            </div>
          )}
          <span className="text-xs text-neutral-700">{item.name.en}</span>
        </div>
      ))}
    </div>
  );
};
const Categories = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  // delete-flow state: which category is mid-deletion, and how many items block it
  const [pendingDelete, setPendingDelete] = useState(null); // { id, slug, label, itemCount } | null
  const [reassignTarget, setReassignTarget] = useState('');
  const [deleting, setDeleting] = useState(false);

  const { data: categories, loading } = useFetch(fetchCategories, [refreshKey]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ slug: cat.slug, label: { ...cat.label }, order: cat.order || 0 });
    setError(null);
  };

  const handleLabelEnChange = (value) => {
    setForm((p) => ({
      ...p,
      label: { ...p.label, en: value },
      slug: editingId ? p.slug : slugify(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.slug || !form.label.en || !form.label.fr || !form.label.ar) {
      setError('Slug and all three labels are required.');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const { slug, ...updatePayload } = form;
        await updateCategory(editingId, updatePayload);
      } else {
        await createCategory(form);
      }
      resetForm();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  // step 1 — user clicks Delete: confirm, then attempt with no action
  const handleDeleteClick = async (cat) => {
    if (!confirm(`Delete "${cat.label.en}"?`)) return;

    setDeleting(true);
    try {
      await deleteCategory(cat._id);
      // no items existed — deleted immediately, nothing more to do
      setRefreshKey((k) => k + 1);
    } catch (err) {
      if (err.response?.status === 409 && err.response.data?.itemCount) {
        // items exist — open the decision dialog instead of failing silently
        setPendingDelete({
          id: cat._id, slug: cat.slug, label: cat.label.en,
          itemCount: err.response.data.itemCount,
        });
      } else {
        alert(err.response?.data?.message || 'Failed to delete category.');
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteItems = async () => {
    if (!confirm(`Permanently delete all ${pendingDelete.itemCount} item(s) in "${pendingDelete.label}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteCategory(pendingDelete.id, { action: 'delete-items' });
      setPendingDelete(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete.');
    } finally {
      setDeleting(false);
    }
  };

  const handleReassign = async () => {
    if (!reassignTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(pendingDelete.id, { action: 'reassign', reassignTo: reassignTarget });
      setPendingDelete(null);
      setReassignTarget('');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reassign.');
    } finally {
      setDeleting(false);
    }
  };

  const otherCategories = (categories || []).filter((c) => c._id !== pendingDelete?.id);

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Categories</h1>
      <p className="mt-1 text-sm text-neutral-500">Manage the menu's category tabs.</p>

      <div className="mt-6 overflow-x-auto rounded border border-neutral-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-neutral-400">Loading...</div>
        ) : categories?.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-400">No categories yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">Label (EN)</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
           <tbody>
  {categories.map((cat) => (
    <Fragment key={cat._id}>
      <tr
        className="border-b border-neutral-100 last:border-0 cursor-pointer hover:bg-neutral-50"
        onClick={() => setExpandedId(expandedId === cat._id ? null : cat._id)}
      >
        <td className="px-4 py-3">
          <span className="mr-2 text-neutral-400">{expandedId === cat._id ? '▾' : '▸'}</span>
          {cat.label.en}
        </td>
        <td className="px-4 py-3 text-neutral-500">{cat.slug}</td>
        <td className="px-4 py-3">{cat.order}</td>
        <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => startEdit(cat)} className="text-xs text-neutral-600 hover:text-neutral-900 underline mr-3">
            Edit
          </button>
          <button onClick={() => handleDeleteClick(cat)} disabled={deleting} className="text-xs text-red-500 hover:text-red-700 underline disabled:opacity-50">
            Delete
          </button>
        </td>
      </tr>
      {expandedId === cat._id && (
        <tr>
          <td colSpan={4} className="p-0">
            <CategoryItemsPreview categorySlug={cat.slug} />
          </td>
        </tr>
      )}
    </Fragment>
  ))}
</tbody>
          </table>
        )}
      </div>

      {/* --- Decision dialog: category has items --- */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
            <h2 className="text-sm font-semibold text-neutral-900">
              "{pendingDelete.label}" has {pendingDelete.itemCount} item(s)
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Choose what to do with them before this category can be deleted.
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded border border-red-200 bg-red-50 p-3">
                <p className="text-sm font-medium text-red-700">Delete the items too</p>
                <p className="mt-0.5 text-xs text-red-600">This permanently removes all {pendingDelete.itemCount} item(s). Cannot be undone.</p>
                <button
                  onClick={handleDeleteItems}
                  disabled={deleting}
                  className="mt-2 rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Delete items and category
                </button>
              </div>

              <div className="rounded border border-neutral-200 p-3">
                <p className="text-sm font-medium text-neutral-800">Move items to another category</p>
                <div className="mt-2 flex gap-2">
                  <select
                    value={reassignTarget}
                    onChange={(e) => setReassignTarget(e.target.value)}
                    className="flex-1 rounded border border-neutral-300 px-2 py-1.5 text-xs"
                  >
                    <option value="">Select category...</option>
                    {otherCategories.map((c) => (
                      <option key={c._id} value={c.slug}>{c.label.en}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleReassign}
                    disabled={!reassignTarget || deleting}
                    className="rounded bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
                  >
                    Move & delete category
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setPendingDelete(null); setReassignTarget(''); }}
              className="mt-5 text-xs text-neutral-500 hover:text-neutral-900 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* --- Add / edit form --- */}
      <div className="mt-8 rounded border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">{editingId ? 'Edit category' : 'Add new category'}</h2>
          {editingId && (
            <button onClick={resetForm} className="text-xs text-neutral-500 hover:text-neutral-900 underline">
              Cancel edit / add new instead
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))}
                disabled={!!editingId}
                required
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm disabled:bg-neutral-50 disabled:text-neutral-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Order (display position)</label>
              <input
                type="number" min="0"
                value={form.order}
                onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value, 10) || 0 }))}
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Label (English)</label>
              <input
                value={form.label.en}
                onChange={(e) => handleLabelEnChange(e.target.value)}
                required
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Label (French)</label>
              <input
                value={form.label.fr}
                onChange={(e) => setForm((p) => ({ ...p, label: { ...p.label, fr: e.target.value } }))}
                required
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Label (Arabic)</label>
              <input
                value={form.label.ar} dir="rtl"
                onChange={(e) => setForm((p) => ({ ...p, label: { ...p.label, ar: e.target.value } }))}
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
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add category'}
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

export default Categories;