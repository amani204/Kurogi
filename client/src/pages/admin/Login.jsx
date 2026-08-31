import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AutContext';
import Button from '../../components/ui/Button';
import { Mail, LockKeyhole, ArrowRight } from 'lucide-react';
import { useAdminLang } from '../../i18n/index-admin';
import LanguageSwitcher from '../../components/admin/LanguageSwitcher';

const Login = () => {
  const { login, logout, user } = useAuth();
  const { t } = useAdminLang();
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState('owner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser.role !== role) {
        await logout();
        setError(
          role === 'owner'
            ? t('login.ownerCredentialsError')
            : t('login.staffCredentialsError')
        );
        return;
      }

      sessionStorage.removeItem('admin_unlocked');
      const dest = location.state?.from || '/admin';
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || t('login.loginFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-washi px-4">
      <div className="w-full max-w-sm">
        {/* Language Switcher - Very Top */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher variant="login" />
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <p className="label text-[0.55rem] tracking-[0.35em] text-shu">
            {t('login.internalAccess')}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-sumi">
            {t('login.signIn')}
          </h1>
        </div>

        {/* Role Tabs */}
        <div className="flex border border-gin">
          {['owner', 'staff'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => { setRole(option); setError(null); }}
              className={`
                flex-1 py-3 label text-[0.5rem] tracking-[0.2em] transition-colors
                ${role === option ? 'bg-sumi text-washi' : 'text-muted-foreground hover:bg-sumi/5'}
              `}
            >
              {option === 'owner' ? t('login.owner') : t('login.staff')}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Email */}
          <div>
            <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
              {t('login.email')}
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40"
                strokeWidth={1.25}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('login.emailPlaceholder')}
                className="w-full border border-gin bg-transparent pl-10 pr-3 py-2.5 text-sm text-sumi placeholder:text-muted-foreground/40 focus:border-shu focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
              {t('login.password')}
            </label>
            <div className="relative">
              <LockKeyhole
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40"
                strokeWidth={1.25}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.passwordPlaceholder')}
                className="w-full border border-gin bg-transparent pl-10 pr-3 py-2.5 text-sm text-sumi placeholder:text-muted-foreground/40 focus:border-shu focus:outline-none"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="border border-shu/30 bg-shu/5 px-4 py-3">
              <p className="label text-[0.5rem] tracking-widest text-shu/80">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            variant="primary"
            type="submit"
            disabled={submitting}
            className="group w-full bg-shu text-washi hover:bg-shu/90"
          >
            <span className="label flex items-center justify-center gap-2 text-[0.55rem] tracking-[0.2em]">
              {submitting ? t('login.signingIn') : t('login.signInAs', { role: role === 'owner' ? t('login.owner') : t('login.staff') })}
              {!submitting && (
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              )}
            </span>
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center label text-[0.4rem] tracking-[0.25em] text-muted-foreground/50">
          {t('login.authorizedStaffOnly')}
        </p>
      </div>
    </div>
  );
};

export default Login;