import api from '../../lib/api';

export const fetchDeliveryZones = async () => {
  const { data } = await api.get('/delivery-zones');
  return data;
};

export const submitOrder = async (payload) => {
  const { data } = await api.post('/orders', payload); // { order, whatsappLink }
  return data;
};