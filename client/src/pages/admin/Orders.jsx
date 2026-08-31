import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { fetchAllOrders, updateOrderStatus } from '../../features/orders/api';
import { cn } from '../../lib/utils';
import { formatPrice } from '../../features/menu/utils/formatPrice';
import { ChevronDown, ChevronRight, Package, Truck } from 'lucide-react';
import { useAdminLang } from '../../i18n/index-admin';

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'];

const STATUS_STYLES = {
  pending: 'bg-purple-100 text-purple-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_DOT = {
  pending: 'bg-purple-500',
  confirmed: 'bg-blue-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const FULFILLMENT_ICONS = {
  takeaway: Package,
  delivery: Truck,
};

const OrderRow = ({ order, onStatusChange, updating, t, lang }) => {
  const [expanded, setExpanded] = useState(false);
  const FulfillmentIcon = FULFILLMENT_ICONS[order.fulfillment] || Package;

  // Get item name based on language
  const getItemName = (item) => {
    if (typeof item.name === 'string') return item.name;
    return item.name?.[lang] || item.name?.en || item.name?.fr || 'Unknown';
  };

  return (
    <>
      <tr className="border-b border-gin/50 last:border-0 transition-colors hover:bg-gin/5">
        <td className="px-4 py-3 num whitespace-nowrap text-xs text-muted-foreground">
          {new Date(order.createdAt).toLocaleString()}
        </td>
        <td className="px-4 py-3 font-medium">{order.customerName}</td>
        <td className="px-4 py-3 num whitespace-nowrap text-xs text-muted-foreground">
          {order.phone}
        </td>
        <td className="px-4 py-3">
          <span className="label flex items-center gap-1.5 text-[0.45rem] tracking-widest text-muted-foreground">
            <FulfillmentIcon className="h-3 w-3" strokeWidth={1.5} />
            {order.fulfillment === 'delivery' ? t('orders.delivery') : t('orders.pickup')}
          </span>
        </td>
        <td className="px-4 py-3 num whitespace-nowrap font-medium">
          {formatPrice(order.totalPrice, lang)}
        </td>
        <td className="px-4 py-3">
          <span className={cn(
            "label inline-block px-2.5 py-1 text-[0.45rem] tracking-widest",
            STATUS_STYLES[order.status] || 'bg-gin/20 text-muted-foreground'
          )}>
        
            {t(`orders.status.${order.status}`)}
          </span>
        </td>
        <td className="px-4 py-3">
          <select
            value={order.status}
            disabled={updating}
            onChange={(e) => onStatusChange(order._id, e.target.value)}
            className={cn(
              "border border-gin bg-transparent px-2 py-1 text-xs focus:border-shu focus:outline-none disabled:opacity-40",
              updating && "animate-pulse"
            )}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">
                {t(`orders.status.${s}`)}
              </option>
            ))}
          </select>
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="label flex items-center gap-1 text-[0.45rem] tracking-widest text-muted-foreground transition-colors hover:text-sumi"
          >
            {expanded ? (
              <>
                <ChevronDown className="h-3 w-3" strokeWidth={1.5} />
                {t('orders.hide')}
              </>
            ) : (
              <>
                <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
                {t('orders.details')}
              </>
            )}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-gin/50 bg-gin/5">
          <td colSpan={8} className="px-4 py-4">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Items */}
              <div>
                <p className="label text-[0.45rem] tracking-[0.2em] text-muted-foreground">
                  {t('orders.items')}
                </p>
                <ul className="mt-2 space-y-1">
                  {order.items.map((item, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span>
                        <span className="num text-xs text-muted-foreground mr-2">{item.quantity}×</span>
                        {getItemName(item)}
                      </span>
                      <span className="num text-xs">{formatPrice(item.price * item.quantity, lang)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between border-t border-gin/50 pt-2 text-sm font-medium">
                  <span>{t('orders.total')}</span>
                  <span className="num">{formatPrice(order.totalPrice, lang)}</span>
                </div>
              </div>

              {/* Details */}
              <div>
                {order.fulfillment === 'delivery' && (
                  <div>
                    <p className="label text-[0.45rem] tracking-[0.2em] text-muted-foreground">
                      {t('orders.delivery')}
                    </p>
                    <p className="mt-2 text-sm">{order.address}</p>
                    {order.deliveryZone && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {order.deliveryZone.wilaya} · {formatPrice(order.deliveryZone.price, lang)} {t('orders.deliveryFee')}
                      </p>
                    )}
                  </div>
                )}
                {order.notes && (
                  <div className={cn(order.fulfillment === 'delivery' && 'mt-4')}>
                    <p className="label text-[0.45rem] tracking-[0.2em] text-muted-foreground">
                      {t('orders.notes')}
                    </p>
                    <p className="mt-2 text-sm italic text-muted-foreground">“{order.notes}”</p>
                  </div>
                )}
                {order.email && (
                  <div className={cn((order.fulfillment === 'delivery' || order.notes) && 'mt-4')}>
                    <p className="label text-[0.45rem] tracking-[0.2em] text-muted-foreground">
                      {t('orders.email')}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{order.email}</p>
                  </div>
                )}
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="label text-[0.4rem] tracking-[0.15em]">{t('orders.orderId')}</span>
                  <span className="num">{order._id}</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const Orders = () => {
  const { t, lang } = useAdminLang();
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: orders, loading, error } = useFetch(
    () => fetchAllOrders({ status: statusFilter || undefined }),
    [statusFilter, refreshKey]
  );

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, newStatus);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err.response?.data?.message || t('orders.failedToUpdateStatus'));
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilter = () => setStatusFilter('');
  const hasFilters = statusFilter;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="label text-[0.6rem] tracking-[0.3em] text-muted-foreground">
          {t('orders.restaurantOrders')}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight">{t('orders.ordersTitle')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('orders.ordersDescription')}
          {orders && (
            <span className="ml-2 num text-muted-foreground">
              · {orders.length} {t('orders.total')}
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-gin pb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gin bg-transparent px-3 py-2 text-sm focus:border-shu focus:outline-none"
        >
          <option value="">{t('orders.allStatuses')}</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="capitalize">
              {t(`orders.status.${s}`)}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={clearFilter}
            className="label flex items-center gap-1.5 text-[0.5rem] tracking-[0.15em] text-muted-foreground transition-colors hover:text-shu"
          >
            {t('orders.clearFilter')}
          </button>
        )}

        {hasFilters && orders && (
          <span className="label ml-auto text-[0.45rem] tracking-[0.15em] text-muted-foreground">
            {orders.length} {t('orders.result')}{orders.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto border border-gin bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="label text-muted-foreground">{t('orders.loadingOrders')}</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16">
            <p className="label text-shu">{t('orders.couldNotLoadOrders')}</p>
          </div>
        ) : orders?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="label text-muted-foreground">{t('orders.noOrdersFound')}</p>
            {hasFilters && (
              <button
                onClick={clearFilter}
                className="mt-3 label text-[0.5rem] tracking-[0.15em] text-shu hover:underline"
              >
                {t('orders.clearFilter')}
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gin bg-gin/10">
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('orders.placed')}</th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('orders.customer')}</th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('orders.phone')}</th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('orders.fulfillment')}</th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('orders.total')}</th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('orders.orderStatus')}</th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground">{t('orders.update')}</th>
                <th className="px-4 py-3 text-left label text-[0.5rem] tracking-[0.15em] text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  onStatusChange={handleStatusChange}
                  updating={updatingId === order._id}
                  t={t}
                  lang={lang}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer stats */}
      {orders && orders.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {t('orders.showing')} <span className="num">{orders.length}</span> {t('orders.orders')}
          </p>
          <div className="flex gap-4">
            {STATUS_OPTIONS.map((status) => {
              const count = orders.filter((o) => o.status === status).length;
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
                  {t(`orders.status.${status}`)}
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

export default Orders;