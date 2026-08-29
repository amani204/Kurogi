import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { fetchAllBookings, updateBookingStatus } from '../../features/booking/api';

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'no-show', 'cancelled'];

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  'no-show': 'bg-neutral-200 text-neutral-600',
  cancelled: 'bg-red-100 text-red-700',
};

const Bookings = () => {
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: bookings, loading, error } = useFetch(
    () => fetchAllBookings({ date: dateFilter || undefined, status: statusFilter || undefined }),
    [dateFilter, statusFilter, refreshKey]
  );

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateBookingStatus(id, newStatus);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Bookings</h1>
      <p className="mt-1 text-sm text-neutral-500">View and manage table reservations.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {(dateFilter || statusFilter) && (
          <button
            onClick={() => { setDateFilter(''); setStatusFilter(''); }}
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded border border-neutral-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-neutral-400">Loading...</div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-red-500">Couldn't load bookings.</div>
        ) : bookings?.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-400">No bookings found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Party</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Update</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap">{b.date.split('T')[0]}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{b.timeSlot}</td>
                  <td className="px-4 py-3">{b.customerName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{b.phone}</td>
                  <td className="px-4 py-3">{b.partySize}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      disabled={updatingId === b._id}
                      onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      className="rounded border border-neutral-300 px-2 py-1 text-xs disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Bookings;