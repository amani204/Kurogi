import api from '../../lib/api';

export const registerStaff = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

export const fetchStaff = async () => {
  const { data } = await api.get('/auth/staff');
  return data;
};

export const deleteStaffAccount = async (id) => {
  const { data } = await api.delete(`/auth/staff/${id}`);
  return data;
};

export const updateMe = async (payload) => {
  const { data } = await api.put('/auth/me', payload);
  return data;
};