import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AutContext';

const linkClass = ({ isActive }) =>
  `block px-3 py-2 text-sm rounded transition-colors ${
    isActive ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
  }`;

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-neutral-400">Loading...</div>;
  }
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="w-56 shrink-0 border-r border-neutral-200 bg-white flex flex-col">
        <div className="px-4 py-5 border-b border-neutral-200">
          <p className="text-sm font-semibold text-neutral-900">Admin</p>
          <p className="text-xs text-neutral-400 mt-0.5">{user.name} · {user.role}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/bookings" className={linkClass}>Bookings</NavLink>
          <NavLink to="/admin/orders" className={linkClass}>Orders</NavLink>

          {user.role === 'owner' && (
            <>
              <div className="pt-3 mt-3 border-t border-neutral-200">
                <p className="px-3 pb-1 text-[0.65rem] uppercase tracking-wide text-neutral-400">Owner only</p>
              </div>
              <NavLink to="/admin/menu" className={linkClass}>Menu Editor</NavLink>
              <NavLink to="/admin/categories" className={linkClass}>Categories</NavLink>
              <NavLink to="/admin/delivery-zones" className={linkClass}>Delivery Zones</NavLink>
              <NavLink to="/admin/settings" className={linkClass}>Settings</NavLink>
            </>
          )}
        </nav>

        <div className="px-3 py-4 border-t border-neutral-200">
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;