import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { fetchAllBookings, updateBookingStatus } from '../../features/booking/api';
import { cn } from '../../lib/utils';
import { Calendar, X } from 'lucide-react';
import { useAdminLang } from '../../i18n/index-admin';

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'no-show', 'cancelled'];

const STATUS_STYLES = {
  pending: 'bg-purple-100 text-purple-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  'no-show': 'bg-orange-100 text-orange-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_DOT = {
  pending: 'bg-purple-500',
  confirmed: 'bg-blue-500',
  completed: 'bg-green-500',
  'no-show': 'bg-orange-500',
  cancelled: 'bg-red-500',
};

const Bookings = () => {
  const { t } = useAdminLang();
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
      alert(err.response?.data?.message || t('bookings.failedToUpdateStatus'));
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilters = () => {
    setDateFilter('');
    setStatusFilter('');
  };

  const hasFilters = dateFilter || statusFilter;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="label text-[0.6rem] tracking-[0.3em] text-muted-foreground">
          {t('bookings.restaurantBookings')}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight">{t('bookings.bookingsTitle')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('bookings.bookingsDescription')}
          {bookings && (
            <span className="ml-2 num text-muted-foreground">
              · {bookings.length} {t('bookings.total')}
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-gin pb-6">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" strokeWidth={1.25} />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gin bg-transparent pl-9 pr-3 py-2 text-sm focus:border-shu focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
        >
          <option value="">{t('bookings.allStatuses')}</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="capitalize">{t(`bookings.status.${s}`)}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="label flex items-center gap-1.5 text-[0.5rem] tracking-[0.15em] text-muted-foreground transition-colors hover:text-shu"
          >
            <X className="h-3 w-3" strokeWidth={1.5} />
            {t('bookings.clearFilters')}
          </button>
        )}

        {hasFilters && bookings && (
          <span className="label ml-auto text-[0.45rem] tracking-[0.15em] text-muted-foreground">
            {bookings.length} {t('bookings.result')}{bookings.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto border border-gin bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="label text-muted-foreground">{t('bookings.loadingBookings')}</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16">
            <p className="label text-shu">{t('bookings.couldNotLoadBookings')}</p>
          </div>
        ) : bookings?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="label text-muted-foreground">{t('bookings.noBookingsFound')}</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-3 label text-[0.5rem] tracking-[0.15em] text-shu hover:underline"
              >
                {t('bookings.clearFilters')}
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gin bg-gin/10">
                <th className="px-4 py-3 text-start label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('bookings.date')}</th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('bookings.time')}</th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('bookings.customer')}</th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('bookings.phone')}</th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('bookings.party')}</th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('bookings.bookingStatus')}</th>
                <th className="px-4 py-3 text-end label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('bookings.update')}</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr 
                  key={b._id} 
                  className="border-b border-gin/50 last:border-0 transition-colors hover:bg-gin/5"
                >
                  <td className="px-4 py-3 num whitespace-nowrap text-xs">
                    {b.date?.split('T')[0]}
                  </td>
                  <td className="px-4 py-3 text-left num whitespace-nowrap text-xs">
                    {b.timeSlot}
                  </td>
                  <td className="px-4 py-3 text-left font-medium">
                    {b.customerName}
                  </td>
                  <td className="px-4 py-3 text-left num whitespace-nowrap text-xs text-muted-foreground">
                    {b.phone}
                  </td>
                  <td className="px-8 py-3 text-left num whitespace-nowrap text-xs">
                    {b.partySize}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "label inline-block px-2.5 py-1 text-[0.45rem] tracking-widest",
                      STATUS_STYLES[b.status] || 'bg-gin/20 text-muted-foreground'
                    )}>
                      {t(`bookings.status.${b.status}`)}
                    </span>
                  </td>
                  <td className="text-end px-4 py-3">
                    <select
                      value={b.status}
                      disabled={updatingId === b._id}
                      onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      className={cn(
                        "border text-center border-gin bg-transparent px-2 py-1 text-xs focus:border-shu focus:outline-none disabled:opacity-40",
                        updatingId === b._id && "animate-pulse"
                      )}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="capitalize">{t(`bookings.status.${s}`)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer stats */}
      {bookings && bookings.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {t('bookings.showing')} <span className="num">{bookings.length}</span> {t('bookings.bookings')}
          </p>
          <div className="flex gap-4">
            {STATUS_OPTIONS.map((status) => {
              const count = bookings.filter((b) => b.status === status).length;
              if (count === 0) return null;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status === statusFilter ? '' : status)}
                  className={cn(
                    "label flex items-center gap-1.5 text-[0.45rem] tracking-widest transition-colors",
                    statusFilter === status ? "text-sumi" : "text-muted-foreground hover:text-sumi/70"
                  )}
                >
                  <span className={cn(
                    "inline-block h-1.5 w-1.5 rounded-full",
                    STATUS_DOT[status] || 'bg-gin'
                  )} />
                  {t(`bookings.status.${status}`)}
                  <span className="num ml-0.5">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;