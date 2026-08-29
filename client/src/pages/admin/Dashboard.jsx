import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AutContext';
import { useFetch } from '../../hooks/useFetch';
import { fetchAllBookings } from '../../features/booking/api';
import { fetchAllOrders } from '../../features/orders/api';

const todayISO = () => new Date().toISOString().split('T')[0];

const StatCard = ({ label, value, sub, to }) => {
  const content = (
    <div className="rounded border border-neutral-200 bg-white p-5 hover:border-neutral-300 transition-colors">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-neutral-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-neutral-500">{sub}</p>}
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
};

const Dashboard = () => {
  const { user } = useAuth();

  const { data: bookings, loading: bookingsLoading } = useFetch(() => fetchAllBookings({}), []);
  const { data: orders, loading: ordersLoading } = useFetch(() => fetchAllOrders({}), []);

  const stats = useMemo(() => {
    if (!bookings || !orders) return null;

    const today = todayISO();

    const bookingsToday = bookings.filter((b) => b.date.split('T')[0] === today);
    const pendingBookings = bookings.filter((b) => b.status === 'pending');

    const pendingOrders = orders.filter((o) => o.status === 'pending');
    const completedOrders = orders.filter((o) => o.status === 'completed');
    const revenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    return {
      bookingsToday: bookingsToday.length,
      pendingBookings: pendingBookings.length,
      totalBookings: bookings.length,
      pendingOrders: pendingOrders.length,
      totalOrders: orders.length,
      revenue,
    };
  }, [bookings, orders]);

  const loading = bookingsLoading || ordersLoading;

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Welcome, {user.name}</h1>
      <p className="mt-1 text-sm text-neutral-500">
        You're signed in as {user.role}. Use the sidebar to manage bookings and orders
        {user.role === 'owner' ? ', the menu, and restaurant settings.' : '.'}
      </p>

      {loading ? (
        <div className="mt-8 text-sm text-neutral-400">Loading stats...</div>
      ) : stats ? (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          <StatCard
            label="Bookings today"
            value={stats.bookingsToday}
            to="/admin/bookings"
          />
          <StatCard
            label="Pending bookings"
            value={stats.pendingBookings}
            sub="Awaiting confirmation"
            to="/admin/bookings"
          />
          <StatCard
            label="Total bookings"
            value={stats.totalBookings}
            to="/admin/bookings"
          />
          <StatCard
            label="Pending orders"
            value={stats.pendingOrders}
            sub="Need attention"
            to="/admin/orders"
          />
          <StatCard
            label="Total orders"
            value={stats.totalOrders}
            to="/admin/orders"
          />
          <StatCard
            label="Revenue (completed)"
            value={`${stats.revenue.toLocaleString()} DA`}
            sub="From completed orders only"
            to="/admin/orders"
          />
        </div>
      ) : (
        <div className="mt-8 text-sm text-red-500">Couldn't load dashboard stats.</div>
      )}
    </div>
  );
};

export default Dashboard;