import api from '../../lib/api';

export const fetchAvailability = async (date) => {
  const { data } = await api.get('/bookings/availability', { params: { date } });
  return data.slots;
};

export const submitBooking = async (payload) => {
  const { data } = await api.post('/bookings', payload);
  return data;
};

export const cancelBookingRequest = async (token) => {
  const { data } = await api.patch(`/bookings/cancel/${token}`);
  return data;
};

// --- admin ---
export const fetchAllBookings = async ({ date, status } = {}) => {
  const params = {};
  if (date) params.date = date;
  if (status) params.status = status;
  const { data } = await api.get('/bookings', { params });
  return data;
};

export const updateBookingStatus = async (id, status) => {
  const { data } = await api.patch(`/bookings/${id}/status`, { status });
  return data;
};