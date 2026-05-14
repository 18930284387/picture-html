import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getPhotos = async () => {
  const response = await api.get('/photos');
  return response.data;
};

export const getPhotoById = async (id: string) => {
  const response = await api.get(`/photos/${id}`);
  return response.data;
};

export const uploadPhoto = async (formData: FormData) => {
  const response = await api.post('/photos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const likePhoto = async (id: string) => {
  const response = await api.post(`/photos/${id}/like`);
  return response.data;
};

export const unlikePhoto = async (id: string) => {
  const response = await api.delete(`/photos/${id}/like`);
  return response.data;
};

export const addComment = async (photoId: string, text: string) => {
  const response = await api.post(`/photos/${photoId}/comments`, { text });
  return response.data;
};

export const addReply = async (commentId: string, text: string) => {
  const response = await api.post(`/comments/${commentId}/replies`, { text });
  return response.data;
};

export default api;
