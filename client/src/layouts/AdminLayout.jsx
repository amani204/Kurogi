import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AutContext'
import { useFetch } from '../hooks/useFetch';
import { fetchRestaurantSettings } from '../features/restaurant/api';
import { cn } from '../lib/utils';
import { LayoutDashboard, Calendar, ShoppingBag, Menu, Image, Settings, LogOut, Bike, User } from 'lucide-react';

const navItems = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/bookings', icon: Calendar, label: 'Bookings' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
];

const ownerItems = [
  { to: '/admin/menu', icon: Menu, label: 'Menu' },
  { to: '/admin/categories', icon: Image, label: 'Categories' },
  { to: '/admin/delivery-zones', icon: Bike, label: 'Delivery Zones' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const { data: restaurant } = useFetch(fetchRestaurantSettings, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="label text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  const linkClass = ({ isActive }) =>
    cn(
      'label flex items-center gap-3 rounded-none px-3 py-2.5 text-[0.6rem] tracking-widest transition-colors',
      isActive ? 'bg-sumi text-washi' : 'text-muted-foreground hover:bg-sumi/5 hover:text-sumi'
    );

  return (
    <div className="flex min-h-screen bg-washi">
      <aside className="fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-gin bg-washi">
        <div className="border-b border-gin px-6 py-5">
          <p className="label text-[0.6rem] tracking-[0.4em] text-muted-foreground">
            {restaurant?.name || '...'}
          </p>
          <p className="mt-1 text-xs font-light text-muted-foreground">Internal · {user.role}</p>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {/* shared: dashboard, bookings, orders — both roles */}
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              <item.icon className="h-3.5 w-3.5" strokeWidth={1.25} />
              {item.label}
            </NavLink>
          ))}

          {/* Users — both roles, staff manage their own account here */}
          <NavLink to="/admin/users" className={linkClass}>
            <User className="h-3.5 w-3.5" strokeWidth={1.25} />
            Users
          </NavLink>

          {/* owner-only section */}
          {user.role === 'owner' && (
            <>
              <div className="my-4 border-t border-gin pt-4">
                <p className="label px-3 pb-2 text-[0.5rem] tracking-[0.2em] text-muted-foreground">Owner</p>
              </div>
              {ownerItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  <item.icon className="h-3.5 w-3.5" strokeWidth={1.25} />
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="border-t border-gin p-3">
          <button
            onClick={logout}
            className="label flex w-full items-center gap-3 px-3 py-2.5 text-[0.6rem] tracking-widest text-muted-foreground transition-colors hover:text-shu"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.25} />
            Log out
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;