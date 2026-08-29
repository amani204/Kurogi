import api from '../../lib/api';

export const fetchMenu = async ({ category, featured } = {}) => {
  const params = {};
  if (category) params.category = category;
  if (featured) params.featured = true;
  const { data } = await api.get('/menu', { params });
  return data;
};

export const fetchCategories = async () => {
  const { data } = await api.get('/categories');
  return data;
};

// --- admin ---
export const createMenuItem = async (payload) => {
  const { data } = await api.post('/menu', payload);
  return data;
};

export const updateMenuItem = async (id, payload) => {
  const { data } = await api.put(`/menu/${id}`, payload);
  return data;
};

export const deleteMenuItem = async (id) => {
  const { data } = await api.delete(`/menu/${id}`);
  return data;
};

export const toggleAvailability = async (id) => {
  const { data } = await api.patch(`/menu/${id}/availability`);
  return data;
};

export const toggleFeatured = async (id) => {
  const { data } = await api.patch(`/menu/${id}/featured`);
  return data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.url;
};


export const createCategory = async (payload) => {
  const { data } = await api.post('/categories', payload);
  return data;
};

export const updateCategory = async (id, payload) => {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data;
};

export const deleteCategory = async (id, options = {}) => {
  const { data } = await api.delete(`/categories/${id}`, { data: options });
  return data;
};