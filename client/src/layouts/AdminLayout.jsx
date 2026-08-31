import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AutContext'
import { useFetch } from '../hooks/useFetch';
import { fetchRestaurantSettings } from '../features/restaurant/api';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingBag, 
  Menu, 
  Image, 
  Settings, 
  LogOut, 
  Bike, 
  User,
  Globe
} from 'lucide-react';
import { useAdminLang } from '../i18n/index-admin';
import LanguageSwitcher from '../components/admin/LanguageSwitcher';

const navItems = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'dashboardPage' },
  { to: '/admin/bookings', icon: Calendar, label: 'reservationsPage' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'ordersPage' },
];

const ownerItems = [
  { to: '/admin/menu', icon: Menu, label: 'menuPage' },
  { to: '/admin/categories', icon: Image, label: 'categoriesPage' },
  { to: '/admin/delivery-zones', icon: Bike, label: 'deliveryZonesPage' },
  { to: '/admin/settings', icon: Settings, label: 'settingsPage' },
];

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const { data: restaurant } = useFetch(fetchRestaurantSettings, []);
  const { t, lang, setLang } = useAdminLang();

  const isRTL = lang === 'ar';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="label text-muted-foreground">{t('loading')}</p>
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
    <div className="flex min-h-screen bg-washi" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar - with RTL support */}
      <aside className={cn(
        "fixed inset-y-0 z-40 w-64 shrink-0 border-r border-gin bg-washi",
        isRTL ? "right-0 border-l border-r-0" : "left-0"
      )}>
        <div className="border-b border-gin px-6 py-5">
          <p className="label text-[0.6rem] tracking-[0.4em] text-muted-foreground">
            {restaurant?.name || '...'}
          </p>
          <p className="label text-[0.4rem] tracking-[0.15em] text-muted-foreground">
            {user?.role === 'owner' ? t('owner') : t('staff')}
          </p>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              <item.icon className="h-3.5 w-3.5" strokeWidth={1.25} />
              {t(item.label)}
            </NavLink>
          ))}

          <NavLink to="/admin/users" className={linkClass}>
            <User className="h-3.5 w-3.5" strokeWidth={1.25} />
            {t('usersPage')}
          </NavLink>

          {user.role === 'owner' && (
            <>
              <div className="my-4 border-t border-gin pt-4">
                <p className="label px-3 pb-2 text-[0.5rem] tracking-[0.2em] text-muted-foreground">
                  {t('owner')}
                </p>
              </div>
              {ownerItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  <item.icon className="h-3.5 w-3.5" strokeWidth={1.25} />
                  {t(item.label)}
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
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main content with top bar */}
      <div className={cn(
        "flex-1",
        isRTL ? "mr-64" : "ml-64"
      )}>
        {/* Top Bar */}
        <header dir='ltr' className="sticky top-0 z-30 border-b border-gin bg-washi/80 backdrop-blur-sm">
          <div className={cn(
            "flex h-16 items-center justify-between px-8",
            isRTL && "flex-row-reverse"
          )}>
            <div className={isRTL ? "text-right" : ""}>
              <p className="label text-[0.5rem] tracking-[0.2em] text-muted-foreground">
                {t('dashboardPage')}
              </p>
              <h1 className="font-display text-lg leading-tight">
                {user?.name || 'User'}
              </h1>
            </div>

            <div className={cn(
              "flex items-center gap-4",
              isRTL && "flex-row-reverse"
            )}>
              <div className="flex items-center gap-4">
               <LanguageSwitcher variant="default" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;