import { useState } from 'react';
import { useAuth } from '../../features/auth/context/AutContext';
import { useFetch } from '../../hooks/useFetch';
import { registerStaff, fetchStaff, deleteStaffAccount, updateMe } from '../../features/auth/api';
import { Users as UsersIcon, User, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAdminLang } from '../../i18n/index-admin';

const Users = () => {
  const { user, refreshUser } = useAuth();
  const { t } = useAdminLang();

  // --- My Account ---
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '', email: user?.email || '', currentPassword: '', newPassword: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSaved, setProfileSaved] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSaved(false);

    if (profileForm.newPassword && !profileForm.currentPassword) {
      setProfileError(t('users.currentPasswordRequired'));
      return;
    }

    setProfileSaving(true);
    try {
      const payload = { name: profileForm.name, email: profileForm.email };
      if (profileForm.newPassword) {
        payload.currentPassword = profileForm.currentPassword;
        payload.newPassword = profileForm.newPassword;
      }
      await updateMe(payload);
      await refreshUser();
      setProfileForm((p) => ({ ...p, currentPassword: '', newPassword: '' }));
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      const validationErrors = err.response?.data?.errors;
      setProfileError(
        validationErrors?.length
          ? validationErrors.map((e) => e.msg).join(', ')
          : err.response?.data?.message || t('users.failedToUpdateAccount')
      );
    } finally {
      setProfileSaving(false);
    }
  };

  // --- Staff management (owner only) ---
  const [staffForm, setStaffForm] = useState({ name: '', email: '', password: '' });
  const [staffSaving, setStaffSaving] = useState(false);
  const [staffError, setStaffError] = useState(null);
  const [staffCreated, setStaffCreated] = useState(null);
  const [staffRefreshKey, setStaffRefreshKey] = useState(0);
  const [removingId, setRemovingId] = useState(null);

  const { data: staffList, loading: staffLoading } = useFetch(
    () => (user?.role === 'owner' ? fetchStaff() : Promise.resolve([])),
    [staffRefreshKey, user?.role]
  );

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setStaffError(null);
    setStaffCreated(null);

    if (!staffForm.name || !staffForm.email || !staffForm.password) {
      setStaffError(t('users.staffFieldsRequired'));
      return;
    }
    if (staffForm.password.length < 8) {
      setStaffError(t('users.passwordMinLength'));
      return;
    }

    setStaffSaving(true);
    try {
      const submittedEmail = staffForm.email;
      const created = await registerStaff(staffForm);
      setStaffCreated({ ...created, email: submittedEmail });
      setStaffForm({ name: '', email: '', password: '' });
      setStaffRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Staff creation error:', err.response?.status, err.response?.data);
      const validationErrors = err.response?.data?.errors;
      setStaffError(
        validationErrors?.length
          ? validationErrors.map((e) => e.msg).join(', ')
          : err.response?.data?.message || t('users.failedToCreateStaff')
      );
    } finally {
      setStaffSaving(false);
    }
  };

  const handleRemoveStaff = async (id, name) => {
    if (!confirm(t('users.removeStaffConfirm', { name }))) return;
    setRemovingId(id);
    try {
      await deleteStaffAccount(id);
      setStaffRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err.response?.data?.message || t('users.failedToRemoveStaff'));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="label text-[0.6rem] tracking-[0.3em] text-muted-foreground">
          {t('users.administrationUsers')}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight">{t('users.usersTitle')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {user?.role === 'owner' ? t('users.usersDescriptionOwner') : t('users.usersDescriptionStaff')}
        </p>
      </div>

      {/* --- My Account --- */}
      <div className="border border-gin bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <h2 className="font-display text-xl">{t('users.myAccount')}</h2>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                {t('users.name')}
              </label>
              <input
                value={profileForm.name}
                onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
            <div>
              <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                {t('users.email')}
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-gin pt-4">
            <p className="label text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-3">
              {t('users.changePasswordOptional')}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                  {t('users.currentPassword')}
                </label>
                <input
                  type="password"
                  value={profileForm.currentPassword}
                  onChange={(e) => setProfileForm((p) => ({ ...p, currentPassword: e.target.value }))}
                  className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
                />
              </div>
              <div>
                <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
                  {t('users.newPassword')}
                </label>
                <input
                  type="password"
                  value={profileForm.newPassword}
                  onChange={(e) => setProfileForm((p) => ({ ...p, newPassword: e.target.value }))}
                  className="w-full border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
                />
              </div>
            </div>
          </div>

          {profileError && (
            <p className="label text-shu">
              <AlertCircle className="inline-block h-3.5 w-3.5 mr-1.5" strokeWidth={1.5} />
              {profileError}
            </p>
          )}
          {profileSaved && (
            <p className="label text-nori">
              <CheckCircle className="inline-block h-3.5 w-3.5 mr-1.5" strokeWidth={1.5} />
              {t('users.accountUpdated')}
            </p>
          )}

          <Button 
            variant="primary" 
            type="submit" 
            disabled={profileSaving} 
            className="label px-6 py-3 text-[0.55rem] tracking-[0.2em] text-washi transition-colors hover:bg-sumi/90 disabled:opacity-50"
          >
            {profileSaving ? t('users.saving') : t('users.saveChanges')}
          </Button>
        </form>
      </div>

      {/* --- Staff Accounts (owner only) --- */}
      {user?.role === 'owner' && (
        <div className="mt-8 border border-gin bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <UsersIcon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <h2 className="font-display text-xl">{t('users.staffAccounts')}</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            {t('users.staffDescription')}
          </p>

          <div className="overflow-x-auto border border-gin">
            {staffLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="label text-muted-foreground">{t('users.loadingStaff')}</p>
              </div>
            ) : staffList?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <UsersIcon className="h-6 w-6 text-muted-foreground/30" strokeWidth={1.25} />
                <p className="mt-2 label text-muted-foreground">{t('users.noStaffAccounts')}</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gin bg-gin/10">
                    <th className="px-4 py-3 text-start label text-[0.45rem] tracking-[0.15em] text-muted-foreground">
                      {t('users.name')}
                    </th>
                    <th className="px-4 py-3 text-center label text-[0.45rem] tracking-[0.15em] text-muted-foreground">
                      {t('users.email')}
                    </th>
                    <th className="px-4 py-3 text-end label text-[0.45rem] tracking-[0.15em] text-muted-foreground">
                      {t('users.added')}
                    </th>
                    <th className="px-4 py-3 text-right label text-[0.45rem] tracking-[0.15em] text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {staffList?.map((s) => (
                    <tr key={s._id} className="border-b border-gin/50 last:border-0 transition-colors hover:bg-gin/5">
                      <td className="px-4 py-3 text-start font-medium">{s.name}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground">{s.email}</td>
                      <td className="px-4 py-3 num text-end text-xs text-muted-foreground">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-end">
                        <button
                          onClick={() => handleRemoveStaff(s._id, s.name)}
                          disabled={removingId === s._id}
                          className="label inline-flex items-center gap-1 text-[0.4rem] tracking-widest text-shu/60 transition-colors hover:text-shu disabled:opacity-40"
                        >
                          <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                          {t('users.remove')}
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
              {t('users.addStaffAccount')}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                placeholder={t('users.name')}
                value={staffForm.name}
                onChange={(e) => setStaffForm((p) => ({ ...p, name: e.target.value }))}
                className="border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
              <input
                type="email" 
                placeholder={t('users.email')}
                value={staffForm.email}
                onChange={(e) => setStaffForm((p) => ({ ...p, email: e.target.value }))}
                className="border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
              />
              <input
                type="password" 
                placeholder={t('users.passwordMinChars')}
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
                {t('users.accountCreated', { name: staffCreated.name, email: staffCreated.email })}
              </p>
            )}

            <Button
              variant="primary" 
              type="button" 
              onClick={handleStaffSubmit} 
              disabled={staffSaving}
              className="mt-6 label px-6 py-3 text-[0.55rem] tracking-[0.2em] text-washi transition-colors hover:bg-sumi/90 disabled:opacity-50"
            >
              {staffSaving ? t('users.creating') : t('users.createStaffAccount')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;