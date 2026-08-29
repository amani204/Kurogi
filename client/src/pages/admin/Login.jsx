// pages/Login.jsx
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ArrowRight } from "lucide-react";

import { useAuth } from "../../features/auth/context/AutContext";
import { restaurant } from "../../features/restaurant/data";
import Button from "../../components/ui/Button";

const Login = () => {
  const { login, user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Already authenticated
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      const dest = location.state?.from || "/admin";
      navigate(dest, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-washi px-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-washi via-washi to-gin/20" />
      
      {/* Decorative line */}
      <div className="absolute left-1/2 top-0 h-px w-24 -translate-x-1/2 bg-shu/20" />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl leading-tight text-sumi">
            {restaurant.name}
          </h1>
          <p className="mt-2 label text-[0.55rem] tracking-[0.3em] text-muted-foreground">
            Internal · Staff Portal
          </p>
        </div>

        {/* Login card */}
        <div className="border border-gin bg-white p-8">
          <div className="mb-6 text-center">
            <p className="label text-[0.5rem] tracking-[0.25em] text-muted-foreground">
              Sign in to manage
            </p>
            <p className="mt-1 font-display text-xl text-sumi">Welcome back</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40"
                  strokeWidth={1.25}
                />

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@restaurant.com"
                  className="w-full border border-gin bg-washi/50 py-3 pl-10 pr-3 text-sm text-sumi placeholder:text-muted-foreground/40 outline-none transition focus:border-shu/50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="label block text-[0.45rem] tracking-[0.2em] text-muted-foreground mb-1.5"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40"
                  strokeWidth={1.25}
                />

                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gin bg-washi/50 py-3 pl-10 pr-3 text-sm text-sumi placeholder:text-muted-foreground/40 outline-none transition focus:border-shu/50"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="border border-shu/30 bg-shu/5 px-4 py-3">
                <p className="label text-[0.5rem] tracking-widest text-shu/80">
                  {error}
                </p>
              </div>
            )}

            {/* Submit - Red Button */}
            <Button
            variant="primary"
              type="submit"
              disabled={submitting}
              className="group relative w-full"
            >
              <span className="label flex items-center justify-center gap-2 text-[0.55rem] tracking-[0.2em]">
                {submitting ? "Signing in…" : "Sign in"}
                {!submitting && (
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                )}
              </span>
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center label text-[0.4rem] tracking-[0.25em] text-muted-foreground/50">
          Authorized restaurant staff only
        </p>
      </div>
    </div>
  );
};

export default Login;