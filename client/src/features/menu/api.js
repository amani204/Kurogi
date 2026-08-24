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