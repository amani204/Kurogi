import api from '../../lib/api';

export const fetchRestaurantSettings = async () => {
  const { data } = await api.get('/restaurant');
  return data;
};