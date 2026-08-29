import api from '../../lib/api';

export const fetchDeliveryZones = async () => {
  const { data } = await api.get('/delivery-zones');
  return data;
};

export const submitOrder = async (payload) => {
  const { data } = await api.post('/orders', payload);
  return data;
};

export const cancelOrderRequest = async (token) => {
  const { data } = await api.patch(`/orders/cancel/${token}`);
  return data;
};

// --- admin ---
export const fetchAllOrders = async ({ status } = {}) => {
  const params = {};
  if (status) params.status = status;
  const { data } = await api.get('/orders', { params });
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.patch(`/orders/${id}/status`, { status });
  return data;
};