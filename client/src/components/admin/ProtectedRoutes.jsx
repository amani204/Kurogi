import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AutContext';

// role: pass 'owner' to restrict further (Menu Editor, Settings);
// omit to allow any logged-in staff or owner
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-neutral-400">Loading...</div>;
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  if (role && user.role !== role) return <Navigate to="/admin" replace />;

  return children;
};

export default ProtectedRoute;