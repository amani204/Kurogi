import { useState, Fragment } from 'react';
import { useFetch } from '../../hooks/useFetch';
import {
  fetchCategories, createCategory, updateCategory, deleteCategory,
} from '../../features/menu/api';
import { fetchMenu } from '../../features/menu/api';
import Button from "../../components/ui/Button";
import { 
  ChevronDown, ChevronRight, Plus, Edit, Trash2, 
  X, AlertTriangle, FolderOpen, Package, ArrowRight 
} from 'lucide-react';

const emptyForm = { slug: '', label: { en: '', fr: '', ar: '' }, order: 0 };

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CategoryItemsPreview = ({ categorySlug }) => {
  const { data: items, loading } = useFetch(() => fetchMenu({ category: categorySlug }), [categorySlug]);

  if (loading) return <div className="px-4 py-3 text-xs text-muted-foreground">Loading items...</div>;
  if (!items || items.length === 0) {
    return <div className="px-4 py-3 text-xs text-muted-foreground">No items in this category.</div>;
  }

  return (
    <div className="flex flex-wrap gap-2 px-4 py-3 bg-gin/10">
      {items.map((item) => (
        <div key={item._id} className="flex items-center gap-2 border border-gin bg-white px-2 py-1.5">
          {item.photoUrl ? (
            <img src={item.photoUrl} alt={item.name.en} className="h-8 w-8 object-cover" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center bg-gin/20 text-[0.5rem] text-muted-foreground">
              No img
            </div>
          )}
          <span className="text-xs">{item.name.en}</span>
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
  const [pendingDelete, setPendingDelete] = useState(null);
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

  const handleDeleteClick = async (cat) => {
    if (!confirm(`Delete "${cat.label.en}"?`)) return;

    setDeleting(true);
    try {
      await deleteCategory(cat._id);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      if (err.response?.status === 409 && err.response.data?.itemCount) {
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
      {/* Header */}
      <div className="mb-8">
        <p className="label text-[0.6rem] tracking-[0.3em] text-muted-foreground">
          Menu · Categories
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight">Categories</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage the menu's category tabs.
          {categories && (
            <span className="ml-2 num text-muted-foreground">
              · {categories.length} total
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gin bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="label text-muted-foreground">Loading categories…</p>
          </div>
        ) : categories?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="h-8 w-8 text-muted-foreground/30" strokeWidth={1.25} />
            <p className="mt-3 label text-muted-foreground">No categories yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Add your first category below</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gin bg-gin/10">
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">Label (EN)</th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">Slug</th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">Order</th>
                <th className="px-4 py-3 text-right label text-[0.5rem] tracking-[0.15em] text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <Fragment key={cat._id}>
                  <tr
                    className="cursor-pointer border-b border-gin/50 last:border-0 transition-colors hover:bg-gin/5"
                    onClick={() => setExpandedId(expandedId === cat._id ? null : cat._id)}
                  >
                    <td className="px-4 py-3">
                      <span className="inline-block w-4 text-muted-foreground">
                        {expandedId === cat._id ? (
                          <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                        )}
                      </span>
                      <span className="font-medium">{cat.label.en}</span>
                      {cat.label.fr && (
                        <span className="ml-2 text-xs text-muted-foreground">· {cat.label.fr}</span>
                      )}
                      {cat.label.ar && (
                        <span className="ml-2 text-xs text-muted-foreground" dir="rtl">· {cat.label.ar}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 num text-xs text-muted-foreground">{cat.slug}</td>
                    <td className="px-4 py-3 num text-xs">{cat.order}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => startEdit(cat)}
                        className="label inline-flex items-center gap-1 text-[0.45rem] tracking-widest text-muted-foreground transition-colors hover:text-sumi mr-3"
                      >
                        <Edit className="h-3 w-3" strokeWidth={1.5} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cat)}
                        disabled={deleting}
                        className="label inline-flex items-center gap-1 text-[0.45rem] tracking-widest text-shu/60 transition-colors hover:text-shu disabled:opacity-40"
                      >
                        <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                        Delete
                      </button>
                    </td>
                  </tr>
                  {expandedId === cat._id && (
                    <tr>
                      <td colSpan={4} className="p-0 border-b border-gin/50">
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

      {/* --- Decision Dialog: Category has items --- */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-sumi/60 p-4">
          <div className="w-full max-w-md bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-shu" strokeWidth={1.5} />
                  <h2 className="font-display text-xl">
                    "{pendingDelete.label}"
                  </h2>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  This category has <span className="num font-medium">{pendingDelete.itemCount}</span> item(s).
                  Choose what to do with them before deleting.
                </p>
              </div>
              <button
                onClick={() => { setPendingDelete(null); setReassignTarget(''); }}
                className="text-muted-foreground hover:text-sumi transition-colors"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {/* Option 1: Delete items too */}
              <div className="border border-shu/20 bg-shu/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 flex items-center justify-center border border-shu/30 bg-shu/10">
                    <Trash2 className="h-3.5 w-3.5 text-shu" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Delete the items too</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Permanently removes all {pendingDelete.itemCount} item(s). Cannot be undone.
                    </p>
                    <button
                      onClick={handleDeleteItems}
                      disabled={deleting}
                      className="mt-3 label flex items-center gap-1.5 bg-shu px-4 py-2 text-[0.5rem] tracking-[0.15em] text-washi transition-colors hover:bg-shu/90 disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                      Delete items & category
                    </button>
                  </div>
                </div>
              </div>

              {/* Option 2: Reassign items */}
              <div className="border border-gin p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 flex items-center justify-center border border-gin">
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Move items to another category</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <select
                        value={reassignTarget}
                        onChange={(e) => setReassignTarget(e.target.value)}
                        className="flex-1 min-w-35 border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
                      >
                        <option value="">Select category…</option>
                        {otherCategories.map((c) => (
                          <option key={c._id} value={c.slug}>{c.label.en}</option>
                        ))}
                      </select>
                      <button
                        onClick={handleReassign}
                        disabled={!reassignTarget || deleting}
                        className="label bg-sumi px-4 py-2 text-[0.5rem] tracking-[0.15em] text-washi transition-colors hover:bg-sumi/90 disabled:opacity-50"
                      >
                        Move & delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => { setPendingDelete(null); setReassignTarget(''); }}
                className="label text-[0.5rem] tracking-[0.15em] text-muted-foreground transition-colors hover:text-sumi"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Add / Edit Form --- */}
      <div className="mt-10 border border-gin bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="label text-[0.5rem] tracking-[0.2em] text-muted-foreground">
              {editingId ? 'Edit category' : 'Add new category'}
            </p>
            <h2 className="mt-1 font-display text-xl">
              {editingId ? 'Edit category' : 'Create category'}
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
                Slug
              </label>
              <input
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))}
                disabled={!!editingId}
                required
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm disabled:bg-gin/20 disabled:text-muted-foreground focus:border-shu focus:outline-none"
              />
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                Order (display position)
              </label>
              <input
                type="number" min="0"
                value={form.order}
                onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value, 10) || 0 }))}
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                Label (English)
              </label>
              <input
                value={form.label.en}
                onChange={(e) => handleLabelEnChange(e.target.value)}
                required
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                Label (French)
              </label>
              <input
                value={form.label.fr}
                onChange={(e) => setForm((p) => ({ ...p, label: { ...p.label, fr: e.target.value } }))}
                required
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                Label (Arabic)
              </label>
              <input
                value={form.label.ar}
                dir="rtl"
                onChange={(e) => setForm((p) => ({ ...p, label: { ...p.label, ar: e.target.value } }))}
                required
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="label text-shu">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button
              variant="primary"
              type="submit"
              disabled={saving}
              className="label px-6 py-3 transition-colors hover:bg-sumi/90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add category'}
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

export default Categories;