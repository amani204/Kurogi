import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AutContext';
import { useFetch } from '../../hooks/useFetch';
import { fetchAllBookings } from '../../features/booking/api';
import { fetchAllOrders } from '../../features/orders/api';
import { formatPrice } from '../../features/menu/utils/formatPrice';
import { restaurant } from '../../features/restaurant/data';
import { Calendar, ShoppingBag, Users, DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

const todayISO = () => new Date().toISOString().split('T')[0];

const StatCard = ({ label, value, sub, to, icon: Icon }) => {
  const content = (
    <div className="group border border-gin bg-white p-6 transition-colors hover:border-sumi/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="label text-[0.55rem] tracking-[0.2em] text-muted-foreground">{label}</p>
          <p className="num mt-2 text-3xl">{value}</p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </div>
        {Icon && (
          <Icon className="h-5 w-5 text-muted-foreground/40 group-hover:text-sumi transition-colors" strokeWidth={1.25} />
        )}
      </div>
    </div>
  );
  return to ? <Link to={to} className="block">{content}</Link> : content;
};

const InsightCard = ({ title, value, sub, icon: Icon, trend, trendLabel }) => {
  return (
    <div className="border border-gin bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="label text-[0.5rem] tracking-[0.2em] text-muted-foreground">{title}</p>
          <p className="num mt-2 text-2xl">{value}</p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </div>
        {Icon && (
          <Icon className="h-5 w-5 text-muted-foreground/40" strokeWidth={1.25} />
        )}
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-2 border-t border-gin/50 pt-3">
          <span className={cn(
            "label flex items-center gap-1 text-[0.45rem] tracking-widest",
            trend >= 0 ? "text-nori" : "text-shu"
          )}>
            {trend >= 0 ? (
              <TrendingUp className="h-3 w-3" strokeWidth={1.5} />
            ) : (
              <TrendingDown className="h-3 w-3" strokeWidth={1.5} />
            )}
            {Math.abs(trend)}%
          </span>
          <span className="text-[0.45rem] text-muted-foreground">{trendLabel || 'vs last month'}</span>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { data: bookings, loading: bookingsLoading } = useFetch(() => fetchAllBookings({}), []);
  const { data: orders, loading: ordersLoading } = useFetch(() => fetchAllOrders({}), []);

  const stats = useMemo(() => {
    if (!bookings || !orders) return null;

    const today = todayISO();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Bookings stats
    const bookingsToday = bookings.filter((b) => b.date?.split('T')[0] === today);
    const pendingBookings = bookings.filter((b) => b.status === 'pending');

    // Orders stats
    const completedOrders = orders.filter((o) => o.status === 'completed');
    const revenue = completedOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const openOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length;

    // Monthly revenue (completed orders only)
    const monthlyRevenue = completedOrders
      .filter((o) => {
        const date = new Date(o.createdAt || o.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    // Previous month revenue for trend
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthRevenue = completedOrders
      .filter((o) => {
        const date = new Date(o.createdAt || o.date);
        return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
      })
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const revenueTrend = prevMonthRevenue > 0 
      ? Math.round(((monthlyRevenue - prevMonthRevenue) / prevMonthRevenue) * 100)
      : monthlyRevenue > 0 ? 100 : 0;

    // Bookings insights
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
    const completedBookings = bookings.filter((b) => b.status === 'completed').length;
    const cancelledBookings = bookings.filter((b) => b.status === 'cancelled').length;

    const monthlyBookings = bookings.filter((b) => {
      const date = new Date(b.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const prevMonthBookings = bookings.filter((b) => {
      const date = new Date(b.date);
      return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
    });

    const bookingsTrend = prevMonthBookings.length > 0
      ? Math.round(((monthlyBookings.length - prevMonthBookings.length) / prevMonthBookings.length) * 100)
      : monthlyBookings.length > 0 ? 100 : 0;

    // Get 5 most recent bookings
    const recentBookings = [...bookings]
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .slice(0, 5);

    return {
      bookingsToday: bookingsToday.length,
      pendingBookings: pendingBookings.length,
      openOrders,
      revenue,
      monthlyRevenue,
      revenueTrend,
      totalBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      monthlyBookings: monthlyBookings.length,
      bookingsTrend,
      recentBookings,
    };
  }, [bookings, orders]);

  const loading = bookingsLoading || ordersLoading;

  const StatusDot = ({ status }) => {
    const colors = {
      confirmed: "bg-nori",
      pending: "bg-kin",
      completed: "bg-sumi",
      cancelled: "bg-shu/50",
    };
    return <div className={cn("h-2 w-2 rounded-full", colors[status] || "bg-gin")} />;
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      confirmed: "bg-nori/10 text-nori",
      pending: "bg-kin/10 text-kin",
      completed: "bg-sumi/10 text-sumi",
      cancelled: "bg-shu/10 text-shu",
    };
    return (
      <span className={cn(
        "label px-2 py-1 text-[0.45rem] tracking-widest",
        styles[status] || "bg-gin/10 text-muted-foreground"
      )}>
        {status}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="label text-[0.6rem] tracking-[0.3em] text-muted-foreground">
          {restaurant.name} · Internal Dashboard
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight">
          Welcome, {user?.name || 'User'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          You're signed in as <span className="capitalize">{user?.role || 'staff'}</span>. 
          Use the sidebar to manage bookings, orders, and 
          {user?.role === 'owner' ? ' the menu and restaurant settings.' : ' restaurant operations.'}
        </p>
      </div>

      {/* 4 Key Stats */}
      {loading ? (
        <div className="mt-8 flex items-center justify-center py-12">
          <p className="label text-muted-foreground">Loading stats…</p>
        </div>
      ) : stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Today's bookings"
              value={stats.bookingsToday}
              icon={Calendar}
              to="/admin/bookings"
            />
            <StatCard
              label="Pending bookings"
              value={stats.pendingBookings}
              sub="Awaiting confirmation"
              icon={Users}
              to="/admin/bookings"
            />
            <StatCard
              label="Open orders"
              value={stats.openOrders}
              sub="In progress"
              icon={ShoppingBag}
              to="/admin/orders"
            />
            <StatCard
              label="Revenue"
              value={formatPrice(stats.revenue)}
              sub="From completed orders"
              icon={DollarSign}
              to="/admin/orders"
            />
          </div>

          {/* Insights - Monthly Revenue & Bookings */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InsightCard
              title="Monthly Revenue"
              value={formatPrice(stats.monthlyRevenue)}
              sub={`${stats.completedOrders} completed orders this month`}
              icon={TrendingUp}
              trend={stats.revenueTrend}
              trendLabel="vs last month"
            />
            <InsightCard
              title="Monthly Bookings"
              value={stats.monthlyBookings}
              sub={`${stats.confirmedBookings} confirmed · ${stats.completedBookings} completed · ${stats.cancelledBookings} cancelled`}
              icon={Calendar}
              trend={stats.bookingsTrend}
              trendLabel="vs last month"
            />
          </div>

          {/* Quick Actions */}
          <div className="mt-10 border-t border-gin pt-8">
            <p className="label text-[0.55rem] tracking-[0.3em] text-muted-foreground">Quick actions</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/admin/bookings"
                className="label flex items-center gap-2 border border-gin px-5 py-3 text-[0.55rem] tracking-[0.15em] text-muted-foreground transition-colors hover:border-sumi hover:text-sumi"
              >
                <Calendar className="h-3.5 w-3.5" strokeWidth={1.25} />
                View all bookings
              </Link>
              <Link
                to="/admin/orders"
                className="label flex items-center gap-2 border border-gin px-5 py-3 text-[0.55rem] tracking-[0.15em] text-muted-foreground transition-colors hover:border-sumi hover:text-sumi"
              >
                <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.25} />
                View all orders
              </Link>
              {user?.role === 'owner' && (
                <Link
                  to="/admin/menu"
                  className="label flex items-center gap-2 bg-shu px-5 py-3 text-[0.55rem] tracking-[0.15em] text-washi transition-colors hover:bg-shu/90"
                >
                  <Clock className="h-3.5 w-3.5" strokeWidth={1.25} />
                  Update menu
                </Link>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-8 text-sm text-shu">Couldn't load dashboard stats.</div>
      )}
    </div>
  );
};

export default Dashboard;