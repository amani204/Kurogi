import api from '../../lib/api';

export const fetchAvailability = async (date) => {
  const { data } = await api.get('/bookings/availability', { params: { date } });
  return data.slots;
};

export const submitBooking = async (payload) => {
  const { data } = await api.post('/bookings', payload); // { booking, whatsappLink }
  return data;
};

export const cancelBookingRequest = async (token) => {
  const { data } = await api.patch(`/bookings/cancel/${token}`);
  return data;
};