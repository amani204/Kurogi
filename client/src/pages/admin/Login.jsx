import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AutContext';
import Button from '../../components/ui/Button';
import { Mail, LockKeyhole, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login, logout, user } = useAuth();
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
            ? "These credentials belong to a staff account. Switch to the Staff tab above."
            : "These credentials belong to the owner account. Switch to the Owner tab above."
        );
        return;
      }

      sessionStorage.removeItem('admin_unlocked');
      const dest = location.state?.from || '/admin';
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-washi px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="label text-[0.55rem] tracking-[0.35em] text-shu">Internal Access</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-sumi">Sign in</h1>
        </div>

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
              {option === 'owner' ? 'Owner' : 'Staff'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
              Email
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
                placeholder="admin@restaurant.com"
                className="w-full border border-gin bg-transparent pl-10 pr-3 py-2.5 text-sm text-sumi placeholder:text-muted-foreground/40 focus:border-shu focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5">
              Password
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
                placeholder="••••••••"
                className="w-full border border-gin bg-transparent pl-10 pr-3 py-2.5 text-sm text-sumi placeholder:text-muted-foreground/40 focus:border-shu focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="border border-shu/30 bg-shu/5 px-4 py-3">
              <p className="label text-[0.5rem] tracking-widest text-shu/80">{error}</p>
            </div>
          )}

          <Button
            variant="primary"
            type="submit"
            disabled={submitting}
            className="group w-full bg-shu text-washi hover:bg-shu/90"
          >
            <span className="label flex items-center justify-center gap-2 text-[0.55rem] tracking-[0.2em]">
              {submitting ? 'Signing in…' : `Sign in as ${role === 'owner' ? 'Owner' : 'Staff'}`}
              {!submitting && (
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              )}
            </span>
          </Button>
        </form>

        <p className="mt-6 text-center label text-[0.4rem] tracking-[0.25em] text-muted-foreground/50">
          Authorized restaurant staff only
        </p>
      </div>
    </div>
  );
};

export default Login;