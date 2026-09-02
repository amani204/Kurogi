import { useState, useMemo } from 'react';
import { useFetch } from '../../hooks/useFetch';
import {
  fetchMenu, fetchCategories, createMenuItem, updateMenuItem,
  deleteMenuItem, toggleAvailability, toggleFeatured, uploadImage,
} from '../../features/menu/api';
import { cn } from '../../lib/utils';
import { formatPrice } from '../../features/menu/utils/formatPrice';
import { useAdminLang } from '../../i18n/index-admin';
import Button from '../../components/ui/Button';
import { Edit, Trash2, Plus, X, Image as ImageIcon, Check, Star } from 'lucide-react';

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
  const { t, lang } = useAdminLang();
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [uploading, setUploading] = useState(false);

  const { data: items, loading: itemsLoading } = useFetch(() => fetchMenu({}), [refreshKey]);
  const { data: categories, loading: categoriesLoading } = useFetch(fetchCategories, []);

  const categoryLabel = useMemo(() => {
    const map = {};
    (categories || []).forEach((c) => { map[c.slug] = c.label; });
    return map;
  }, [categories]);

  const getCategoryLabel = (cat) => {
    return cat?.[lang] || cat?.en || cat?.fr || 'Unknown';
  };

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
      setError(err.response?.data?.message || t('menuEditor.uploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.slug || !form.name.en || !form.name.fr || !form.name.ar || !form.category || form.price === '' || !form.photoUrl) {
      setError(t('menuEditor.requiredFields'));
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
      console.error('Save failed:', err.response?.data || err.message);
      const serverMsg = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors;
      if (validationErrors?.length) {
        setError(validationErrors.map((e) => e.msg).join(', '));
      } else {
        setError(serverMsg || t('menuEditor.failedToSave'));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('menuEditor.deleteConfirm'))) return;
    setBusyId(id);
    try {
      await deleteMenuItem(id);
      if (editingId === id) resetForm();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err.response?.data?.message || t('menuEditor.failedToDelete'));
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
      {/* Header */}
      <div className="mb-8">
        <p className="label text-[0.6rem] tracking-[0.3em] text-muted-foreground">
          {t('menuEditor.menuAdministration')}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight">{t('menuEditor.menuEditorTitle')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('menuEditor.menuEditorDescription')}
          {items && (
            <span className="ml-2 num text-muted-foreground">
              · {items.length} {t('menuEditor.items')}
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gin bg-white">
        {itemsLoading || categoriesLoading ? (
          <div className="flex items-center justify-center py-16">
            <p className="label text-muted-foreground">{t('menuEditor.loading')}</p>
          </div>
        ) : items?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ImageIcon className="h-8 w-8 text-muted-foreground/30" strokeWidth={1.25} />
            <p className="mt-3 label text-muted-foreground">{t('menuEditor.noItems')}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t('menuEditor.addFirstItem')}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gin bg-gin/10">
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('menuEditor.name')}</th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('menuEditor.category')}</th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('menuEditor.price')}</th>
                <th className="px-4 py-3 text-center label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('menuEditor.available')}</th>
                <th className="px-4 py-3 text-center label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('menuEditor.featured')}</th>
                <th className="px-4 py-3 text-right label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('menuEditor.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b border-gin/50 last:border-0 transition-colors hover:bg-gin/5">
                  <td className="px-4 py-3 font-medium">{item.name[lang] || item.name.en}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {getCategoryLabel(categoryLabel[item.category]) || item.category}
                  </td>
                  <td className="px-4 py-3 num font-medium">{formatPrice(item.price, lang)}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleAvailable(item._id)}
                      disabled={busyId === item._id}
                      className={cn(
                        "label px-3 py-1 text-[0.45rem] tracking-widest transition-colors disabled:opacity-40",
                        item.available
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      )}
                    >
                      {item.available ? t('menuEditor.available') : t('menuEditor.soldOut')}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleFeatured(item._id)}
                      disabled={busyId === item._id}
                      className={cn(
                        "label flex items-center justify-center gap-1.5 px-3 py-1 text-[0.45rem] tracking-widest transition-colors disabled:opacity-40 mx-auto",
                        item.featured
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          : "bg-gin/30 text-muted-foreground hover:bg-gin/50"
                      )}
                    >
                      <Star className="h-3 w-3" strokeWidth={1.5} />
                      {item.featured ? t('menuEditor.featured') : t('menuEditor.notFeatured')}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="label inline-flex items-center gap-1 text-[0.45rem] tracking-widest text-muted-foreground transition-colors hover:text-sumi"
                      >
                        <Edit className="h-3 w-3" strokeWidth={1.5} />
                        {t('menuEditor.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={busyId === item._id}
                        className="label inline-flex items-center gap-1 text-[0.45rem] tracking-widest text-shu/60 transition-colors hover:text-shu disabled:opacity-40"
                      >
                        <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                        {t('menuEditor.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form */}
      <div className="mt-10 border border-gin bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="label text-[0.5rem] tracking-[0.2em] text-muted-foreground">
              {editingId ? t('menuEditor.editItem') : t('menuEditor.addNewItem')}
            </p>
            <h2 className="mt-1 font-display text-xl">
              {editingId ? t('menuEditor.editItem') : t('menuEditor.createItem')}
            </h2>
          </div>
          {editingId && (
            <button
              onClick={resetForm}
              className="label flex items-center gap-1.5 text-[0.45rem] tracking-[0.15em] text-muted-foreground transition-colors hover:text-sumi"
            >
              <X className="h-3 w-3" strokeWidth={1.5} />
              {t('menuEditor.cancelEdit')}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                {t('menuEditor.slug')}
              </label>
              <input
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))}
                disabled={!!editingId}
                required
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm disabled:bg-gin/20 disabled:text-muted-foreground focus:border-shu focus:outline-none"
              />
              {editingId && (
                <p className="mt-1.5 text-[0.45rem] text-muted-foreground">
                  {t('menuEditor.slugNotEditable')}
                </p>
              )}
            </div>

            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                {t('menuEditor.category')}
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                required
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              >
                <option value="" disabled>{t('menuEditor.selectCategory')}</option>
                {categories?.map((c) => (
                  <option key={c._id} value={c.slug}>{getCategoryLabel(c.label)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                {t('menuEditor.nameEn')}
              </label>
              <input
                value={form.name.en}
                onChange={(e) => handleNameEnChange(e.target.value)}
                required
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                {t('menuEditor.nameFr')}
              </label>
              <input
                value={form.name.fr}
                onChange={(e) => setForm((p) => ({ ...p, name: { ...p.name, fr: e.target.value } }))}
                required
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                {t('menuEditor.nameAr')}
              </label>
              <input
                value={form.name.ar}
                onChange={(e) => setForm((p) => ({ ...p, name: { ...p.name, ar: e.target.value } }))}
                required
                dir="rtl"
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                {t('menuEditor.descriptionEn')}
              </label>
              <textarea
                rows={2}
                value={form.description.en}
                onChange={(e) => setForm((p) => ({ ...p, description: { ...p.description, en: e.target.value } }))}
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                {t('menuEditor.descriptionFr')}
              </label>
              <textarea
                rows={2}
                value={form.description.fr}
                onChange={(e) => setForm((p) => ({ ...p, description: { ...p.description, fr: e.target.value } }))}
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                {t('menuEditor.descriptionAr')}
              </label>
              <textarea
                rows={2}
                dir="rtl"
                value={form.description.ar}
                onChange={(e) => setForm((p) => ({ ...p, description: { ...p.description, ar: e.target.value } }))}
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                {t('menuEditor.price')}
              </label>
              <input
                type="number" min="0" step="1"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                required
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
                placeholder="e.g. 1500"
              />
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                {t('menuEditor.photo')}
              </label>
              <div className="flex items-center gap-4">
                {form.photoUrl && (
                  <img
                    src={form.photoUrl}
                    alt="Preview"
                    className="h-16 w-16 object-cover border border-gin"
                  />
                )}
                <div className="flex-1">
                  <input
                    key={fileInputKey}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="w-full text-sm"
                  />
                  {uploading && <p className="mt-1 text-xs text-muted-foreground">{t('menuEditor.uploading')}</p>}
                  {!form.photoUrl && !uploading && (
                    <p className="mt-1 text-xs text-muted-foreground">{t('menuEditor.noImageSelected')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm text-sumi">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm((p) => ({ ...p, available: e.target.checked }))}
                className="border-gin focus:border-shu focus:outline-none"
              />
              {t('menuEditor.available')}
            </label>
            <label className="flex items-center gap-2 text-sm text-sumi">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                className="border-gin focus:border-shu focus:outline-none"
              />
              <Star className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.5} />
              {t('menuEditor.featuredOnHomepage')}
            </label>
          </div>

          {error && (
            <p className="label text-shu">
              <X className="inline-block h-3.5 w-3.5 mr-1.5" strokeWidth={1.5} />
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="primary"
              type="submit"
              disabled={saving || uploading}
              className="label px-6 py-3 text-[0.55rem] tracking-[0.2em] text-washi transition-colors hover:bg-sumi/90 disabled:opacity-50"
            >
              {saving ? t('menuEditor.saving') : editingId ? t('menuEditor.saveChanges') : t('menuEditor.addItem')}
            </Button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="label border border-gin px-6 py-3 text-[0.55rem] tracking-[0.2em] text-muted-foreground transition-colors hover:border-sumi hover:text-sumi"
              >
                {t('menuEditor.cancel')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuEditor;