import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { fetchAllOrders, updateOrderStatus } from '../../features/orders/api';

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'];

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const OrderRow = ({ order, onStatusChange, updating }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr className="border-b border-neutral-100 last:border-0">
        <td className="px-4 py-3 whitespace-nowrap text-neutral-400">
          {new Date(order.createdAt).toLocaleString()}
        </td>
        <td className="px-4 py-3">{order.customerName}</td>
        <td className="px-4 py-3 whitespace-nowrap">{order.phone}</td>
        <td className="px-4 py-3 capitalize">{order.fulfillment}</td>
        <td className="px-4 py-3 whitespace-nowrap font-medium">{order.totalPrice} DA</td>
        <td className="px-4 py-3">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}>
            {order.status}
          </span>
        </td>
        <td className="px-4 py-3">
          <select
            value={order.status}
            disabled={updating}
            onChange={(e) => onStatusChange(order._id, e.target.value)}
            className="rounded border border-neutral-300 px-2 py-1 text-xs disabled:opacity-50"
          >
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-neutral-500 hover:text-neutral-900 underline"
          >
            {expanded ? 'Hide' : 'Details'}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-neutral-100 bg-neutral-50">
          <td colSpan={8} className="px-4 py-4">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-medium text-neutral-700 mb-1">Items</p>
                <ul className="space-y-0.5 text-neutral-600">
                  {order.items.map((item, i) => (
                    <li key={i}>{item.quantity}× {item.name} — {item.price * item.quantity} DA</li>
                  ))}
                </ul>
              </div>
              <div>
                {order.fulfillment === 'delivery' && (
                  <>
                    <p className="font-medium text-neutral-700 mb-1">Delivery</p>
                    <p className="text-neutral-600">{order.address}</p>
                    {order.deliveryZone && (
                      <p className="text-neutral-600">{order.deliveryZone.wilaya} — {order.deliveryZone.price} DA</p>
                    )}
                  </>
                )}
                {order.notes && (
                  <>
                    <p className="font-medium text-neutral-700 mt-3 mb-1">Notes</p>
                    <p className="text-neutral-600">{order.notes}</p>
                  </>
                )}
                {order.email && (
                  <>
                    <p className="font-medium text-neutral-700 mt-3 mb-1">Email</p>
                    <p className="text-neutral-600">{order.email}</p>
                  </>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const Orders = () => {
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
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Orders</h1>
      <p className="mt-1 text-sm text-neutral-500">View and manage food orders.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {statusFilter && (
          <button
            onClick={() => setStatusFilter('')}
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded border border-neutral-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-neutral-400">Loading...</div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-red-500">Couldn't load orders.</div>
        ) : orders?.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-400">No orders found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="px-4 py-3 font-medium">Placed</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Fulfillment</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Update</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  onStatusChange={handleStatusChange}
                  updating={updatingId === order._id}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;