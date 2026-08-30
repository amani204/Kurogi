import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// visiting the secret entry URL sets a flag, then forwards to the real login page
const AdminEntry = () => {
  useEffect(() => {
    sessionStorage.setItem('admin_unlocked', '1');
  }, []);
  return <Navigate to="/admin/login" replace />;
};

// wraps every /admin/* route. Lets through: already-authenticated users
// (real cookie session), or anyone who came in via the secret entry URL.
// Everyone else — including anyone typing /admin directly — gets bounced home.
export const AdminGateGuard = ({ children, user, loading }) => {
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-neutral-400">Loading...</p>
      </div>
    );
  }

  const unlocked = sessionStorage.getItem('admin_unlocked') === '1';
  if (!user && !unlocked) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminEntry;