import api from '../../lib/api';

export const fetchRestaurantSettings = async () => {
  const { data } = await api.get('/restaurant');
  return data;
};

export const updateRestaurantSettings = async (payload) => {
  const { data } = await api.put('/restaurant', payload);
  return data;
};